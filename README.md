# Anon

Anonymous messaging platform by **Tosh Developers** — React, Express, MongoDB.

## Run locally

1. Copy `server/.env.example` → `server/.env` (set `MONGO_URI`, `JWT_SECRET`)
2. Copy `client/.env.example` → `client/.env`
3. Install and run:

```bash
npm install --prefix client && npm install --prefix server
npm run dev
```

- Frontend: http://localhost:5173  
- API: http://localhost:5000/api  

## Deploy on Vercel

This repo is configured for **one Vercel project** (frontend + API).

### 1. Import from GitHub

Push to GitHub, then in [Vercel](https://vercel.com) → **Add New Project** → import `toshlewi/Anon`.

- **Framework Preset:** Other (or Vite — `vercel.json` controls the build)
- **Root Directory:** leave as repository root (`.`)
- Do **not** set root to `client` only — the API lives in `/api`

### 2. Environment variables (Vercel → Settings → Environment Variables)

| Variable | Example | Required |
|----------|---------|----------|
| `MONGO_URI` | `mongodb+srv://...` | Yes |
| `JWT_SECRET` | long random string | Yes |
| `CLIENT_URL` | `https://your-app.vercel.app` | Yes (your production URL) |
| `ADMIN_EMAILS` | `you@gmail.com` | For admin ads panel |
| `FIRST_USER_AUTO_ADMIN` | `true` | Optional |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID | Optional |

`client/.env.production` already sets `VITE_API_URL=/api` for same-origin API on Vercel.

After deploy, set `CLIENT_URL` to your real Vercel URL (or custom domain) and **redeploy**.

### 3. MongoDB Atlas

- Network Access → allow `0.0.0.0/0` (or Vercel IPs)
- Use a user/password; URL-encode special characters in `MONGO_URI` (e.g. `#` → `%23`)

### 4. Health check

Visit `https://your-app.vercel.app/api/health` — should return `{"status":"ok","env":"vercel"}`.

### 5. Ad uploads on Vercel

Serverless `/tmp` storage is **temporary**. For persistent ad images/videos in production, use **image/video URLs** in the admin panel or add Cloudinary later.

## Project layout

- `client/` — Vite + React
- `server/` — Express app (used locally and by Vercel serverless)
- `api/index.mjs` — Vercel serverless entry
- `vercel.json` — build, rewrites, functions
