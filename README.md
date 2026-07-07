# Konolhi Web Solutions — Agency Website

Premium marketing website + enquiry backend for a Maldives-based web design and business automation agency.

**Konolhi Web Solutions** · H. Miraaz, Ground Floor, Burevi Magu, 20008, K. Malé City, Maldives · +960 998-7899

## Stack

- **Backend:** Node.js + Express (no database required — JSON file storage)
- **Frontend:** Static HTML/CSS/JS, dark glassmorphism design system, no build step

## Run

```bash
npm install
npm start          # http://localhost:4380
```

## Project structure

```
faru-digital/
├── server.js                  # Express entry point
├── config/
│   └── site.config.js         # Brand name, WhatsApp, prices — edit here
├── src/
│   ├── routes/api.routes.js   # API endpoints + validation schemas
│   ├── controllers/           # enquiry / review / blog handlers
│   ├── models/store.js        # Atomic JSON-file datastore
│   └── middleware/            # validate, rateLimiter, errorHandler
├── data/
│   ├── posts.json             # Blog content (edit to publish)
│   ├── enquiries.json         # Submitted project enquiries (auto-created)
│   └── review-requests.json   # Free review requests (auto-created)
└── public/                    # 9 pages + css/ + js/
```

## API

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/enquiries` | Project enquiry form (validated, rate-limited) |
| POST | `/api/reviews` | Free website review form |
| GET | `/api/posts`, `/api/posts/:slug` | Blog content |
| GET | `/api/config` | Brand/pricing config |
| GET | `/api/enquiries`, `/api/reviews` | Admin reads — require `Authorization: Bearer $ADMIN_TOKEN` |

## Rebranding

The agency name and contact details live in a few places. To change them:
1. `config/site.config.js` — brand, contact, prices
2. `public/js/components.js` — `BRAND` and `WA_NUMBER` constants (nav/footer/WhatsApp links)
3. Page `<title>`/meta tags in `public/*.html`

## Reading submitted enquiries

```bash
ADMIN_TOKEN=secret npm start
curl -H "Authorization: Bearer secret" http://localhost:4380/api/enquiries
```

Or just open `data/enquiries.json`.
