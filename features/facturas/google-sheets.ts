import "server-only";

import type { ExpenseItem, Invoice } from "./types";

type SheetValue = string | number | boolean | null;

export type ManualInvoiceInput = {
  name: string;
  supplier?: string;
  total: number;
  quantity: number;
  unit: string;
  date: string;
  unitPrice?: number;
};

export type ManualInvoiceUpdateInput = ManualInvoiceInput & {
  invoiceId: string;
};

const defaultSpreadsheetId = "1P29Bz-leVrtzBVkr-bCR2ENrs01x9RU5zdmkVAwEk-s";
const defaultPeriods = ["2026_10", "2026_11", "2026_12"];
function spreadsheetId() {
  return process.env.GOOGLE_SHEET_ID || defaultSpreadsheetId;
}

function monthlySources() {
  const periods = (process.env.GOOGLE_SHEET_PERIODS?.split(",") ?? defaultPeriods)
    .map((period) => period.trim())
    .filter(Boolean);
  return [...new Set(periods)].map((period) => {
    if (!/^\d{4}_(0[1-9]|1[0-2])$/.test(period)) {
      throw new Error(`Periodo de Google Sheets inválido: ${period}`);
    }
    const year = period.slice(0, 4);
    const id = year === "2026" ? spreadsheetId() : process.env[`GOOGLE_SHEET_ID_${year}`];
    if (!id) throw new Error(`Falta configurar GOOGLE_SHEET_ID_${year}.`);
    return { id, period, invoiceSheet: `Facturas_${period}`, productSheet: `Productos_${period}` };
  });
}

function toText(value: SheetValue | undefined) {
  return value == null ? "" : String(value).trim();
}

function toNumber(value: SheetValue | undefined) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const normalized = toText(value).replace(/[^\d,.-]/g, "").replace(/,/g, "");
  const number = Number(normalized);
  return Number.isFinite(number) ? number : 0;
}

function validIsoDate(year: number, month: number, day: number) {
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year
    || date.getUTCMonth() !== month - 1
    || date.getUTCDate() !== day
  ) return "";
  return date.toISOString().slice(0, 10);
}

function toIsoDate(value: SheetValue | undefined) {
  if (typeof value === "number") {
    const date = new Date(Date.UTC(1899, 11, 30) + value * 86_400_000);
    return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
  }
  const text = toText(value);
  const isoDate = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoDate) {
    const [, year, month, day] = isoDate;
    return validIsoDate(Number(year), Number(month), Number(day));
  }

  const slashDate = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (slashDate) {
    const [, first, second, year] = slashDate;
    const firstNumber = Number(first);
    const secondNumber = Number(second);
    // Las facturas importadas usan día/mes/año. Cuando el segundo valor supera
    // 12, el texto solo puede estar en el formato estadounidense mes/día/año.
    const [month, day] = secondNumber > 12
      ? [firstNumber, secondNumber]
      : [secondNumber, firstNumber];
    return validIsoDate(Number(year), month, day);
  }
  return "";
}

function parseCsv(csv: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < csv.length; index += 1) {
    const character = csv[index];
    if (character === '"') {
      if (quoted && csv[index + 1] === '"') {
        value += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      row.push(value);
      value = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && csv[index + 1] === "\n") index += 1;
      row.push(value);
      if (row.some((cell) => cell !== "")) rows.push(row);
      row = [];
      value = "";
    } else {
      value += character;
    }
  }
  if (value || row.length) {
    row.push(value);
    if (row.some((cell) => cell !== "")) rows.push(row);
  }
  return rows;
}

async function readPublicSheet(id: string, sheetName: string) {
  const endpoint = new URL(`https://docs.google.com/spreadsheets/d/${encodeURIComponent(id)}/gviz/tq`);
  endpoint.searchParams.set("tqx", "out:csv");
  endpoint.searchParams.set("sheet", sheetName);
  const response = await fetch(endpoint, { cache: "no-store" });
  if (!response.ok) throw new Error(`Google Sheets respondió con el estado ${response.status}.`);
  const rows = parseCsv(await response.text());
  const firstHeader = rows[0]?.[0]?.replace(/^\uFEFF/, "").trim();
  const secondHeader = rows[0]?.[1]?.trim();
  const expectedSecondHeader = sheetName.startsWith("Facturas") ? "Número" : "ID factura";
  if (firstHeader !== "ID" || secondHeader !== expectedSecondHeader) {
    throw new Error(`La pestaña ${sheetName} no existe o no tiene las columnas esperadas.`);
  }
  return rows.slice(1);
}

type SheetSnapshot = { invoiceRows: string[][]; itemRows: string[][]; priority: number };

function parseSnapshot({ invoiceRows, itemRows, priority }: SheetSnapshot) {
  const records = invoiceRows.flatMap((row) => {
    const id = toText(row[0]);
    const number = toText(row[1]);
    const date = toIsoDate(row[2]);
    if ((!id && !number) || !date) return [];
    return [{
      invoice: {
        id: id || number,
        number,
        date,
        supplier: toText(row[3]),
        subtotal: toNumber(row[6]),
        tax: toNumber(row[7]),
        total: toNumber(row[8]),
        items: [],
      } as Invoice,
      registeredAt: toText(row[11]),
      priority,
    }];
  });
  const invoicesById = new Map(records.map(({ invoice }) => [invoice.id, invoice]));
  for (const row of itemRows) {
    const id = toText(row[0]);
    const invoiceId = toText(row[1]);
    const invoice = invoicesById.get(invoiceId);
    if ((!id && !invoiceId) || !invoice) continue;
    const item: ExpenseItem = {
      id: id || `${invoiceId}-${invoice.items.length + 1}`,
      invoiceId,
      invoiceNumber: toText(row[2]) || invoice.number,
      date: invoice.date,
      supplier: invoice.supplier,
      description: toText(row[3]),
      category: toText(row[4]) || "Sin categoría",
      quantity: toNumber(row[5]),
      unit: toText(row[6]),
      unitPrice: toNumber(row[7]),
      total: toNumber(row[9]),
    };
    invoice.items.push(item);
  }
  return records;
}

export async function readInvoicesFromGoogleSheets(): Promise<Invoice[]> {
  const sources = monthlySources();
  const snapshots = await Promise.all(sources.map(async (source, priority) => {
    const [invoiceRows, itemRows] = await Promise.all([
      readPublicSheet(source.id, source.invoiceSheet),
      readPublicSheet(source.id, source.productSheet),
    ]);
    return { invoiceRows, itemRows, priority };
  }));
  const byId = new Map<string, ReturnType<typeof parseSnapshot>[number]>();
  for (const snapshot of snapshots) {
    for (const record of parseSnapshot(snapshot)) {
      const previous = byId.get(record.invoice.id);
      if (!previous) {
        byId.set(record.invoice.id, record);
      } else if (
        record.registeredAt > previous.registeredAt
        || (record.registeredAt === previous.registeredAt && record.priority > previous.priority)
      ) {
        if (!record.invoice.items.length && previous.invoice.items.length) {
          record.invoice.items = previous.invoice.items;
        }
        byId.set(record.invoice.id, record);
      } else if (!previous.invoice.items.length && record.invoice.items.length) {
        previous.invoice.items = record.invoice.items;
      }
    }
  }
  return [...byId.values()]
    .map(({ invoice }) => invoice)
    .sort((left, right) => left.date.localeCompare(right.date) || left.id.localeCompare(right.id));
}

async function writeManualInvoiceToGoogleSheets(
  input: ManualInvoiceInput | (ManualInvoiceUpdateInput & { action: "update" }),
): Promise<Invoice> {
  const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
  const appsScriptSecret = process.env.GOOGLE_APPS_SCRIPT_SECRET;
  if (!appsScriptUrl || !appsScriptSecret) {
    throw new Error("Falta configurar la conexión segura de Google Apps Script.");
  }
  const response = await fetch(appsScriptUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ...input, secret: appsScriptSecret }),
    cache: "no-store",
  });
  const result = await response.json() as { ok?: boolean; invoice?: Invoice; error?: string };
  if (!response.ok || !result.ok || !result.invoice) {
    throw new Error(result.error || `Apps Script respondió con el estado ${response.status}.`);
  }
  return result.invoice;
}

export function appendManualInvoiceToGoogleSheets(input: ManualInvoiceInput) {
  return writeManualInvoiceToGoogleSheets(input);
}

export function updateManualInvoiceInGoogleSheets(input: ManualInvoiceUpdateInput) {
  return writeManualInvoiceToGoogleSheets({ ...input, action: "update" });
}
