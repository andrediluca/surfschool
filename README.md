# Delta9 Surf School

Booking web app for Delta9 Surf School, Marina di Carrara.  
Django REST Framework backend · React frontend · SQLite database.

---

## Requirements

- Python 3.11+
- Node.js 18+
- npm

---

## Project structure

```
surf/
├── .venv/                  # Python virtual environment
├── surfschool/             # Django project
│   ├── bookings/           # Main app (models, views, serializers)
│   ├── surfschool/         # Django settings & root URLs
│   └── db.sqlite3          # Database (auto-created)
└── frontend/               # React app
```

---

## Backend setup

```bash
# 1. Create and activate virtual environment (first time only)
cd /path/to/surf
python3 -m venv .venv
source .venv/bin/activate

# 2. Install dependencies (first time only)
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers

# 3. Apply database migrations
cd surfschool
python manage.py migrate

# 4. Create a staff/admin user (first time only)
python manage.py createsuperuser

# 5. Run the development server
python manage.py runserver
```

Backend runs on **http://localhost:8000**  
Admin panel at **http://localhost:8000/admin/**

> To mark a user as instructor/staff: go to `/admin/` → Users → select user → check "Staff status"

> **User forgot their password?** Go to `/admin/` → Users → click the user → click "this form" in the password section → set a new password → Save. Then send them the new password directly (WhatsApp, etc.).

---

## Frontend setup

```bash
# 1. Install dependencies (first time only)
cd frontend
npm install

# 2. Start the dev server
npm start
```

Frontend runs on **http://localhost:3000**  
API calls are proxied automatically to Django on port 8000.

> Both servers must run simultaneously. Open two terminals.

---

## Running the full app (daily workflow)

**Terminal 1 — Backend:**
```bash
source .venv/bin/activate
cd surfschool
python manage.py runserver
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm start
```

Then open **http://localhost:3000**

---

## Quick demo — share with anyone instantly

No deployment needed. Use a tunnel to expose your local app publicly.

**Option A — Cloudflare (recommended, no account needed):**
```bash
# Install once
npm install -g cloudflared

# Expose the React app
npx cloudflared tunnel --url http://localhost:3000
```

**Option B — ngrok:**
```bash
# Install once
npm install -g ngrok

# Expose the React app
ngrok http 3000
```

Both give you a public `https://` URL immediately.  
Share it while both local servers are running — the tunnel proxies everything including API calls.

> The URL changes every time you restart the tunnel on free plans.

---

## Instructor access

The instructor dashboard is at **/instructor** (staff users only).

From the instructor dashboard you can:
- Create surf sessions and add level groups (beginner / intermediate / advanced)
- Drag participants between groups
- Manage surfboard inventory and rentals
- Publish daily sea condition updates
- Create a **Surf Call** (competition-style waiting window) and flip it **SESSION ON**
- Check in students by QR code scan or manual OK buttons

---

## Push notifications

Users receive OS-level push notifications (works on Android and on iOS when the app is installed as a PWA) for:
- **New lesson posted** — only sent to users whose level matches the new slot (or users with no booking history)
- **Surf call opened** — sent to all subscribers when the waiting window is created
- **SESSION ON** — sent to all subscribers when the instructor flips the call to active

### How it works

The stack is **Web Push API + VAPID + Service Worker**:
- Django stores each browser's push subscription (`endpoint`, `p256dh`, `auth`) in the `PushSubscription` table
- When a trigger fires (new slot, surf call status change), Django calls `pywebpush` in a background thread to fan out push messages
- The service worker (`frontend/public/sw.js`) receives the push and shows a system notification even when the app is closed

### User flow

1. Log in → the 🔕 bell appears in the navbar
2. Tap it → browser asks for notification permission
3. On grant → subscription is saved to the backend
4. Tap the 🔔 bell again at any time to unsubscribe

**iOS note:** push only works after adding the app to the Home Screen (Safari → Share → Add to Home Screen). Once installed as a PWA, notifications work normally. Requires iOS 16.4+.

### Backend dependency

`pywebpush` must be installed in the virtualenv:

```bash
.venv/bin/python -m ensurepip   # only needed if pip is missing
.venv/bin/python -m pip install pywebpush
```

### VAPID keys

VAPID keys are stored in `surfschool/surfschool/settings.py`:

```python
VAPID_PRIVATE_KEY = "..."   # URL-safe base64 DER — generated via py_vapid
VAPID_PUBLIC_KEY  = "..."   # URL-safe base64 uncompressed point — served to browsers
VAPID_ADMIN_EMAIL = "admin@delta9surf.it"
```

**Do not regenerate keys unless necessary** — all existing browser subscriptions are tied to the public key. Regenerating silently breaks them for every user (they need to re-subscribe).

To regenerate (e.g. for a new deployment):

```python
from py_vapid import Vapid
from cryptography.hazmat.primitives.serialization import Encoding, PrivateFormat, PublicFormat, NoEncryption
import base64

v = Vapid()
v.generate_keys()

priv_der = v.private_key.private_bytes(Encoding.DER, PrivateFormat.TraditionalOpenSSL, NoEncryption())
print("PRIVATE:", base64.urlsafe_b64encode(priv_der).decode())

pub_bytes = v.public_key.public_bytes(Encoding.X962, PublicFormat.UncompressedPoint)
print("PUBLIC:", base64.urlsafe_b64encode(pub_bytes).decode().rstrip('='))
```

Before production: move `VAPID_PRIVATE_KEY` out of `settings.py` and into an environment variable.

---

## API overview

All endpoints are under `/api/`.

| Endpoint | Access | Description |
|---|---|---|
| `POST /api/auth/register/` | Public | Create account |
| `POST /api/auth/login/` | Public | Get JWT tokens |
| `POST /api/auth/refresh/` | Public | Refresh access token |
| `GET /api/auth/me/` | Auth | Current user info |
| `GET /api/auth/stats/` | Auth | Personal lesson & rental stats |
| `GET /api/lessons/` | Public | All sessions with slots |
| `GET /api/conditions/` | Public | Sea condition history |
| `GET /api/surfcall/` | Public | Active surf call (if any) |
| `GET/POST /api/bookings/` | Auth | User's lesson bookings |
| `GET/POST /api/rentals/` | Auth | User's board rentals |
| `GET /api/rentals/availability/` | Public | Hourly board availability |
| `GET /api/surfboards/` | Public | Board inventory |
| `instructor/*` | Staff | Full management endpoints |
| `GET/POST/DELETE /api/auth/push/` | Auth | Manage push subscription |
| `GET /api/push/vapid-public-key/` | Public | VAPID public key for browser |

---

## Production deployment (when ready)

Before deploying, update these things:

**`surfschool/surfschool/settings.py`:**
```python
DEBUG = False
ALLOWED_HOSTS = ['yourdomain.com']          # currently ['*'] — must restrict
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = ['https://your-frontend-domain.com']
```

**`frontend/src/api.js`:**
```js
// baseURL is already relative ('/api/') — no change needed if frontend and
// backend share the same domain. If hosted separately, set the absolute URL:
baseURL: 'https://your-api-domain.com/api/'
```

**`frontend/.env`:**
```
# Remove DANGEROUSLY_DISABLE_HOST_CHECK=true — dev-only flag for ngrok tunnelling,
# not needed (and should not be present) in production.
```

### Recommended hosting
- **Railway** (backend) + **Vercel** (frontend) — simplest, both have free tiers
- **Aruba VPS** — full control, requires nginx + gunicorn setup
