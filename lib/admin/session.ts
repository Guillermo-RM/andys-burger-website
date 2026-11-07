import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { appOrigin, required } from "./config.ts";

const ttl = 60 * 60 * 8;
export const cookieName = () => appOrigin().startsWith("https:") ? "__Host-andys-admin" : "andys-admin-local";
export const cookieOptions = () => ({ httpOnly: true, secure: appOrigin().startsWith("https:"), sameSite: "strict" as const, path: "/", maxAge: ttl });
const sign = (payload: string) => {
  const secret = required("SESSION_SECRET");
  if (secret.length < 43) throw new Error("SESSION_SECRET requiere 32 bytes aleatorios o más");
  return createHmac("sha256", secret).update(`andys-admin:v2:${appOrigin()}:${payload}`).digest("base64url");
};

export function createSession() {
  const expiresAt = Math.floor(Date.now() / 1000) + ttl;
  const payload = `${expiresAt}.${randomBytes(32).toString("base64url")}`;
  return `${payload}.${sign(payload)}`;
}

export function hasSession(token?: string) {
  if (!token || !/^\d{1,12}\.[A-Za-z0-9_-]{43}\.[A-Za-z0-9_-]{43}$/.test(token)) return false;
  const [expiresAt, nonce, signature] = token.split(".");
  if (Number(expiresAt) * 1000 <= Date.now()) return false;
  return timingSafeEqual(Buffer.from(signature), Buffer.from(sign(`${expiresAt}.${nonce}`)));
}

export function sameOrigin(request: Request) {
  return request.headers.get("origin") === appOrigin();
}
