# Handover guide — hosting Elevate X Thrift on Vercel with a custom domain

This repo is a **Vite + React + Tailwind** site that builds into a **single self-contained `index.html`** (JS/CSS are inlined) and uses **hash routing** (`/#/admin`). That means:

- Works on any static host with **zero configuration changes**
- No server rewrites needed
- Deploying to Vercel takes ~5 minutes

The store's data lives in **Firebase** (Firestore database `elevate-x-thrift`, region `asia-south1` Mumbai). The Firebase web keys are inside `src/lib/firebase.ts` — these are **public keys by design** (safe to ship; your data is protected by Firestore security rules, not by hiding keys).

Admin panel: `https://YOUR-DOMAIN/#/admin` — email/password login via Firebase Authentication.

---

## Part 1 — Get the code

The repo is public: <https://github.com/kaushikshweta735-stack/elevate-x-thrift>

Two options:

- **Fork** it into your own GitHub account (top-right "Fork" button), or
- **Download ZIP** on your machine and push it to a new repo you own.

You need a **GitHub account** for Vercel deployment (Vercel pulls the repo from GitHub on every push and publishes it automatically).

---

## Part 2 — Deploy to Vercel (free)

1. Go to <https://vercel.com> → **Sign up with GitHub**.
2. Dashboard → **Add New… → Project**.
3. Find `elevate-x-thrift` in the repo list → **Import**.
4. Framework Preset: it auto-detects **Vite**. Leave everything as is:
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Press **Deploy**. In ~1 minute your site is live at `https://<project-name>.vercel.app`.

Every future `git push` to `master` redeploys this site automatically.

---

## Part 3 — Connect your custom domain

1. Buy a domain anywhere (Namecheap, GoDaddy, Cloudflare, Hostinger…).
2. In the Vercel project → **Settings → Domains → Add** → type your domain (e.g. `thriftx.in`).
3. Vercel shows exactly which DNS records to add. At your registrar's DNS settings add:

| Type  | Host/Name | Value                |
| ----- | --------- | -------------------- |
| A     | `@`       | `76.76.21.21`        |
| CNAME | `www`     | `cname.vercel-dns.com` |

4. Wait 5–30 minutes. HTTPS (the 🔒) is issued automatically by Vercel.

---

## Part 4 — Firebase: two ways to go

### Option A — keep using the existing backend (fastest, nothing to build)

The site keeps reading/writing the same Firebase project (`elevate-x-thrift`). One small step:

- Firebase Console (<https://console.firebase.google.com>) → project **elevate-x-thrift** → **Authentication → Settings → Authorized domains → Add domain** → add both:
  - your `*.vercel.app` URL
  - your custom domain

(This isn't needed for the current email/password admin login, but do it so Google-style logins keep working later. Takes 30 seconds.)

**Who holds what:** the Firebase project (its data, users, billing) stays with its owner. The friend gets access to the site admin panel by logging in at `/#/admin` — so share the admin email/password with whoever runs the store.

### Option B — the friend creates their own Firebase backend

1. <https://console.firebase.google.com> → **Add project** → name it → skip analytics.
2. Project overview → **Web app `</>`** → register → copy the `firebaseConfig` values.
3. Build → **Authentication** → Sign-in method → Enable **Email/Password** → Users tab → **Add user** (this email+password becomes the admin login).
4. Build → **Firestore Database** → **Create database** → region **asia-south1** (Mumbai) → start in **locked mode** → open the **Rules** tab and publish:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /content/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /orders/{doc} {
      allow create: if request.resource.data.keys().hasAll(['name','phone','items','total','status','placedAt'])
        && request.resource.data.name is string
        && request.resource.data.phone is string
        && request.resource.data.total is number
        && request.resource.data.status == 'new';
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

5. Open `src/lib/firebase.ts` and replace the values in the `firebaseConfig` block with the ones from step 2 (that's the **only** code change needed).
6. Commit + push → Vercel redeploys automatically.
7. Add your Vercel/custom domains to Authentication → Authorized domains (step above).
8. Optional: add starter products via the admin panel (fill cards + press Save), or remove the "restore starter products" flow in `src/components/Admin.tsx` if you never want demo items.

---

## Part 5 — Housekeeping notes

- **GitHub Actions**: pushing to `master` also triggers the old `.github/workflows/deploy.yml` (the previous GitHub Pages deploy). If the repo's Actions tab shows red runs after the handover, it's harmless — either delete that one file or ignore the failures. Deleting it changes nothing on Vercel.
- **Where things live** (for future edits):
  - `src/lib/firebase.ts` — Firebase config + all cloud reads/writes
  - `src/data.ts` — the bundled starter product list (used by the admin's "upload site → cloud" button only)
  - `src/content.ts` — all editable site texts (hero lines, shop title, WhatsApp number…)
  - `src/components/Admin.tsx` — the `/#/admin` panel (products, orders, site texts)
  - `src/components/Shop.tsx` — storefront shop grid, cart/checkout drawer, WhatsApp fallback
- **Photos**: product photos are compressed in the browser and stored as data URLs inside each product document (Firestore one-file limit per product) — no extra storage bucket needed.
- **Admin login**: whoever owns the store needs the Firebase Authentication email + password created for the admin account. To change owners: Firebase Console → Authentication → Users → add the new user (or change the password on the existing one).

---

*Questions after reading this? The codebase is small — `src/` has under a dozen files. Start by reading `App.tsx` (routing) and `lib/firebase.ts` (data layer).*
