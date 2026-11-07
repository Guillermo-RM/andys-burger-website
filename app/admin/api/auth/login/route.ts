import { required } from "@/lib/admin/config";
import { go, readForm } from "@/lib/admin/forms";
import { checkPassword } from "@/lib/admin/password";
import { allowAttempt, cookieName, cookieOptions, createSession, sameOrigin } from "@/lib/admin/session";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return new Response(null, { status: 403 });
  try {
    const password = (await readForm(request))?.get("password");
    if (!password) return go("/admin?estado=invalida");
    if (!(await allowAttempt())) return go("/admin?estado=limite");
    if (!(await checkPassword(password, required("ADMIN_PASSWORD_HASH")))) {
      console.info("admin.login_failed");
      return go("/admin?estado=invalida");
    }
    const response = go("/admin/facturas");
    response.cookies.set(cookieName(), await createSession(), cookieOptions());
    console.info("admin.login");
    return response;
  } catch {
    console.error("admin.login_unavailable");
    return go("/admin?estado=servicio");
  }
}
