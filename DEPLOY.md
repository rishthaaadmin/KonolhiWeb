# Deploy Konolhi Web Solutions to Bluehost

This guide takes the site live on your **Bluehost hosting** using your **Namecheap domain**.

Because Bluehost's shared hosting can't run the Node backend, the site is deployed as
**static files**, and the two forms (Contact + Free Review) send enquiries to your email
through **Formspree** (free tier). The blog reads a static JSON file. Everything else is
plain HTML/CSS/JS.

> This guide is written for your domain **konolhi.com** and email **hello@konolhi.com**,
> which are already set in the site files. Nothing to find-replace.

---

## What you upload

You only upload the **contents of the `public/` folder**. Everything else in this project
(`server.js`, `src/`, `node_modules/`, `config/`, root `data/`) is the optional Node version
and does **not** go to Bluehost.

The `public/` folder contains:

```
index.html  services.html  packages.html  dashboards.html  industries.html
portfolio.html  blog.html  free-review.html  contact.html  404.html
css/   js/   data/posts.json
```

---

## Part A — Connect the forms (Formspree)

Do this first so enquiries reach you.

1. Go to **https://formspree.io** and create a free account (sign up with the email where
   you want to receive enquiries).
2. Create a **new form** — call it "Konolhi Contact". Formspree gives you an endpoint that
   looks like `https://formspree.io/f/abcdwxyz`. The part after `/f/` is your **form ID**.
3. Create a **second form** — "Konolhi Free Review" — and copy its form ID too.
   (You can reuse one form for both if you prefer; just use the same ID in both files.)
4. In the site files, paste your IDs:
   - `public/contact.html` → find `YOUR_CONTACT_FORM_ID` and replace it with your contact form ID.
   - `public/free-review.html` → find `YOUR_REVIEW_FORM_ID` and replace it with your review form ID.
5. The **first** time each form is submitted, Formspree emails you to confirm the form.
   Click that link once and the form is live.

Until an ID is added, the form politely shows "This form is not connected yet" instead of
failing silently.

---

## Part B — Point your Namecheap domain at Bluehost

Pick **one** method. Method 1 is simplest.

### Method 1 — Bluehost nameservers (recommended)

1. Find Bluehost's nameservers: log in to Bluehost → **Domains** (or **cPanel → Server
   Information**). They are usually:
   ```
   ns1.bluehost.com
   ns2.bluehost.com
   ```
2. Log in to **Namecheap → Domain List → Manage** (next to your domain).
3. Under **Nameservers**, choose **Custom DNS** and enter the two Bluehost nameservers. Save.
4. DNS changes take **30 minutes to a few hours** (up to 24h) to spread worldwide.

### Method 2 — Keep Namecheap DNS, point an A record

1. In Bluehost (**cPanel → Server Information**), copy your **Shared IP Address** (e.g. `162.xxx.xxx.xxx`).
2. In **Namecheap → Manage → Advanced DNS**, add:
   | Type | Host | Value | TTL |
   |------|------|-------|-----|
   | A Record | `@` | your Bluehost IP | Automatic |
   | CNAME | `www` | `konolhi.com.` | Automatic |
3. Remove any default Namecheap "parking" A/CNAME records so they don't conflict.

---

## Part C — Add the domain in Bluehost and upload the files

1. In Bluehost → **Websites → Add Website**, choose **Empty Environment**
   (do **not** pick "WordPress" — you don't need a CMS, and don't pick "Transfer").
   Enter your domain `konolhi.com` when prompted. This creates a blank site with its
   own folder (document root). Bluehost shows you the path — usually `public_html`
   or `public_html/konolhi.com`. Note it down.
2. Open **cPanel → File Manager** and go into that folder.
3. Delete any Bluehost placeholder files there (`default.html`, a starter `index.html`, etc.).
4. On your computer, open this project's `public/` folder, select **everything inside it**,
   and compress it to a single `.zip`.
5. In File Manager, **Upload** the `.zip` into the domain's folder, then select it and
   **Extract**. Delete the `.zip` afterward.
6. Confirm `index.html` sits **directly** in the domain's folder (not inside a nested
   `public/` subfolder). If it's nested, move the files up one level.

Visit `http://konolhi.com` — the site should load once DNS has propagated.

---

## Part D — Turn on HTTPS (SSL)

1. In Bluehost: **Security → SSL/TLS** (or **cPanel → SSL/TLS Status**). Bluehost issues a
   free **Let's Encrypt / AutoSSL** certificate automatically once the domain points to it.
   If it hasn't after a few hours, click **Run AutoSSL**.
2. Force HTTPS: in **cPanel → Domains**, toggle **Force HTTPS Redirect** on (or add the rule
   in `.htaccess`). Your site should now load on `https://konolhi.com`.

---

## Part E — Business email (optional but recommended)

1. In Bluehost: **Email → Email Accounts → Create**, e.g. `hello@konolhi.com`.
2. If you pointed the domain with **Method 1 (Bluehost nameservers)**, email works
   automatically. With **Method 2**, add Bluehost's **MX records** in Namecheap Advanced DNS
   (Bluehost shows them under **Email → Deliverability**).

---

## Part F — Details already set (for reference)

These are already configured in the site — listed here only in case you change them later:

- **Domain / email:** the site shows `hello@konolhi.com`. To change it, edit
  `public/js/components.js` (footer) and `public/contact.html`.
- **WhatsApp number:** `+960 998-7899`. To change it, edit `WA_NUMBER` in
  `public/js/components.js` and the `wa.me/9609987899` links in the HTML files.
- **Address:** `H. Miraaz, Ground Floor, Burevi Magu, 20008, K. Malé City` — in
  `public/js/components.js` (footer) and `public/contact.html`.

---

## Test checklist (after go-live)

- [ ] `https://konolhi.com` loads with a padlock (valid SSL)
- [ ] `www.konolhi.com` redirects to the main domain
- [ ] All 9 pages open (Home, Services, Packages, Dashboards, Industries, Portfolio, Blog, Free Review, Contact)
- [ ] Blog list loads and a single article opens
- [ ] Submit the **Contact** form → you receive the email
- [ ] Submit the **Free Review** form → you receive the email
- [ ] WhatsApp button opens a chat to +960 998-7899
- [ ] Open on a phone — layout looks right

---

## Updating content later

- **Text/prices:** edit the relevant `.html` file, re-upload just that file via File Manager.
- **Blog posts:** edit `public/data/posts.json`, re-upload it.
- No rebuild or server restart needed — it's all static.

---

## Alternative: run the full Node backend later

If you move to Node-capable hosting (Bluehost VPS/Dedicated with SSH, or Render/Railway),
you can use the original backend instead of Formspree:

1. In `public/contact.html` and `public/free-review.html`, change each `data-endpoint`
   back to `/api/enquiries` and `/api/reviews`.
2. Deploy the whole project (not just `public/`) and run `npm install && npm start`.
3. Set `ADMIN_TOKEN` to read submissions at `/api/enquiries`.

The backend is untouched and still works — see `README.md`.
