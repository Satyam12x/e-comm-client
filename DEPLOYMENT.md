Deployment guide
===============

Overview
--------
This repo contains two folders: `client` (Vite + React frontend) and `server` (Express backend). The intended deployment model is to host the frontend on Vercel and host the backend separately (Render, Railway, Heroku, or another provider). The frontend calls the backend via the env var `VITE_API_URL`.

Frontend (Vercel)
------------------
- Connect your Git repository in Vercel and create a new project using the `client` directory as the root.
- Build command: `npm run build` (already in `client/package.json`).
- Output directory: `dist`.
- Add environment variable on Vercel: `VITE_API_URL` = `https://<your-backend-domain>/api`.
- Optional: `client/vercel.json` is included to force SPA routing to `index.html`.

Backend (recommended separate host)
----------------------------------
Option A: Render / Railway / Heroku (Recommended)
- Push the `server` folder to its own repository or configure your host to use `/server` as the deployment root.
- Start command: `npm start` (already in `server/package.json`).
- Set environment variables from `server/.env.example` (especially `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_URL` set to your Vercel domain).

Option B: Vercel
- Deploying a full Express process that listens on a port is not supported on Vercel serverless functions as-is. To deploy on Vercel you must refactor endpoints into serverless functions (API routes) or use a custom serverless adapter.

Connectivity / CORS
-------------------
- The backend reads `CLIENT_URL` from environment variables and uses it as the allowed CORS origin. Set `CLIENT_URL` to `https://<your-frontend>.vercel.app` before deploying the backend.
- The frontend uses `VITE_API_URL` to contact the backend. Example: `VITE_API_URL=https://api.example.com/api`.

Quick smoke tests
-----------------
1. After deploying backend, verify health:

```bash
curl -i https://<your-backend-domain>/api/health
```

Expected: JSON with { "success": true, "status": "healthy" }

2. After deploying frontend, open the site and try logging in or loading products. If requests fail, check browser console/network and ensure `VITE_API_URL` is correct and backend CORS allows your frontend origin.

Local testing
-------------
- Run server locally: from `server/` `npm install` then `npm run dev` (or `npm start`). Ensure `.env` contains `CLIENT_URL=http://localhost:5173` for local tests.
- Run client locally: from `client/` `npm install` then `npm run dev`. Set `VITE_API_URL` in a `.env` file in `client` if pointing to a remote backend.

Next steps (optional)
---------------------
- If you want to deploy the backend on Vercel, we can help convert key endpoints into serverless functions under `server/api/`.
- I can also prepare a GitHub Actions workflow to automatically deploy the frontend and/or backend when you push to `main`.
