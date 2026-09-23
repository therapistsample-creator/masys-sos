from contextlib import asynccontextmanager
from email.message import EmailMessage
import smtplib

from fastapi import Depends, FastAPI, HTTPException, Query, Request, Response
from sqlalchemy.orm import Session

from .config import settings
from .database import Base, SessionLocal, engine, get_db
from .middleware import SuperAdminAuthMiddleware
from .models import SuperAdmin
from .schemas import ContactCreate, EnquiryOut, LoginRequest, StatusUpdate
from .security import create_session, read_session
from .services import STATUSES, authenticate_admin, create_enquiry, get_enquiries, update_status


BOOTSTRAP_PASSWORD_HASH = "$2b$12$gAgL.t67bzyhq2/BBQKCuuEdpMlUekrTCrhoONJv2zORPwrochEz6"


@asynccontextmanager
async def lifespan(_: FastAPI):
    # Alembic owns schema changes. This only makes local first-run startup friendly.
    if settings.database_url:
        Base.metadata.create_all(bind=engine)
        with SessionLocal() as db:
            if not db.query(SuperAdmin).filter(SuperAdmin.email == "iamtanujha@gmail.com").first():
                db.add(SuperAdmin(name="Tanu", email="iamtanujha@gmail.com", password=BOOTSTRAP_PASSWORD_HASH, phone="9350826298", role="super-admin", status="active"))
                db.commit()
    yield


app = FastAPI(title="StandardsOS API", lifespan=lifespan)
app.add_middleware(SuperAdminAuthMiddleware)


@app.get("/health")
def health():
    return {"ok": True}


@app.post("/api/contact")
def submit_contact(payload: ContactCreate, db: Session = Depends(get_db)):
    enquiry = create_enquiry(db, payload)
    # Email delivery is intentionally a notification side effect; persistence is already complete.
    return {"ok": True, "persisted": True, "emailSent": send_contact_notifications(payload)}


def send_contact_notifications(payload: ContactCreate) -> bool:
    if not all((settings.gmail_user, settings.gmail_app_password, settings.contact_admin_email)):
        return False
    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(settings.gmail_user, settings.gmail_app_password)
            for recipient, subject, content in [
                (settings.contact_admin_email, f"New enquiry from {payload.name} — {payload.organisation}", payload.model_dump_json()),
                (str(payload.email), "We received your enquiry", f"Hi {payload.name}, we have received your enquiry and will be in touch within one business day."),
            ]:
                message = EmailMessage()
                message["From"] = settings.gmail_user
                message["To"] = recipient
                message["Subject"] = subject
                message.set_content(content)
                smtp.send_message(message)
        return True
    except Exception:
        return False


@app.post("/api/super-admin/login")
def login(payload: LoginRequest, response: Response, db: Session = Depends(get_db)):
    admin = authenticate_admin(db, str(payload.email), payload.password)
    if not admin:
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    response.set_cookie("sa_session", create_session(admin.id), httponly=True, secure=settings.cookie_secure, samesite="strict", max_age=8 * 60 * 60, path="/")
    return {"admin": {"id": admin.id, "name": admin.name, "email": admin.email, "role": admin.role}}


@app.post("/api/super-admin/logout")
def logout(response: Response):
    response.delete_cookie("sa_session", path="/")
    return {"ok": True}


@app.get("/api/super-admin/session")
def session(request: Request):
    return {"authenticated": read_session(request.cookies.get("sa_session", "")) is not None}


@app.get("/api/super-admin/enquiries", response_model=dict)
def list_enquiries(search: str = Query(""), status_filter: str = Query("all", alias="status"), db: Session = Depends(get_db)):
    enquiries = get_enquiries(db, search, status_filter)
    return {"enquiries": [EnquiryOut.model_validate(item) for item in enquiries], "statuses": STATUSES}


@app.patch("/api/super-admin/enquiries/{enquiry_id}")
def change_enquiry_status(enquiry_id: int, payload: StatusUpdate, db: Session = Depends(get_db)):
    enquiry = update_status(db, enquiry_id, payload.status)
    if not enquiry:
        raise HTTPException(status_code=404, detail="Enquiry not found.")
    return {"enquiry": EnquiryOut.model_validate(enquiry)}
