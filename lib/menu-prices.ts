import { menuWithPrices } from "@/lib/menu";
import { readMenuSheet, usesMenuSheets } from "@/lib/menu-sheets";

async function readPublishedPrices(endpoint: string, key: string) {
  const url = new URL(endpoint);
  if (url.protocol !== "https:" && !(url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname))) {
    throw new Error("Invalid menu storage URL");
  }
  const token = process.env.MENU_REDIS_READ_TOKEN;
  if (!token) throw new Error("Missing read token");
  const response = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(["HGETALL", key]),
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(2500),
  });
  if (!response.ok) throw new Error("Menu storage not available");
  const { result } = await response.json() as { result?: unknown };
  if (!Array.isArray(result) || result.length % 2 !== 0) throw new Error("Invalid menu storage response");
  const entries: [string, number][] = [];
  for (let i = 0; i < result.length; i += 2) {
    const [id, raw] = [result[i], result[i + 1]];
    const price = typeof raw === "string" && /^\d{1,7}$/.test(raw) ? Number(raw) : NaN;
    if (typeof id === "string" && Number.isSafeInteger(price) && price >= 1 && price <= 1_000_000) entries.push([id, price]);
  }
  return entries;
}

export async function getPublishedMenu() {
  const endpoint = process.env.MENU_REDIS_URL;
  try {
    if (usesMenuSheets()) return menuWithPrices(await readMenuSheet());
    if (!endpoint && !process.env.MENU_REDIS_READ_TOKEN) return menuWithPrices();
    if (!endpoint) throw new Error("Missing menu storage URL");
    const entries = await readPublishedPrices(endpoint, process.env.MENU_PRICE_KEY || "andys:website:prices:v1");
    return menuWithPrices(new Map(entries));
  } catch {
    console.error("website.menu_prices_unavailable");
    return menuWithPrices();
  }
}
