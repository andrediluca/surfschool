# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Delta9 Surf School** — Marina di Carrara, Tuscany. A surf school booking web app with a Django REST Framework backend and a React frontend. Users book surf lessons, rent surfboards, and view sea conditions. Instructors have a separate dashboard for managing sessions, check-ins, and students.

## Development Commands

### Backend (Django)

```bash
# Activate virtualenv first
source .venv/bin/activate

# Run the development server (from surfschool/)
cd surfschool && python manage.py runserver

# Apply migrations
python manage.py migrate

# Create new migrations after model changes
python manage.py makemigrations

# Run tests
python manage.py test bookings

# Open Django shell
python manage.py shell
```

### Frontend (React)

```bash
cd frontend

# Start dev server (proxies API calls to Django on :8000)
npm start

# Build for production
npm run build
```

Both servers must run simultaneously during development: Django on port 8000, React on port 3000.

## Architecture

### Backend (`surfschool/`)

Single Django app `bookings`. Models:

- `Lesson` — a surf session: date + time only (no level/instructor directly)
- `LessonSlot` — child of `Lesson`; one slot per level/instructor combo. Fields: `lesson` (FK), `level` (beginner/intermediate/advanced), `instructor`, `max_participants`, `spots_left`
- `Booking` — links `User` → `LessonSlot`. Status: `booked`, `waitlist`, `cancelled`. Has `reference` (UUID, for QR check-in) and `checked_in` (bool)
- `Surfboard` — board inventory: type (shortboard/longboard/soft-top), size, is_available
- `BoardRental` — links `User` → `Surfboard` for a time window. Has `reference` (UUID) and `checked_in`. Enforces overlap prevention
- `SeaCondition` — daily instructor report: wave_height, water_temp, level_suitability, description

Auth uses **JWT** (`rest_framework_simplejwt`):
- `POST /api/auth/login/` — access + refresh tokens
- `POST /api/auth/refresh/`
- `POST /api/auth/register/`

Permission pattern:
- Public read: lessons, conditions, surfboard list
- `IsAuthenticated`: bookings, rentals, stats
- `IsStaff`: all instructor/* endpoints

Key views (beyond standard ViewSets):
- `CheckinView` (`/api/instructor/checkin/`) — GET `?ref=<uuid>` lookups, POST `{ref}` or `{booking_id}` to mark checked_in. Resolves BoardRental first, then Booking
- `MyStatsView` (`/api/auth/stats/`) — per-user lesson counts, level breakdown, board type usage
- `InstructorStudentView` (`/api/instructor/students/`) — all users with booking/rental history, same stats shape as MyStatsView
- `_promote_waitlist(slot)` — helper called on cancellation/deletion: promotes first waitlisted booking or restores spots_left

Router endpoints:
```
/api/lessons/                  → LessonViewSet (read-only, public)
/api/bookings/                 → BookingViewSet
/api/rentals/                  → BoardRentalViewSet (+ /availability/)
/api/surfboards/               → SurfboardViewSet
/api/conditions/               → SeaConditionViewSet (public read)
/api/instructor/lessons/       → InstructorLessonViewSet
/api/instructor/slots/         → InstructorSlotViewSet
/api/instructor/bookings/      → InstructorBookingViewSet (filterable by ?lesson=, ?slot=, ?date=)
/api/instructor/rentals/       → InstructorRentalViewSet (filterable by ?date=, ?board=, ?ref=)
/api/instructor/conditions/    → InstructorConditionViewSet
/api/instructor/checkin/       → CheckinView
/api/instructor/students/      → InstructorStudentView
/api/auth/stats/               → MyStatsView
```

### Frontend (`frontend/src/`)

React app with React Router. Key files:

- `api.js` — Axios instance with baseURL `/api/` (relative); attaches JWT Bearer token from `localStorage` (skipped for `conditions` endpoints). CRA proxy in `package.json` forwards `/api/` to `http://127.0.0.1:8000` in development.
- `context/AuthContext.js` — `AuthProvider` exposes `isLoggedIn`, `isStaff`, `login(token)`, `logout()` via `useAuth()`
- `hooks/useAutoRefresh.js` — polls every 30s + re-fetches on `visibilitychange`
- `App.js` — routes: `/`, `/login`, `/signup`, `/dashboard`, `/conditions`, `/booking/:id`

Components:
- `Dashboard.js` — tabbed layout (📋 Prenotazioni | 🏄 Lezioni | 🛹 Noleggio | 📊 Stats). Default tab: bookings
- `MyBookings.js` — lesson bookings + rentals; inline collapsible QR for lessons; `useAutoRefresh`
- `LessonList.js` — sessions with nested slot rows; books by slot id
- `MyStats.js` — personal stats: level progression bar, level breakdown, board types
- `Conditions.js` — webcam (bagnoparadiso.com/bagnoparadiso.jpg, 60s refresh), Open-Meteo forecast, sea now card, instructor hero card
- `InstructorDashboard.js` — staff-only; tabs: 📋 Lezioni | 🌊 Condizioni | 🛹 Tavole | 👤 Studenti | ✓ Check-in

InstructorDashboard tabs:
- **Lezioni**: create sessions, add slots per level/instructor, drag-and-drop participants between slots
- **Condizioni**: publish daily sea condition updates
- **Tavole**: board inventory, toggle availability, today's rentals per board
- **Studenti**: searchable student cards with lesson count, level progression, board usage
- **Check-in**: three sub-tabs — 🏄 Lezioni (today's bookings grouped by session→slot, big ○/✓ buttons), 🛹 Noleggi (today's rentals grouped by board), 📷 QR (jsQR camera scanner + manual UUID input)

`InstructorDashboard` is **not yet routed** in App.js — accessed directly by staff.

### Data flow

Frontend → `api.js` (Axios + JWT) → Django REST API → SQLite (`db.sqlite3`)

`CORS_ALLOW_ALL_ORIGINS = True` in Django settings (development only — restrict before production).

## Design System

All dashboard/app components use **CSS-in-JS** (a `const css = \`...\`` string injected via `<style>{css}</style>`), **not** Tailwind utility classes. Tailwind is present but only used in landing/public pages.

### Tokens
| Token | Value |
|---|---|
| Background | `#06101f` |
| Accent (teal) | `#1de9d8` |
| Accent light | `#1de9b4` |
| Warning | `#ffc128` |
| Danger | `#ff8080` |
| Text | `#e8f0f7` |
| Text muted | `rgba(232,240,247,0.4)` |

### Fonts
- **Bebas Neue** — headings, labels, badges, numbers
- **Nunito** — body text, inputs

### Patterns
- Dark cards: `background: linear-gradient(135deg, rgba(255,255,255,0.035), rgba(255,255,255,0.01)); border: 1px solid rgba(29,233,216,0.12)`
- Teal accent borders on active/focus states
- Level badges: beginner=teal-green, intermediate=yellow, advanced=red
- Never flat solid backgrounds — always subtle gradients

### Webcam
- Source: `https://bagnoparadiso.com/bagnoparadiso.jpg`
- Refreshed every 60s with `?t=<timestamp>` cache-buster
- `img.php` on the same domain returns empty body — do not use it

## Deployment (pending)

Not yet deployed. Waiting for user feedback on the app before choosing a host. Options evaluated:
- **Railway** (backend) + **Vercel** (frontend) — simplest, free tier
- **Aruba VPS** — Italian host, full control, requires nginx + gunicorn setup

Before deploying:
- Set `CORS_ALLOW_ALL_ORIGINS = False` and configure `CORS_ALLOWED_ORIGINS` with the production frontend URL
- Set `ALLOWED_HOSTS` to the production domain (currently `['*']` for dev — must be restricted)
- `api.js` baseURL is already relative (`/api/`) — no change needed if frontend and backend are on the same domain. If hosted separately, change it to the absolute production API URL.
- Remove or restrict `DANGEROUSLY_DISABLE_HOST_CHECK=true` from `frontend/.env` (dev-only flag for ngrok/tunnel access; harmless in a production build but should not be present)
