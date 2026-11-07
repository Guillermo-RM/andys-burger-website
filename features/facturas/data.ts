import "server-only";

import { readInvoicesFromGoogleSheets } from "./google-sheets";
import type { Invoice } from "./types";

export type DashboardData = {
  invoices: Invoice[];
  sourceLabel: string;
  sourceIsLive: boolean;
};

export async function getDashboardData(): Promise<DashboardData> {
  try {
    const invoices = await readInvoicesFromGoogleSheets();
    return {
      invoices,
      sourceLabel: "Google Sheets sincronizado",
      sourceIsLive: true,
    };
  } catch (error) {
    console.error("No fue posible leer Google Sheets.", error);
    return {
      invoices: [],
      sourceLabel: "No se pudo sincronizar Google Sheets",
      sourceIsLive: false,
    };
  }
}
