import { isIP } from "node:net";
import { required } from "@/lib/admin/config";
import { go, readForm } from "@/lib/admin/forms";
import { checkPassword } from "@/lib/admin/password";
import { cookieName, cookieOptions, createSession, sameOrigin } from "@/lib/admin/session";

const attempts = new Map<string, { count: number; expiresAt: number }>();
const attemptLimit = 5;
const attemptWindowMs = 15 * 60 * 1000;
const trackedIpLimit = 1024;

function allowAttempt(ip: string) {
  const now = Date.now();
  // Las ventanas se insertan en orden y vencen después del mismo intervalo.
  for (const [key, attempt] of attempts) {
    if (attempt.expiresAt > now) break;
    attempts.delete(key);
  }
  const existing = attempts.get(ip);
  if (existing) {
    if (existing.count >= attemptLimit) return false;
    existing.count++;
    return true;
  }
  if (attempts.size >= trackedIpLimit) return false;
  attempts.set(ip, { count: 1, expiresAt: now + attemptWindowMs });
  return true;
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return new Response(null, { status: 403 });
  try {
    const password = (await readForm(request))?.get("password");
    if (!password) return go("/admin?estado=invalida");
    const forwardedIp = request.headers.get("x-vercel-forwarded-for")?.trim() ?? "";
    const ip = isIP(forwardedIp) ? forwardedIp : "unknown";
    if (!allowAttempt(ip)) return go("/admin?estado=limite");
    if (!(await checkPassword(password, required("ADMIN_PASSWORD_HASH")))) {
      console.info("admin.login_failed");
      return go("/admin?estado=invalida");
    }
    const response = go("/admin/facturas");
    response.cookies.set(cookieName(), createSession(), cookieOptions());
    attempts.delete(ip);
    console.info("admin.login");
    return response;
  } catch {
    console.error("admin.login_unavailable");
    return go("/admin?estado=servicio");
  }
}
