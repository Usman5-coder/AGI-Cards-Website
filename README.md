# AGI Cards Website

The Physical AI Interface platform — a production-ready website with a private content studio.

## Tech Stack

- **Vite + React + TypeScript** — fast SPA build
- **Tailwind CSS v3** — custom design system with dark/light themes
- **Supabase** — database for content storage, auth for admin access, storage for image uploads

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output is in `dist/`.

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the project in Vercel
3. Vercel auto-detects Vite — no extra config needed
4. Add environment variables in Vercel project settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## Admin Panel

Visit `/#/secret-admin` to access the content studio. Sign in with the admin account to edit all site content, sections, images, and settings.

## Features

- Cinematic homepage with interactive card explorers
- Dark/light theme toggle with localStorage persistence
- Scroll-reveal animations and reduced-motion support
- Private content studio at `/#/secret-admin`
- Image upload via Supabase storage
- Fully responsive design
