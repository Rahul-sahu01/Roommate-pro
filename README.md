Author - Rahul sahu
<br>

# RoomMate Pro v4

A polished rental marketplace + roommate matching platform with separate frontend and backend folders.

## Structure

```text
roommate-pro-v4/
├── frontend/    # React + Vite app
└── backend/     # Express + MongoDB + Socket.IO API
```

## 1. Backend

```bash
cd backend
npm install
copy .env.example .env
npm run seed
npm run dev
```

The API runs at `http://localhost:5000`.

Required `.env` values:
- `MONGO_URI`
- `JWT_SECRET`
- `CLIENT_URL`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

## 2. Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

The site runs at `http://localhost:5173`.

Set `VITE_API_URL` and `VITE_SOCKET_URL` in the frontend `.env` for production.

## Demo accounts

Admin
- `admin@roommate.local`
- `Admin@12345`

Owner
- `demo.owner@roommate.local`
- `Demo@12345`

Tenants
- `aman.demo@roommate.local`
- `priya.demo@roommate.local`
- `arjun.demo@roommate.local`
- `kabir.demo@roommate.local`
- password for all: `Demo@12345`

## Main working features

- Reliable JWT login/register/session restore/logout
- Separate tenant, owner and admin experiences
- Property marketplace with search, filters and sorting
- Property detail pages
- Favorites / saved homes
- Owner property creation + admin approval
- Tenant property applications
- Owner application accept/reject
- Profile and lifestyle preference editing
- Real roommate matching from actual registered tenant profiles
- Compatibility score + reason breakdown
- User-to-user chat foundation using Socket.IO
- Admin user/listing moderation
- Mobile responsive UI
- Environment based API configuration

## Deployment

Deploy `frontend/` and `backend/` separately. The frontend needs `VITE_API_URL` and `VITE_SOCKET_URL`. The backend needs `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL`.
