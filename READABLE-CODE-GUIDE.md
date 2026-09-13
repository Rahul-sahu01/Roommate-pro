# RoomMate Pro — Readable Code Guide

This version keeps the V4 behavior but separates the code into small files.

## Frontend

### `frontend/src/app/App.jsx`
Main page controller. It decides which page is visible.

### `frontend/src/pages/`
One file per screen:
- `home.jsx` — home page
- `properties.jsx` — property search and saved homes
- `matches.jsx` — roommate matching
- `dashboard.jsx` — tenant and owner dashboards
- `profile.jsx` — profile editing
- `chat.jsx` — real-time chat screen
- `admin.jsx` — admin dashboard
- `auth.jsx` — login and registration

### `frontend/src/components/`
Reusable UI pieces are separated by purpose:

`layout/` — header, footer, toast, splash

`ui/` — empty states, loading skeletons, benefits, auth gate

`forms/` — text fields and select fields

`property/` — property cards, details and property form

`dashboard/` — dashboard cards and application rows

`roommate/` — roommate match card

### `frontend/src/services/`
API functions are kept outside pages when a feature grows.

### `frontend/src/api.js`
One place for API requests, token handling and server errors.

## Backend

### `backend/server.js`
Starts Express, MongoDB and Socket.IO and connects all routes.

### `backend/routes/`
Routes only. Keep these files small.

### `backend/controllers/`
Business logic for each feature:
- `authController.js`
- `propertyController.js`
- `favoriteController.js`
- `applicationController.js`
- `matchController.js`
- `chatController.js`
- `adminController.js`

### `backend/models/`
MongoDB/Mongoose schemas.

### `backend/middleware/auth.js`
Authentication, role checks and ObjectId validation.

### `backend/services/`
Reusable backend logic and startup helpers.

### `backend/utils/`
Small helper functions such as JWT and safe user formatting.

## How to add a new feature

Example: add `Reviews`.

1. Create `backend/models/Review.js`
2. Create `backend/controllers/reviewController.js`
3. Create `backend/routes/reviews.js`
4. Connect the route in `backend/server.js`
5. Create `frontend/src/services/reviewService.js`
6. Create `frontend/src/pages/reviews.jsx` if it is a full page
7. Create reusable components inside `frontend/src/components/`
8. Add navigation only where needed

Keep each file focused on one job.

## Code style used here

- Simple variable names: `user`, `property`, `application`
- Small functions
- One main job per file
- Short lines
- Early returns for validation
- Comments for business logic, not obvious syntax
- Normal JavaScript and React; no TypeScript required
