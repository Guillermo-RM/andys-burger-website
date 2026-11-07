import { configuredUrl, required } from "./config.ts";

export async function redis<T>(scope: "MENU", ...command: (string | number)[]) {
  const url = configuredUrl(required(`${scope}_REDIS_URL`));
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${required(`${scope}_REDIS_TOKEN`)}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(4500),
  });
  if (!response.ok) throw new Error(`Almacenamiento ${scope} no disponible`);
  const data = (await response.json()) as { result?: T; error?: string };
  if (data.error || !Object.hasOwn(data, "result")) throw new Error(`Respuesta inválida de ${scope}`);
  return data.result as T;
}
