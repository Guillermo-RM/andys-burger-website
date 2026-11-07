import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cookieName, hasSession } from "./session";

export const isSignedIn = cache(async () => {
  const jar = await cookies();
  try {
    return await hasSession(jar.get(cookieName())?.value);
  } catch {
    console.error("admin.session_unavailable");
    return false;
  }
});

export async function requireAdmin() {
  if (!(await isSignedIn())) redirect("/admin");
}
