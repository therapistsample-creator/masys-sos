from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from .models import Enquiry, SuperAdmin
from .schemas import ContactCreate, EnquiryStatus
from .security import verify_password

STATUSES = ["New", "Contacted", "In Discussion", "Qualified", "Converted", "Rejected", "Closed"]


def authenticate_admin(db: Session, email: str, password: str) -> SuperAdmin | None:
    admin = db.scalar(select(SuperAdmin).where(SuperAdmin.email.ilike(email), SuperAdmin.status == "active"))
    return admin if admin and verify_password(password, admin.password) else None


def create_enquiry(db: Session, payload: ContactCreate) -> Enquiry:
    enquiry = Enquiry(
        organisation=payload.organisation,
        contact=payload.name,
        email=str(payload.email),
        deployment_preference=payload.deployment,
        message=payload.message,
        phone=payload.phone,
        role=payload.role,
        service=payload.service,
    )
    db.add(enquiry)
    db.commit()
    db.refresh(enquiry)
    return enquiry


def get_enquiries(db: Session, search: str = "", status: str = "all") -> list[Enquiry]:
    query = select(Enquiry)
    if search.strip():
        term = f"%{search.strip()}%"
        query = query.where(or_(Enquiry.organisation.ilike(term), Enquiry.contact.ilike(term), Enquiry.email.ilike(term)))
    if status != "all" and status in STATUSES:
        query = query.where(Enquiry.status == status)
    return list(db.scalars(query.order_by(Enquiry.date.desc())).all())


def update_status(db: Session, enquiry_id: int, status: EnquiryStatus) -> Enquiry | None:
    enquiry = db.get(Enquiry, enquiry_id)
    if not enquiry:
        return None
    enquiry.status = status
    db.commit()
    db.refresh(enquiry)
    return enquiry
