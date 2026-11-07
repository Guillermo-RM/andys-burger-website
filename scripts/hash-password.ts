import { createPasswordHash } from "../lib/admin/password.ts";

// Lee la contraseña desde stdin; nunca la acepta como argumento de consola.
const chunks: Buffer[] = [];
for await (const chunk of process.stdin) chunks.push(chunk);
const password = Buffer.concat(chunks).toString("utf8").replace(/\r?\n$/, "");
console.log(await createPasswordHash(password));
