# Google Sheet blog storage — setup guide

The "Add Blog" admin form (`/admin/blogs/new`) saves posts to a Google
Sheet via a small Apps Script Web App. There's no Google Cloud project,
service account, or API key involved — just a script pasted directly into
the sheet.

## 1. Create the sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new,
   blank spreadsheet. Name it something like **"Mirani Blog Posts"**.
2. You don't need to add any columns yourself — the script creates a
   `Posts` tab with headers automatically the first time it runs.

## 2. Add the script

1. In the sheet, go to **Extensions > Apps Script**.
2. Delete the placeholder `myFunction` code and paste in the entire
   contents of `google-apps-script/Code.gs` (included alongside this
   guide).
3. Click the disk/save icon.

## 3. (Recommended) Set a shared secret

This stops random people from finding your Web App URL and writing to
your sheet.

1. In the Apps Script editor, go to **Project Settings** (gear icon) >
   **Script properties**.
2. Add a property named `SHEET_SECRET` with any long random value, e.g.
   `k3f9a2-mirani-blog-2026`. Keep this value handy — you'll need it in
   step 5.

## 4. Deploy as a Web App

1. In the Apps Script editor, click **Deploy > New deployment**.
2. Click the gear next to "Select type" and choose **Web app**.
3. Set:
   - **Execute as:** Me (your Google account)
   - **Who has access:** Anyone (needed so your server can call it —
     the `SHEET_SECRET` from step 3 is what actually protects it)
4. Click **Deploy**, authorize the script when prompted, and copy the
   **Web app URL** it gives you (looks like
   `https://script.google.com/macros/s/AKfycb.../exec`).

Whenever you edit `Code.gs`, you'll need to **Deploy > Manage
deployments > edit (pencil) > New version** to push the change live —
just saving the file isn't enough.

## 5. Configure the site

Set these environment variables wherever the site is deployed (e.g.
Cloudflare Pages/Workers project settings, or a local `.env` for `vite dev`):

```
BLOG_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/AKfycb.../exec
BLOG_SHEET_WEBHOOK_SECRET=k3f9a2-mirani-blog-2026   # same value as SHEET_SECRET above
```

`BLOG_SHEET_WEBHOOK_SECRET` is optional but strongly recommended if you
set `SHEET_SECRET` in step 3 — leave both unset if you skipped that step.

That's it — once these are set, admin logins at `/admin/login`
(password from `ADMIN_PASSWORD`, see the earlier setup notes) can publish
and delete sheet-backed posts from `/admin/blogs/new`, and every visitor to
`/blogs` will see the current sheet contents since the source of truth is
now the sheet rather than a single browser.

## How it fits together

```
Admin form  →  POST /api/blogs  →  appendBlogPostToSheet()  →  Apps Script doPost()  →  new row in "Posts"
Admin panel →  DELETE /api/blogs?slug=... → deleteBlogPostFromSheet() → Apps Script doPost(action=delete) → row removed
/blogs page →  GET  /api/blogs  →  fetchBlogPostsFromSheet() →  Apps Script doGet()   →  posts as JSON
```

- `src/lib/server/google-sheets.ts` — talks to the Apps Script URL
- `src/routes/api.blogs.ts` — validates input, requires an admin session
  for writes, dedupes slugs
- `src/lib/blog-store.ts` — client-side fetch/post/delete helpers used by
  the blog pages and the admin form

## Limitations to know about

- Apps Script Web Apps have modest rate limits (fine for a small
  foundation blog, not for high traffic).
- There's no image upload — the form takes an optional image URL and
  otherwise shows a placeholder graphic, per the current design.
- If `BLOG_SHEET_WEBHOOK_URL` isn't set, the site still works — it just
  shows the built-in posts and the admin form returns a clear "not
  connected yet" error instead of failing silently.
