# Elevate X Thrift — Vintage • Streetwear • More

Glassmorphism clothing store website for a thrift store in Panipat, Haryana.
Built with React 19 + Vite + Tailwind CSS 4 + TypeScript.

**Live site:** https://kaushikshweta735-stack.github.io/elevate-x-thrift/

## Features

- 🛍️ Product grid with category filters + price sorting, animated SVG garments
- 🛒 Bag/cart drawer with checkout flow
- 📱 Floating WhatsApp chat button + Instagram/email contact links
- 🔐 Hidden admin panel at `/#/admin` — manage products & every site text
- ☁️ Firebase (Firestore + Auth) backend — edits go live instantly
- ⚡ Auto-deploys to GitHub Pages on every push via GitHub Actions

## Local development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/ (single file site)
```

## Admin panel

Open `/#/admin` and log in with the Firebase Authentication user.
First run: click "Upload site → cloud" to seed Firestore with defaults.

## Stack

- React 19, Vite 7, Tailwind 4 (vite-plugin-singlefile → 1-file build)
- Firebase: Firestore (products + content), Auth (email/password admin login)
- Deploy: GitHub Actions → GitHub Pages
