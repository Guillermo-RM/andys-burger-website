import { menuCatalog } from "@/lib/menu-catalog";
import { redis } from "@/lib/admin/redis";

export const priceKey = () => process.env.MENU_PRICE_KEY?.trim() || "andys:website:prices:v1";
export const validId = (value: unknown): value is string => typeof value === "string" && /^[a-z0-9-]{1,80}$/.test(value);
export const validPrice = (value: unknown): value is number => typeof value === "number" && Number.isSafeInteger(value) && value >= 1 && value <= 1_000_000;
export const parsePrice = (value: FormDataEntryValue | null) =>
  typeof value === "string" && /^\d{1,7}$/.test(value) && validPrice(Number(value)) ? Number(value) : null;

export async function getEditablePrices() {
  const fields = await redis<string[]>("MENU", "HGETALL", priceKey());
  const overrides = new Map<string, number>();
  for (let i = 0; i < fields.length; i += 2) {
    const price = Number(fields[i + 1]);
    if (validPrice(price)) overrides.set(fields[i], price);
  }
  return menuCatalog.map((item) => ({ ...item, price: overrides.get(item.id) ?? item.basePrice }));
}

export async function savePrice(id: string, expected: number, price: number) {
  if (!validId(id) || !validPrice(expected) || !validPrice(price)) return "invalid";
  const item = menuCatalog.find((entry) => entry.id === id);
  if (!item) return "invalid";
  const result = await redis<number>("MENU", "EVAL",
    "local current = redis.call('HGET', KEYS[1], ARGV[1]) or ARGV[2]; if current == ARGV[4] then return 1 end; if current ~= ARGV[3] then return 0 end; redis.call('HSET', KEYS[1], ARGV[1], ARGV[4]); return 1",
    1, priceKey(), id, item.basePrice, expected, price);
  return result === 1 ? "saved" : "conflict";
}
