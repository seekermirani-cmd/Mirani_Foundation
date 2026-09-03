/**
 * Mirani Foundation — General queries Apps Script Web App
 * -----------------------------------------------------------------------
 * Paste this whole file into Extensions > Apps Script on the Google Sheet
 * you want to use as the general-query datastore, then deploy it as a Web
 * App. Full setup steps are in GOOGLE_SHEET_CONTACT_SETUP.md.
 *
 * This is a write-only endpoint (doPost only) — there's no admin page that
 * reads queries back into the site, so no doGet is needed.
 */

const SHEET_NAME = "Queries";

/** Reads the optional shared secret from the script's Properties (Project
 * Settings > Script properties). Leave unset to skip the check entirely. */
function getSecret_() {
  return PropertiesService.getScriptProperties().getProperty("SHEET_SECRET") || "";
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["name", "email", "phone", "location", "message", "createdAt"]);
  }
  return sheet;
}

function jsonOutput_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

/** POST — appends one new query row. */
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const secret = getSecret_();
    if (secret && body.secret !== secret) {
      return jsonOutput_({ success: false, error: "Unauthorized" });
    }

    const sheet = getSheet_();
    sheet.appendRow([
      body.name || "",
      body.email || "",
      body.phone || "",
      body.location || "",
      body.message || "",
      new Date().toISOString(),
    ]);

    return jsonOutput_({ success: true });
  } catch (err) {
    return jsonOutput_({ success: false, error: String(err) });
  }
}
