import { cookies } from "next/headers";
import { go } from "@/lib/admin/forms";
import { cookieName, cookieOptions, revokeSession, sameOrigin } from "@/lib/admin/session";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return new Response(null, { status: 403 });
  try {
    await revokeSession((await cookies()).get(cookieName())?.value);
  } catch {
    console.error("admin.logout_unavailable");
    return new Response("No se pudo cerrar la sesión. Volvé a intentarlo.", { status: 503 });
  }
  const response = go("/admin");
  response.cookies.set(cookieName(), "", { ...cookieOptions(), maxAge: 0 });
  return response;
}
