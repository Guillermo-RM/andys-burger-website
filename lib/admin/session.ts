import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { appOrigin, required } from "./config.ts";
import { redis } from "./redis.ts";

const ttl = 60 * 60 * 8;
const namespace = () => `andys-admin:v1:${createHash("sha256").update(appOrigin()).digest("hex").slice(0, 16)}`;
export const cookieName = () => appOrigin().startsWith("https:") ? "__Host-andys-admin" : "andys-admin-local";
export const cookieOptions = () => ({ httpOnly: true, secure: appOrigin().startsWith("https:"), sameSite: "strict" as const, path: "/", maxAge: ttl });
const key = (id: string) => `${namespace()}:session:${createHash("sha256").update(id).digest("hex")}`;
const sign = (id: string) => {
  const secret = required("SESSION_SECRET");
  if (secret.length < 43) throw new Error("SESSION_SECRET requiere 32 bytes aleatorios o más");
  return createHmac("sha256", secret).update(`${namespace()}:v1:${id}`).digest("base64url");
};

function verifiedId(token?: string) {
  if (!token || !/^[A-Za-z0-9_-]{43}\.[A-Za-z0-9_-]{43}$/.test(token)) return null;
  const [id, signature] = token.split(".");
  return timingSafeEqual(Buffer.from(signature), Buffer.from(sign(id))) ? id : null;
}

export async function createSession() {
  const id = randomBytes(32).toString("base64url");
  const token = `${id}.${sign(id)}`;
  await redis("AUTH", "SET", key(id), "active", "EX", ttl);
  return token;
}

export async function hasSession(token?: string) {
  const id = verifiedId(token);
  return id !== null && (await redis<string | null>("AUTH", "GET", key(id))) === "active";
}

export async function revokeSession(token?: string) {
  const id = verifiedId(token);
  if (id) await redis("AUTH", "DEL", key(id));
}

export async function allowAttempt() {
  // Un límite global para la única cuenta; se aplica antes de calcular scrypt.
  const result = await redis<number>("AUTH", "EVAL",
    "local n = redis.call('INCR', KEYS[1]); if n == 1 then redis.call('EXPIRE', KEYS[1], 60) end; return n",
    1, `${namespace()}:login-attempts`);
  return result <= 8;
}

export function sameOrigin(request: Request) {
  return request.headers.get("origin") === appOrigin();
}
