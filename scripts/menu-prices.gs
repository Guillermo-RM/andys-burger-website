function doPost(event) {
  try {
    const request = JSON.parse(event.postData.contents);
    const properties = PropertiesService.getScriptProperties();
    const secret = properties.getProperty("MENU_SHEETS_SECRET");
    if (!secret || !sameMenuSecret_(secret, request.secret)) {
      return menuJson_({ ok: false });
    }
    const sheet = SpreadsheetApp.openById(properties.getProperty("MENU_SHEET_ID")).getSheetByName("Precios");
    if (request.action === "list") {
      const prices = menuRows_(sheet).filter(([id]) => id).map(([id, , , price]) => [id, price]);
      return menuJson_({ ok: true, prices });
    }
    if (request.action !== "save" || typeof request.id !== "string" || !/^[a-z0-9-]{1,80}$/.test(request.id)
      || ![request.expected, request.price, request.basePrice].every(validMenuPrice_)
      || typeof request.name !== "string" || typeof request.group !== "string"
      || [request.name, request.group].some((value) => !value || value.length > 160 || value.startsWith("="))) {
      return menuJson_({ ok: false });
    }
    const lock = LockService.getScriptLock();
    if (!lock.tryLock(4000)) return menuJson_({ ok: false });
    try {
      const rows = menuRows_(sheet);
      const rowIndex = rows.findIndex(([id]) => id === request.id);
      const current = rowIndex < 0 ? request.basePrice : rows[rowIndex][3];
      if (current === request.price) return menuJson_({ ok: true, status: "saved" });
      if (current !== request.expected) return menuJson_({ ok: true, status: "conflict" });
      if (rowIndex < 0) {
        sheet.appendRow([request.id, request.name, request.group, request.price]);
      } else {
        sheet.getRange(rowIndex + 2, 4).setValue(request.price);
      }
      SpreadsheetApp.flush();
      return menuJson_({ ok: true, status: "saved" });
    } finally {
      lock.releaseLock();
    }
  } catch {
    return menuJson_({ ok: false });
  }
}

function menuRows_(sheet) {
  const rowCount = sheet.getLastRow() - 1;
  return rowCount > 0 ? sheet.getRange(2, 1, rowCount, 4).getValues() : [];
}

function validMenuPrice_(value) {
  return Number.isSafeInteger(value) && value >= 1 && value <= 1000000;
}

function sameMenuSecret_(expected, supplied) {
  if (typeof supplied !== "string" || supplied.length !== expected.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) mismatch |= expected.charCodeAt(i) ^ supplied.charCodeAt(i);
  return mismatch === 0;
}

function menuJson_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
