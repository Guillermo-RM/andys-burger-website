import { NextResponse } from "next/server";
import { isSignedIn } from "@/lib/admin/access";
import { sameOrigin } from "@/lib/admin/session";
import {
  appendManualInvoiceToGoogleSheets,
  updateManualInvoiceInGoogleSheets,
  type ManualInvoiceInput,
  type ManualInvoiceUpdateInput,
} from "@/features/facturas/google-sheets";

function isManualInvoiceInput(value: unknown): value is ManualInvoiceInput {
  if (!value || typeof value !== "object") return false;
  const input = value as Record<string, unknown>;
  return typeof input.name === "string" && input.name.trim().length > 0
    && (input.supplier === undefined || typeof input.supplier === "string")
    && typeof input.total === "number" && Number.isFinite(input.total) && input.total > 0
    && typeof input.quantity === "number" && Number.isFinite(input.quantity) && input.quantity > 0
    && typeof input.unit === "string" && input.unit.trim().length > 0
    && typeof input.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(input.date)
    && (input.unitPrice === undefined || (typeof input.unitPrice === "number" && Number.isFinite(input.unitPrice) && input.unitPrice > 0));
}

function isManualInvoiceUpdateInput(value: unknown): value is ManualInvoiceUpdateInput {
  if (!isManualInvoiceInput(value)) return false;
  const invoiceId = (value as Record<string, unknown>).invoiceId;
  return typeof invoiceId === "string" && /^MANUAL-/.test(invoiceId.trim());
}

async function saveManualInvoice(request: Request, updating: boolean) {
  if (!(await isSignedIn())) {
    return NextResponse.json({ error: "Iniciá sesión para continuar." }, { status: 401 });
  }
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "Origen de la solicitud inválido." }, { status: 403 });
  }
  const input: unknown = await request.json().catch(() => null);
  try {
    let invoice;
    if (updating) {
      if (!isManualInvoiceUpdateInput(input)) {
        return NextResponse.json({ error: "Los datos de la factura no son válidos." }, { status: 400 });
      }
      invoice = await updateManualInvoiceInGoogleSheets(input);
    } else {
      if (!isManualInvoiceInput(input)) {
        return NextResponse.json({ error: "Los datos de la factura no son válidos." }, { status: 400 });
      }
      invoice = await appendManualInvoiceToGoogleSheets(input);
    }
    return NextResponse.json({ invoice }, { status: updating ? 200 : 201 });
  } catch (error) {
    console.error(`No fue posible ${updating ? "editar" : "agregar"} la factura manual.`, error);
    const missingCredentials = error instanceof Error && error.message.startsWith("Falta configurar la conexión segura");
    return NextResponse.json(
      { error: missingCredentials ? "Falta configurar la autorización de escritura de Google Sheets." : `No fue posible ${updating ? "actualizar" : "guardar"} la factura en Google Sheets.` },
      { status: missingCredentials ? 503 : 500 },
    );
  }
}

export function POST(request: Request) {
  return saveManualInvoice(request, false);
}

export function PATCH(request: Request) {
  return saveManualInvoice(request, true);
}
