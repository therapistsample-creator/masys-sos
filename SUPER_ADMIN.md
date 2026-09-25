# Super Admin module

The Super Admin module is intentionally isolated from the landing page in:

- `src/super-admin/` — login, dashboard, API client, and presentation styles.
- `backend/app/` — FastAPI routes, custom auth/RBAC middleware, SQLAlchemy models/services, and PostgreSQL access.
- `backend/alembic/versions/001_super_admin.py` — Alembic migration and bootstrap account.

## Setup

1. Copy `.env.example` to `.env` and set `DATABASE_URL` and `SECRET_KEY`.
2. Create a Python virtual environment and install `pip install -r backend/requirements.txt`.
3. Run `cd backend && alembic upgrade head`.
4. Start the API with `npm run dev:api` for development or `npm run start:api` with Gunicorn/Uvicorn workers.
5. Open `/super-admin` and sign in with the requested bootstrap credentials.

The bootstrap password is stored only as a bcrypt hash. Enquiries are persisted before email notification is attempted, so a mail configuration problem cannot lose a landing-page submission.
