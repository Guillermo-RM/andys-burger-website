import { appOrigin } from "./config";
import { NextResponse } from "next/server";

export const go = (path: string) => NextResponse.redirect(new URL(path, appOrigin()), { status: 303, headers: { "Cache-Control": "no-store" } });

export async function readForm(request: Request) {
  if (request.headers.get("content-type")?.split(";")[0] !== "application/x-www-form-urlencoded" || !request.body) return null;
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > 4096) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  return new URLSearchParams(Buffer.concat(chunks).toString("utf8"));
}
