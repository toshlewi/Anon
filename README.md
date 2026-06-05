# Anon

Anonymous messaging platform by **Tosh Developers** — React, Express, MongoDB.

Live Project 
https://anon-seven-eta.vercel.app/

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

## Security

- **Usernames** and **emails** are unique (checked in the API and enforced by MongoDB indexes)
- Passwords must be **8+ characters** with at least one letter and one number
- Registration requires **password confirmation**
- Auth and anonymous messaging are **rate-limited**
- Profile uploads are **images only** (max 5 MB)
- Set a strong `JWT_SECRET` in production — the server refuses weak defaults on Vercel

## Deploy on Vercel

This repo is configured for **one Vercel project** (frontend + API).

### Quick deploy (CLI)

```bash
./scripts/deploy-vercel.sh
```

Ensure `server/.env` has production values before running. The script syncs env vars and deploys.

### Environment variables (Vercel → Settings → Environment Variables)

| Variable | Example | Required |
|----------|---------|----------|
| `MONGO_URI` | `mongodb+srv://...` | Yes |
| `JWT_SECRET` | long random string (32+ chars) | Yes |
| `CLIENT_URL` | `https://anon-seven-eta.vercel.app` | Yes |
| `ADMIN_EMAILS` | `you@gmail.com` | For admin ads panel |
| `FIRST_USER_AUTO_ADMIN` | `false` | Use `false` in production |
| `VITE_API_URL` | `/api` | Set by deploy script |

`client/.env.production` already sets `VITE_API_URL=/api` for same-origin API on Vercel.

### MongoDB Atlas

1. **Network Access** → **Allow Access from Anywhere** (`0.0.0.0/0`)
2. Copy `MONGO_URI` into Vercel env vars (quote values containing `&`)
3. **Redeploy** after saving env vars

Check: `https://your-app.vercel.app/api/health` should show `"database":"connected"`.

### Ad uploads on Vercel

Serverless `/tmp` storage is **temporary**. For persistent ad images in production, use **image URLs** in the admin panel or add Cloudinary later.

## Project layout

- `client/` — Vite + React
- `server/` — Express app (used locally and by Vercel serverless)
- `api/index.mjs` — Vercel serverless entry
- `vercel.json` — build, rewrites, functions
