from datetime import datetime, timezone

import bcrypt
from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer

from .config import settings

serializer = URLSafeTimedSerializer(settings.secret_key, salt="super-admin-session")


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode(), password_hash.encode())


def create_session(admin_id: int) -> str:
    return serializer.dumps({"admin_id": admin_id, "issued_at": datetime.now(timezone.utc).isoformat()})


def read_session(token: str) -> int | None:
    try:
        return int(serializer.loads(token, max_age=8 * 60 * 60)["admin_id"])
    except (BadSignature, SignatureExpired, KeyError, TypeError, ValueError):
        return None
