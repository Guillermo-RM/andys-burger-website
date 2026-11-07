import { isSignedIn } from "@/lib/admin/access";
import { go, readForm } from "@/lib/admin/forms";
import { sameOrigin } from "@/lib/admin/session";
import { parsePrice, savePrice } from "@/features/website/prices";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return new Response(null, { status: 403 });
  if (!(await isSignedIn())) return new Response(null, { status: 401 });
  const form = await readForm(request);
  const id = form?.get("id") ?? "";
  const price = parsePrice(form?.get("price") ?? null);
  const expected = parsePrice(form?.get("expected") ?? null);
  if (price === null || expected === null) return go("/admin/website?estado=invalid");
  try {
    const status = await savePrice(id, expected, price);
    if (status === "saved") console.info("website.price_saved", { id, price });
    return go(`/admin/website?estado=${status}`);
  } catch {
    console.error("website.price_write_uncertain");
    return go("/admin/website?estado=uncertain");
  }
}
