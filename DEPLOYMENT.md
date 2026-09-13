# Deployment guide

## Frontend
Use Vercel/Netlify or any static Node host.

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables:
  - `VITE_API_URL=https://YOUR-BACKEND/api`
  - `VITE_SOCKET_URL=https://YOUR-BACKEND`

## Backend
Use Render/Railway/another Node host.

- Root directory: `backend`
- Start command: `npm start`
- Environment variables:
  - `MONGO_URI=...`
  - `JWT_SECRET=long-random-secret`
  - `CLIENT_URL=https://YOUR-FRONTEND`
  - `ADMIN_EMAIL=admin@yourdomain.com`
  - `ADMIN_PASSWORD=strong-password`

## MongoDB
Create a MongoDB Atlas database and put the connection string into `MONGO_URI`.

## Important
Do not commit `.env`. Never reuse the demo admin password in production.
