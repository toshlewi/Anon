# Anon

Anon is a full-stack anonymous messaging platform built with React, Node.js, Express, and MongoDB.

## Features
- Account signup/login via email+username/password
- Google login support
- Public anonymous message links (`/u/:username`)
- Private inbox dashboard with styled message cards
- Card export as image for sharing
- Profile photo upload
- Admin advertising panel
- Card-specific anonymous question links with analytics (views/replies)
- Custom create/edit/delete question cards with themed visuals
- Branded Tosh Developers footer and card signature

## Run locally
1. Copy `server/.env.example` to `server/.env`
2. Copy `client/.env.example` to `client/.env`
3. Install dependencies in root, client and server (already done in this workspace)
4. Start both apps together:

```bash
npm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:5000`

## Vercel Hosting Prep

- Vercel config is included in `vercel.json`
- Serverless API entry is `api/index.mjs`
- Express app is exportable via `server/src/app.js`

### Required Vercel Environment Variables
- `MONGO_URI`
- `JWT_SECRET`
- `CLIENT_URL` (your frontend URL)
# Anon
