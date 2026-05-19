# Osheen MVP

Osheen is an AI-enabled virtual trial room and emotional styling platform for online shoppers, offline boutiques, and local fashion vendors.

The MVP includes a polished Next.js frontend, an Express backend, upload flows, canvas-based outfit preview simulation, optional BodyPix pose segmentation, mood-based styling suggestions, vendor catalogue management, Vercel-friendly API fallbacks, and Firebase-ready configuration.

## Folder Structure

```text
osheen-mvp/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── catalog.ts
│   │   │   ├── contact.ts
│   │   │   ├── styling.ts
│   │   │   └── tryon.ts
│   │   ├── services/
│   │   │   ├── catalogStore.ts
│   │   │   └── stylingEngine.ts
│   │   ├── types/
│   │   │   └── catalog.ts
│   │   └── index.ts
│   ├── uploads/
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/
│   ├── app/
│   │   ├── api/styling/route.ts
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── try-on/page.tsx
│   │   ├── vendor/page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── contact/
│   │   ├── landing/
│   │   ├── layout/
│   │   ├── try-on/
│   │   ├── ui/
│   │   └── vendor/
│   ├── lib/
│   │   ├── api.ts
│   │   ├── constants.ts
│   │   ├── firebase.ts
│   │   ├── mood.ts
│   │   ├── utils.ts
│   │   └── vision.ts
│   ├── public/assets/
│   ├── styles/
│   │   └── design-tokens.ts
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   ├── next.config.mjs
│   ├── tsconfig.json
│   └── .env.example
├── .github/workflows/ci.yml
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## Tech Stack

- Frontend: Next.js 14, React, TypeScript, Tailwind CSS, Framer Motion, Lucide icons
- Backend: Node.js, Express, TypeScript, Zod, Multer
- AI/CV MVP: TensorFlow.js BodyPix loaded dynamically in the browser, with a canvas geometry fallback
- Auth/database/storage ready: Firebase client configuration scaffolded in `frontend/lib/firebase.ts`
- Assets: local generated hero image plus local outfit/demo SVG assets

## Local Setup

1. Install Node.js 20.19 or newer.
2. Open this folder in VS Code.
3. Install dependencies:

```bash
npm install
```

4. Create environment files:

```bash
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
```

5. Start the full app:

```bash
npm run dev
```

6. Open:

```text
http://localhost:3000
```

The Express API runs at:

```text
http://localhost:4000/api/health
```

## Useful Commands

```bash
npm run dev          # frontend + backend
npm run build        # production build
npm run typecheck    # TypeScript validation
npm run lint         # Next/TypeScript lint checks
```

## MVP Functionality

- Landing page with premium startup messaging, animations, hero image, features, sustainability, MSME/vendor support, testimonials, and footer
- Virtual try-on page with user photo upload, outfit upload, starter outfits, event backgrounds, BodyPix-assisted preview attempt, fallback outfit overlay, manual fit controls, before/after visualisation, preview download, and mood styling suggestions
- Vendor dashboard with product upload, catalogue cards, stock/price stats, and API-backed in-memory listings
- About page with mission, vision, idea, and future roadmap
- Contact page connected to the Express API, with demo-mode fallback
- Next API fallback routes for `catalog`, `contact`, `styling`, and `tryon`, so the deployed frontend can still run the MVP without a separately hosted Express service

## Environment Variables

Frontend:

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Backend:

```bash
PORT=4000
FRONTEND_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
FIREBASE_PROJECT_ID=
```

Firebase and Cloudinary values are optional for this MVP. The project runs in demo mode without them.

For local full-stack development, keep:

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
```

For Vercel-only deployment without the Express server, leave `NEXT_PUBLIC_API_URL` blank or unset so the frontend uses its built-in Next API routes.

## GitHub + Vercel Publish

This repository is already connected to:

```text
https://github.com/Osheen06/OSHEEN.git
```

To publish your current local changes to GitHub:

```bash
git status
git add .
git commit -m "Redesign Osheen MVP"
git push origin main
```

For Vercel:

1. Open your Vercel project for `https://osheen.vercel.app`.
2. Connect it to the `Osheen06/OSHEEN` GitHub repo if it is not already connected.
3. Use `frontend` as the Vercel Root Directory for the public site.
4. Build command: `npm run build`
5. Install command: `npm install`
6. Leave `NEXT_PUBLIC_API_URL` empty on Vercel unless you deploy the Express backend separately.
7. Push to `main`; Vercel should redeploy automatically.

## Development Notes

- Product uploads are stored in memory by the Express server for MVP simplicity.
- The try-on preview is intentionally lightweight: it attempts BodyPix segmentation in-browser, then always falls back to deterministic canvas geometry if segmentation fails.
- Replace the demo storage layer with Firebase Storage or Cloudinary when moving beyond prototype demos.
- Replace the in-memory catalogue store with Firestore, Supabase, or Postgres when you need persistence.
- `npm audit --omit=dev` currently reports advisories for Next.js 14 that npm resolves only by upgrading to Next 16. This MVP intentionally stays on Next 14 because the project brief requires it.
