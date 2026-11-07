export function required(key: string) {
  const value = process.env[key]?.trim();
  if (!value) throw new Error(`Falta la configuración ${key}`);
  return value;
}

export function configuredUrl(value: string) {
  const url = new URL(value);
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  if (url.username || url.password || (url.protocol !== "https:" && !(local && url.protocol === "http:"))) {
    throw new Error("La URL requiere HTTPS");
  }
  return url;
}

export const appOrigin = () => configuredUrl(required("APP_ORIGIN")).origin;
