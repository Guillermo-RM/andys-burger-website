import assert from "node:assert/strict";
import test from "node:test";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { randomBytes } from "node:crypto";
import { resolve } from "node:path";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { createPasswordHash } from "../lib/admin/password.ts";
import { createSession, hasSession } from "../lib/admin/session.ts";

test("una sesión firmada vence después de ocho horas", (t) => {
  const previousOrigin = process.env.APP_ORIGIN;
  const previousSecret = process.env.SESSION_SECRET;
  process.env.APP_ORIGIN = "http://127.0.0.1:40331";
  process.env.SESSION_SECRET = randomBytes(32).toString("base64url");
  t.after(() => {
    if (previousOrigin === undefined) delete process.env.APP_ORIGIN;
    else process.env.APP_ORIGIN = previousOrigin;
    if (previousSecret === undefined) delete process.env.SESSION_SECRET;
    else process.env.SESSION_SECRET = previousSecret;
  });
  const issuedAt = Math.floor(Date.now() / 1000) * 1000;
  let now = issuedAt;
  t.mock.method(Date, "now", () => now);
  const token = createSession();
  now = issuedAt + 8 * 60 * 60 * 1000 - 1;
  assert.equal(hasSession(token), true);
  now++;
  assert.equal(hasSession(token), false);
});

test("el panel protege Facturas y publica los precios en el website", { timeout: 100_000 }, async (t) => {
  const panel = resolve(import.meta.dirname, "..");
  const menu = new Map<string, string>();
  const invoiceWrites: Record<string, unknown>[] = [];
  const useSheets = process.env.TEST_MENU_SHEETS === "1";
  const sheetRows = [["the-boss", "The Boss", "Hamburguesas", 7500]];
  const menuScript = {
    PropertiesService: { getScriptProperties: () => ({
      getProperty: (key: string) => key === "MENU_SHEETS_SECRET" ? "test-menu-sheet" : "test-sheet",
    }) },
    SpreadsheetApp: {
      openById: () => ({ getSheetByName: () => ({
        getLastRow: () => sheetRows.length + 1,
        getRange: (row: number, column: number) => ({
          getValues: () => sheetRows,
          setValue: (value: number) => { sheetRows[row - 2][column - 1] = value; },
        }),
        appendRow: (row: (string | number)[]) => { sheetRows.push(row); },
      }) }),
      flush: () => {},
    },
    LockService: { getScriptLock: () => ({ tryLock: () => true, releaseLock: () => {} }) },
    ContentService: { MimeType: { JSON: "application/json" }, createTextOutput: (json: string) => ({ setMimeType: () => json }) },
  };
  const menuScriptSource = readFileSync(resolve(panel, "scripts/menu-prices.gs"), "utf8");
  const redis = createServer(async (req, res) => {
    try {
      const chunks: Buffer[] = [];
      for await (const chunk of req) chunks.push(chunk);
      const body = JSON.parse(Buffer.concat(chunks).toString());
      if (req.url === "/menu-sheet") {
        const result = runInNewContext(menuScriptSource + "\ndoPost(event)", {
          ...menuScript, event: { postData: { contents: JSON.stringify(body) } },
        });
        res.writeHead(200, { "Content-Type": "application/json" }).end(result);
        return;
      }
      if (req.url === "/apps-script") {
        assert.equal(body.secret, "test-apps-script");
        invoiceWrites.push(body);
        res.writeHead(200, { "Content-Type": "application/json" }).end(JSON.stringify({
          ok: true, invoice: { id: body.invoiceId ?? "MANUAL-TEST" },
        }));
        return;
      }
      const [op, , ...args] = body;
      const write = req.url === "/menu" && req.headers.authorization === "Bearer test-write";
      const read = req.url === "/menu" && req.headers.authorization === "Bearer test-read";
      let result: unknown;
      if ((read || write) && op === "HGETALL") result = [...menu].flat();
      else if (write && op === "EVAL") {
        const [, , id, base, expected, value] = args;
        const current = menu.get(id) ?? String(base);
        if (current === String(value)) result = 1;
        else if (current !== String(expected)) result = 0;
        else { menu.set(id, String(value)); result = 1; }
      } else { res.writeHead(403).end(); return; }
      res.writeHead(200, { "Content-Type": "application/json" }).end(JSON.stringify({ result }));
    } catch { res.writeHead(400).end(); }
  });
  redis.listen(0, "127.0.0.1");
  await once(redis, "listening");
  t.after(() => { redis.closeAllConnections(); redis.close(); });
  const address = redis.address();
  if (!address || typeof address === "string") throw new Error("No se inició el servicio de prueba");
  const storage = `http://127.0.0.1:${address.port}`;
  const panelUrl = "http://127.0.0.1:40331";
  const password = "clave-para-este-flujo-local";
  const menuStorage: Record<string, string> = useSheets
    ? { MENU_SHEETS_SCRIPT_URL: `${storage}/menu-sheet`, MENU_SHEETS_SECRET: "test-menu-sheet" }
    : {
      MENU_REDIS_URL: `${storage}/menu`, MENU_PRICE_KEY: "integration:prices",
      MENU_REDIS_READ_TOKEN: "test-read", MENU_REDIS_TOKEN: "test-write",
    };
  let logs = "";
  function start(cwd: string, url: string, env: Record<string, string>) {
    const port = new URL(url).port;
    const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-H", "127.0.0.1", "-p", port], {
      cwd, env: { ...process.env, ...env, NEXT_TELEMETRY_DISABLED: "1" }, stdio: ["ignore", "pipe", "pipe"],
    });
    child.stdout.on("data", (data) => { logs = (logs + data).slice(-12000); });
    child.stderr.on("data", (data) => { logs = (logs + data).slice(-12000); });
    t.after(() => { child.kill(); });
    return child;
  }
  async function ready(url: string) {
    const deadline = Date.now() + 45000;
    while (Date.now() < deadline) {
      try { if ((await fetch(url, { signal: AbortSignal.timeout(5000) })).ok) return; } catch {}
      await new Promise((done) => setTimeout(done, 300));
    }
    throw new Error(`Servidor no disponible: ${url}\n${logs}`);
  }
  start(panel, panelUrl, {
    ...menuStorage, APP_ORIGIN: panelUrl,
    ADMIN_PASSWORD_HASH: await createPasswordHash(password), SESSION_SECRET: randomBytes(32).toString("base64url"),
    GOOGLE_SHEET_PERIODS: "", GOOGLE_APPS_SCRIPT_URL: `${storage}/apps-script`, GOOGLE_APPS_SCRIPT_SECRET: "test-apps-script",
  });
  await ready(panelUrl + "/admin");
  const request = (path: string, options?: RequestInit) => fetch(panelUrl + path, { ...options, redirect: "manual" });
  const post = (path: string, values: Record<string, string>, cookie = "", origin = panelUrl) =>
    request(path, { method: "POST", headers: { Origin: origin, Cookie: cookie }, body: new URLSearchParams(values) });
  const unauthenticated = await request("/admin/website");
  assert.ok([303, 307, 308].includes(unauthenticated.status));
  assert.match(unauthenticated.headers.get("location") ?? "", /\/admin$/);
  assert.equal((await post("/admin/api/website/prices", {})).status, 401);
  const invoice = { name: "Prueba local", date: "2026-11-07", quantity: 2, unit: "kg", total: 4000 };
  const saveInvoice = (method: "POST" | "PATCH", body: object, cookie = "", origin = panelUrl) =>
    request("/admin/api/invoices", {
      method, headers: { Origin: origin, Cookie: cookie, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  assert.match((await request("/admin/facturas")).headers.get("location") ?? "", /\/admin$/);
  assert.equal((await saveInvoice("POST", invoice)).status, 401);
  assert.equal((await saveInvoice("PATCH", { ...invoice, invoiceId: "MANUAL-TEST" })).status, 401);
  assert.equal(invoiceWrites.length, 0);
  assert.match((await post("/admin/api/auth/login", { password: "wrong" })).headers.get("location") ?? "", /invalida/);
  const loggedIn = await post("/admin/api/auth/login", { password });
  assert.equal(loggedIn.status, 303);
  assert.equal(loggedIn.headers.get("location"), panelUrl + "/admin/facturas");
  const cookieHeader = loggedIn.headers.get("set-cookie") ?? "";
  assert.match(cookieHeader, /HttpOnly/i);
  assert.match(cookieHeader, /SameSite=strict/i);
  const cookie = cookieHeader.split(";")[0];
  const alteredCookie = cookie.slice(0, -1) + (cookie.endsWith("A") ? "B" : "A");
  assert.equal((await post("/admin/api/website/prices", {}, alteredCookie)).status, 401);
  const publicHome = await request("/");
  assert.equal(publicHome.status, 200);
  assert.doesNotMatch(publicHome.headers.get("x-robots-tag") ?? "", /noindex/);
  const home = await request("/admin", { headers: { Cookie: cookie } });
  assert.match(home.headers.get("x-robots-tag") ?? "", /noindex/);
  assert.equal(home.headers.get("location"), "/admin/facturas");
  const invoices = await request("/admin/facturas", { headers: { Cookie: cookie } });
  assert.equal(invoices.status, 200);
  assert.match(await invoices.text(), /Productos de las facturas/);
  assert.equal((await saveInvoice("POST", invoice, cookie, "https://external.example")).status, 403);
  assert.equal((await saveInvoice("POST", { ...invoice, total: 0 }, cookie)).status, 400);
  assert.equal(invoiceWrites.length, 0);
  assert.equal((await saveInvoice("POST", invoice, cookie)).status, 201);
  assert.equal((await saveInvoice("PATCH", { ...invoice, invoiceId: "MANUAL-TEST" }, cookie)).status, 200);
  assert.deepEqual(invoiceWrites.map(({ action, invoiceId }) => [action, invoiceId]), [
    [undefined, undefined], ["update", "MANUAL-TEST"],
  ]);
  const editor = await request("/admin/website", { headers: { Cookie: cookie } });
  assert.equal(editor.status, 200);
  assert.match(await editor.text(), /The Boss/);
  const values = { id: "the-boss", expected: "7500", price: "7619" };
  assert.equal((await post("/admin/api/website/prices", values, cookie, "https://external.example")).status, 403);
  assert.match((await post("/admin/api/website/prices", { ...values, id: "does-not-exist" }, cookie)).headers.get("location") ?? "", /estado=invalid/);
  assert.match((await post("/admin/api/website/prices", values, cookie)).headers.get("location") ?? "", /estado=saved/);
  if (useSheets) assert.equal(sheetRows[0][3], 7619);
  assert.match((await post("/admin/api/website/prices", { ...values, price: "7629" }, cookie)).headers.get("location") ?? "", /estado=conflict/);
  assert.match((await post("/admin/api/website/prices", values, cookie)).headers.get("location") ?? "", /estado=saved/);
  for (const path of ["/", "/menu"]) {
    const response = await fetch(panelUrl + path);
    assert.equal(response.status, 200);
    assert.match(await response.text(), /"price":7619/);
  }
  for (const path of ["/llms.txt", "/llms-full.txt"]) {
    assert.equal((await fetch(panelUrl + path)).status, 404);
  }
  const logout = await post("/admin/api/auth/logout", {}, cookie);
  assert.equal(logout.status, 303);
  assert.match(logout.headers.get("set-cookie") ?? "", /Max-Age=0/i);
  assert.equal((await post("/admin/api/website/prices", values)).status, 401);
  for (let i = 0; i < 5; i++) {
    assert.match((await post("/admin/api/auth/login", { password: "wrong" })).headers.get("location") ?? "", /estado=invalida/);
  }
  assert.match((await post("/admin/api/auth/login", { password })).headers.get("location") ?? "", /estado=limite/);
});
