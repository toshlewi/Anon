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
| `CLIENT_URL` | `https://anon-seven-eta.vercel.app` | Yes (your exact Vercel URL) |
| `ADMIN_EMAILS` | `you@gmail.com` | For admin ads panel |
| `FIRST_USER_AUTO_ADMIN` | `true` | Optional |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID | Optional |

`client/.env.production` already sets `VITE_API_URL=/api` for same-origin API on Vercel.

After deploy, set `CLIENT_URL` to your real Vercel URL (or custom domain) and **redeploy**.

### 3. MongoDB Atlas (important)

**Whitelisting “devices” in Atlas only controls which servers can reach MongoDB — not phones or laptops using your site.** Browsers talk to Vercel; Vercel talks to MongoDB.

1. **Network Access** → Add IP Address → **Allow Access from Anywhere** (`0.0.0.0/0`)
2. Copy the **same** `MONGO_URI` from `server/.env` into Vercel env vars (URL-encode `#` as `%23` in passwords)
3. After saving env vars, **Redeploy** the Vercel project

Check: `https://anon-seven-eta.vercel.app/api/health` should show `"database":"connected"`. If it says `disconnected`, login will fail on all devices.

### 4. Health check

Visit `https://your-app.vercel.app/api/health` — should return `{"status":"ok","env":"vercel"}`.

### 5. Ad uploads on Vercel

Serverless `/tmp` storage is **temporary**. For persistent ad images/videos in production, use **image/video URLs** in the admin panel or add Cloudinary later.

## Project layout

- `client/` — Vite + React
- `server/` — Express app (used locally and by Vercel serverless)
- `api/index.mjs` — Vercel serverless entry
- `vercel.json` — build, rewrites, functions
