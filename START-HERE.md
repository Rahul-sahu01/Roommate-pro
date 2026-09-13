# RoomMate Pro V4 — Readable Version

This is the V4 project with the same features and UI, but the code is split into smaller and easier-to-understand files.

## Run backend

```bash
cd backend
npm install
npm run seed
npm run dev
```

## Run frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open:

`http://localhost:5173`

## Where to edit

- Login/register → `frontend/src/pages/auth.jsx` and `backend/controllers/authController.js`
- Properties → `frontend/src/pages/properties.jsx` and `backend/controllers/propertyController.js`
- Roommates → `frontend/src/pages/matches.jsx` and `backend/controllers/matchController.js`
- Chat → `frontend/src/pages/chat.jsx` and `backend/controllers/chatController.js`
- Applications → `backend/controllers/applicationController.js`
- Admin → `frontend/src/pages/admin.jsx` and `backend/controllers/adminController.js`
- UI components → `frontend/src/components/`
- Database schemas → `backend/models/`
