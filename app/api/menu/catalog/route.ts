import { menuCatalog } from "@/lib/menu-catalog";

export const dynamic = "force-static";

export function GET() {
  return Response.json({
    version: 1,
    items: menuCatalog,
  });
}
