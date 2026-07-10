# Bhavsar Kshatriya Samaj — Community Portal

Official web portal for the Bhavsar Kshatriya Samaj community in India. Features an interactive map of India, regional events, social activities, and an admin panel for content management.

**Live site:** [bhavsarprojects.com](https://bhavsarprojects.com)

## Features

- **Landing page** with Tulja Bhavani Mata image and community hero
- **Interactive India map** — hover to highlight states, click to view regional activities and events
- **Events page** — browse upcoming events, social activities, and past events
- **About & Contact** pages
- **Admin panel** (`/admin`) — add/delete events, upload and delete event images

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Admin Access

1. Go to `/admin`
2. Default password: `bhavsar2024` (change via `ADMIN_PASSWORD` in `.env.local`)

### Replace Tulja Bhavani Mata Image

Replace `public/images/tulja-bhavani-mata.svg` with your official deity image (JPG/PNG/WebP). Update the `src` in `src/app/page.tsx` if using a different filename.

## Deployment to bhavsarprojects.com

Two deployment options are provided:

### Option A: Vercel (recommended for quick launch)

1. Push this repo to GitHub
2. Import the project at [vercel.com](https://vercel.com)
3. Set environment variable: `ADMIN_PASSWORD`
4. Add GitHub secrets for CI/CD:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
5. In Vercel project settings → Domains, add `bhavsarprojects.com` and `www.bhavsarprojects.com`
6. Update DNS at your registrar:
   - `A` record → `76.76.21.21` (Vercel)
   - `CNAME` for `www` → `cname.vercel-dns.com`

> **Note:** Vercel serverless has ephemeral storage. Admin uploads won't persist across redeploys on Vercel. Use Option B for full admin functionality.

### Option B: Docker on VPS (recommended for admin uploads)

```bash
# On your server
git clone <repo-url>
cd bhavsar_projects
echo "ADMIN_PASSWORD=your-secure-password" > .env
docker compose up -d --build
```

Point `bhavsarprojects.com` A record to your server IP. Use nginx/Caddy as reverse proxy with SSL (Let's Encrypt).

## Project Structure

```
src/
  app/           # Pages and API routes
  components/    # React components (Header, IndiaMap, AdminPanel)
  lib/           # Database, auth, types
data/
  events.json    # Event storage
public/
  images/        # Static assets (Tulja Bhavani Mata)
  uploads/       # Admin-uploaded event photos
```

## Tech Stack

- Next.js 16 · React 19 · TypeScript · Tailwind CSS
- `@aryanjsx/indiamap` for interactive India SVG map
- File-based JSON storage with Docker volume persistence
