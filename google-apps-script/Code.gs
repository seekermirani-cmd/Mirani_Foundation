/**
 * Mirani Foundation — Blog posts Apps Script Web App
 * -----------------------------------------------------------------------
 * Paste this whole file into Extensions > Apps Script on the Google Sheet
 * you want to use as the blog datastore, then deploy it as a Web App.
 * Full setup steps are in GOOGLE_SHEET_BLOG_SETUP.md.
 */

const SHEET_NAME = "Posts";

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
    sheet.appendRow(["slug", "title", "excerpt", "content", "category", "date", "image", "createdAt"]);
  }
  return sheet;
}

function jsonOutput_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

/** POST — appends one new blog post row. */
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const secret = getSecret_();
    if (secret && body.secret !== secret) {
      return jsonOutput_({ success: false, error: "Unauthorized" });
    }

    const sheet = getSheet_();
    sheet.appendRow([
      body.slug || "",
      body.title || "",
      body.excerpt || "",
      body.content || "",
      body.category || "",
      body.date || "",
      body.image || "",
      new Date().toISOString(),
    ]);

    return jsonOutput_({ success: true });
  } catch (err) {
    return jsonOutput_({ success: false, error: String(err) });
  }
}

/** GET — returns every post as JSON, newest first. */
function doGet(e) {
  try {
    const secret = getSecret_();
    if (secret && (e.parameter.secret || "") !== secret) {
      return jsonOutput_({ success: false, error: "Unauthorized", posts: [] });
    }

    const sheet = getSheet_();
    const values = sheet.getDataRange().getValues();
    const header = values[0];
    const rows = values.slice(1);

    const posts = rows
      .filter(function (row) {
        return row[0]; // has a slug
      })
      .map(function (row) {
        const obj = {};
        header.forEach(function (key, i) {
          obj[key] = row[i];
        });
        return obj;
      })
      .reverse();

    return jsonOutput_({ success: true, posts: posts });
  } catch (err) {
    return jsonOutput_({ success: false, error: String(err), posts: [] });
  }
}
