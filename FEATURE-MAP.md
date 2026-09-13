# Feature Map — Where to edit

## Frontend
- Home page → `frontend/src/pages/home.jsx`
- Property search → `frontend/src/pages/properties.jsx`
- Property cards/detail/form → `frontend/src/components/property.jsx`
- Favorites → `frontend/src/pages/properties.jsx`
- Roommate matching → `frontend/src/pages/matches.jsx`
- Tenant dashboard → `frontend/src/pages/dashboard.jsx`
- Owner dashboard → `frontend/src/pages/dashboard.jsx`
- Profile/preferences → `frontend/src/pages/profile.jsx`
- Chat → `frontend/src/pages/chat.jsx`
- Admin dashboard → `frontend/src/pages/admin.jsx`
- Login/register → `frontend/src/pages/auth.jsx`
- Shared UI → `frontend/src/components/common.jsx`
- Shared form controls → `frontend/src/components/forms.jsx`
- API transport → `frontend/src/api.js`
- Feature API wrappers → `frontend/src/services/`
- Constants → `frontend/src/config/constants.js`
- Formatting helpers → `frontend/src/utils/format.js`

## Backend
- Server/bootstrap → `backend/server.js`
- Auth → `backend/routes/auth.js`
- Properties → `backend/routes/properties.js`
- Favorites → `backend/routes/favorites.js`
- Applications → `backend/routes/applications.js`
- Roommate matching → `backend/routes/matches.js`
- Chat history → `backend/routes/chat.js`
- Admin → `backend/routes/admin.js`
- Auth middleware/roles → `backend/middleware/auth.js`
- Users → `backend/models/User.js`
- Properties → `backend/models/Property.js`
- Applications → `backend/models/Application.js`
- Favorites → `backend/models/Favorite.js`
- Messages → `backend/models/Message.js`
- Startup/admin bootstrap → `backend/services/bootstrap.js`
- Environment config → `backend/config/env.js`

## Adding a new feature
Example: add `visits`.
1. Create `backend/models/Visit.js`.
2. Create `backend/routes/visits.js`.
3. Mount it once in `backend/server.js`.
4. Create `frontend/src/services/visitService.js`.
5. Create `frontend/src/pages/visits.jsx`.
6. Add one route entry in `frontend/src/app/App.jsx`.
7. Add reusable UI in `frontend/src/components/` only when shared.
