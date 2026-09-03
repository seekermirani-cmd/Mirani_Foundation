# Google Sheet contact-form storage — setup guide

The Contact page form (`/contact`) toggles between two modes —
**Volunteer** and **Query** — and each mode saves to its **own** Google
Sheet via its own Apps Script Web App, so the two streams can be triaged
independently. This mirrors the blog-post setup
(`GOOGLE_SHEET_BLOG_SETUP.md`): no Google Cloud project, service account,
or API key involved — just a script pasted directly into each sheet.

You'll repeat the same steps twice: once for a "Volunteers" sheet, once
for a "Queries" sheet.

## 1. Create the two sheets

1. Go to [sheets.google.com](https://sheets.google.com) and create two
   new, blank spreadsheets — e.g. **"Mirani Volunteers"** and
   **"Mirani Queries"**.
2. You don't need to add any columns yourself — each script creates its
   tab (`Volunteers` / `Queries`) with headers automatically the first
   time it runs.

## 2. Add the scripts

For the **volunteer** sheet:

1. Open it, go to **Extensions > Apps Script**.
2. Delete the placeholder `myFunction` code and paste in the entire
   contents of `google-apps-script/Code.Volunteer.gs`.
3. Click the disk/save icon.

For the **query** sheet, repeat with `google-apps-script/Code.Query.gs`.

## 3. (Recommended) Set a shared secret

This stops random people from finding your Web App URL and writing to
your sheet. Do this for **both** sheets — you can reuse the same secret
value for both, or use two different ones.

1. In each Apps Script editor, go to **Project Settings** (gear icon) >
   **Script properties**.
2. Add a property named `SHEET_SECRET` with any long random value, e.g.
   `k3f9a2-mirani-volunteer-2026`. Keep this value handy — you'll need it
   in step 5.

## 4. Deploy each as a Web App

For **each** script (volunteer and query, separately):

1. In the Apps Script editor, click **Deploy > New deployment**.
2. Click the gear next to "Select type" and choose **Web app**.
3. Set:
   - **Execute as:** Me (your Google account)
   - **Who has access:** Anyone (needed so your server can call it —
     the `SHEET_SECRET` from step 3 is what actually protects it)
4. Click **Deploy**, authorize the script when prompted, and copy the
   **Web app URL** it gives you (looks like
   `https://script.google.com/macros/s/AKfycb.../exec`).

Whenever you edit either `Code.*.gs` file, you'll need to **Deploy >
Manage deployments > edit (pencil) > New version** to push the change
live — just saving the file isn't enough.

## 5. Configure the site

Set these environment variables wherever the site is deployed (e.g.
Vercel project settings, or a local `.env` for `vite dev`):

```
VOLUNTEER_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/AKfycb.../exec
VOLUNTEER_SHEET_WEBHOOK_SECRET=k3f9a2-mirani-volunteer-2026   # same value as the volunteer sheet's SHEET_SECRET

QUERY_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/AKfycb.../exec
QUERY_SHEET_WEBHOOK_SECRET=k3f9a2-mirani-query-2026           # same value as the query sheet's SHEET_SECRET
```

The two `*_SECRET` vars are optional but strongly recommended if you set
`SHEET_SECRET` in step 3 — leave a pair unset only if you skipped that
step for that sheet.

That's it — once these are set (and the site is redeployed, if you're on
a host like Vercel that needs a fresh deploy to pick up new env vars),
submitting the Contact form in either mode writes a row to the matching
sheet.

## How it fits together

```
Contact form (mode: volunteer|query)
  →  POST /api/contact
  →  verify Turnstile
  →  appendContactSubmissionToSheet(mode, ...)
  →  Apps Script doPost()  →  new row in "Volunteers" or "Queries"
```

- `src/lib/server/contact-sheets.ts` — talks to the two Apps Script URLs
- `src/routes/api.contact.ts` — validates input, verifies the Turnstile
  token, then routes the write to the right sheet based on `mode`

This is write-only (no admin page reads volunteer/query rows back into
the site — unlike blog posts, which round-trip through `/blogs`), so
each `Code.*.gs` only implements `doPost`, not `doGet`.

## Limitations to know about

- Apps Script Web Apps have modest rate limits (fine for a small
  foundation's contact form, not for high traffic).
- If a sheet's webhook URL isn't set, that mode's submissions fail with a
  clear "not connected yet" error (HTTP 501) instead of failing silently
  or silently falling back to the other sheet.
- The two sheets are independent — you can set up one before the other;
  only the configured mode(s) will work until both are wired up.
