import { go } from "@/lib/admin/forms";
import { cookieName, cookieOptions, sameOrigin } from "@/lib/admin/session";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return new Response(null, { status: 403 });
  const response = go("/admin");
  response.cookies.set(cookieName(), "", { ...cookieOptions(), maxAge: 0 });
  return response;
}
