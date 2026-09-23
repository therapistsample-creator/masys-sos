from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse

from sqlalchemy.orm import Session

from .database import SessionLocal
from .models import SuperAdmin
from .security import read_session


class SuperAdminAuthMiddleware(BaseHTTPMiddleware):
    """Custom RBAC boundary for future compliance modules and tenant scopes."""

    async def dispatch(self, request: Request, call_next):
        if not request.url.path.startswith("/api/super-admin/enquiries"):
            return await call_next(request)

        token = request.cookies.get("sa_session")
        admin_id = read_session(token) if token else None
        if not admin_id:
            return JSONResponse({"error": "Authentication required."}, status_code=401)

        db: Session = SessionLocal()
        try:
            admin = db.get(SuperAdmin, admin_id)
            if not admin or admin.status != "active" or admin.role != "super-admin":
                return JSONResponse({"error": "Super Admin access required."}, status_code=403)
            request.state.admin = admin
            return await call_next(request)
        finally:
            db.close()
