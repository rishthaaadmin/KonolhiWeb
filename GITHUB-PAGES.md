# Deploy Konolhi to GitHub Pages

The site is a static site in `public/`. A GitHub Actions workflow
(`.github/workflows/deploy.yml`) publishes that folder to GitHub Pages on every push
to `main`. Custom domain is set by `public/CNAME` (`konolhi.com`).

Forms still work — they post to Formspree, not a backend.

---

## Step 1 — Create the GitHub repo

1. Go to **https://github.com/new** (signed in as `rishthaaadmin`).
2. Repository name: **`Konolhi-Web`**.
3. **Public** (Pages is free on public repos). Leave "Add README / .gitignore / license"
   **unchecked** — the project already has them, and adding them would block the push.
4. Click **Create repository**.

## Step 2 — Push the code

From this folder (`Konolhi Web Solutions`):

```bash
git push -u origin main
```

The remote is already set to `https://github.com/rishthaaadmin/Konolhi-Web.git`.
If Git asks you to sign in, use the browser prompt or a Personal Access Token
(same login you used for the rishthaa repo).

## Step 3 — Turn on Pages

1. In the repo: **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
   (The workflow deploys automatically; the first run starts as soon as this is set /
   on the next push. Watch it under the repo's **Actions** tab.)

## Step 4 — Custom domain

1. Still in **Settings → Pages → Custom domain**, it should already show `konolhi.com`
   (from the `CNAME` file). If not, type `konolhi.com` and **Save**.
2. Leave **Enforce HTTPS** unchecked until DNS is verified (Step 5), then enable it.

## Step 5 — Point konolhi.com at GitHub (at Namecheap)

**Important:** for GitHub Pages, do **not** use the Bluehost nameservers. Use Namecheap's
own DNS and add GitHub's records.

1. **Namecheap → Domain List → Manage** (konolhi.com).
2. **Nameservers** → set to **Namecheap BasicDNS** (the default). Save.
3. Open the **Advanced DNS** tab and add these records (delete any conflicting
   default parking records first):

   | Type  | Host | Value                  |
   |-------|------|------------------------|
   | A     | `@`  | `185.199.108.153`      |
   | A     | `@`  | `185.199.109.153`      |
   | A     | `@`  | `185.199.110.153`      |
   | A     | `@`  | `185.199.111.153`      |
   | CNAME | `www`| `rishthaaadmin.github.io.` |

4. Save. DNS takes 30 min to a few hours to propagate.
5. Back in **Settings → Pages**, once GitHub shows the domain as verified, tick
   **Enforce HTTPS**.

Your site will be live at **https://konolhi.com**.

---

## Updating the site later

Edit any file, then:

```bash
git add -A
git commit -m "Update copy"
git push
```

The Actions workflow redeploys automatically in ~1 minute.

---

## Notes

- **Email:** `hello@konolhi.com` shown on the site is just a link. Because DNS now points
  at GitHub (not Bluehost), that mailbox won't receive mail until you add MX records for a
  mail provider (Bluehost email, Zoho, or Google Workspace). Enquiry **forms are unaffected**
  — they go through Formspree to your registered email.
- **Bluehost** is no longer used for this site with this setup. You can keep it for
  `rishthaa.mv` and email, or cancel later — your call.
- The Node backend in this repo is not used by GitHub Pages; it's kept for reference /
  future use. See `DEPLOY.md` for the Bluehost/Node alternative.
