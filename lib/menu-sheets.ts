import { configuredUrl, required } from "@/lib/admin/config";

type Request = { action: "list" } | { action: "save"; id: string; expected: number; price: number; basePrice: number; name: string; group: string };

export const usesMenuSheets = () => Boolean(process.env.MENU_SHEETS_SCRIPT_URL || process.env.MENU_SHEETS_SECRET);

async function callMenuSheet(body: Request) {
  const url = configuredUrl(required("MENU_SHEETS_SCRIPT_URL"));
  if (url.protocol === "https:" && (url.origin !== "https://script.google.com" || !/^\/macros\/s\/[\w-]+\/exec$/.test(url.pathname))) {
    throw new Error("URL de Apps Script inválida");
  }
  const signal = AbortSignal.timeout(8000);
  let response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, secret: required("MENU_SHEETS_SECRET") }),
    cache: "no-store",
    redirect: "manual",
    signal,
  });
  if (response.status === 302 || response.status === 303) {
    const destination = new URL(response.headers.get("location") ?? "", url);
    if (destination.origin !== "https://script.googleusercontent.com") throw new Error("Redirección de Apps Script inválida");
    response = await fetch(destination, { cache: "no-store", redirect: "error", signal });
  }
  if (!response.ok) throw new Error("Google Sheets no disponible");
  const result = await response.json() as { ok?: boolean; prices?: unknown; status?: unknown };
  if (!result.ok) throw new Error("Google Sheets rechazó la operación");
  return result;
}

export async function readMenuSheet() {
  const { prices } = await callMenuSheet({ action: "list" });
  if (!Array.isArray(prices)) throw new Error("Respuesta de precios inválida");
  const entries = new Map<string, number>();
  for (const row of prices) {
    if (!Array.isArray(row)) throw new Error("Fila de precios inválida");
    const [id, price] = row;
    if (typeof id !== "string" || !Number.isSafeInteger(price) || price < 1 || price > 1_000_000 || entries.has(id)) {
      throw new Error("Fila de precios inválida");
    }
    entries.set(id, price);
  }
  return entries;
}

export async function saveMenuSheet(input: Omit<Extract<Request, { action: "save" }>, "action">) {
  const { status } = await callMenuSheet({ action: "save", ...input });
  if (status !== "saved" && status !== "conflict") throw new Error("Resultado de escritura inválido");
  return status;
}
