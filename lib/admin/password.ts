import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
const options = { N: 131072, r: 8, p: 1, maxmem: 160 * 1024 * 1024 };

async function hash(password: string, salt: Buffer) {
  return await new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, 32, options, (error, key) => error ? reject(error) : resolve(key));
  });
}

export async function createPasswordHash(password: string) {
  if (password.length < 14 || Buffer.byteLength(password) > 256) throw new Error("Usá una contraseña de al menos 14 caracteres y como máximo 256 bytes.");
  const salt = randomBytes(16);
  return `scrypt-v1:${salt.toString("hex")}:${(await hash(password, salt)).toString("hex")}`;
}

export async function checkPassword(password: string, encoded: string) {
  if (!/^scrypt-v1:[0-9a-f]{32}:[0-9a-f]{64}$/.test(encoded)) throw new Error("Hash de contraseña inválido");
  if (!password || Buffer.byteLength(password) > 256) return false;
  const [, salt, expected] = encoded.split(":");
  return timingSafeEqual(await hash(password, Buffer.from(salt, "hex")), Buffer.from(expected, "hex"));
}
