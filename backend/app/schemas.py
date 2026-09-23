from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field

EnquiryStatus = Literal["New", "Contacted", "In Discussion", "Qualified", "Converted", "Rejected", "Closed"]


class ContactCreate(BaseModel):
    organisation: str = Field(min_length=1)
    name: str = Field(min_length=1)
    email: EmailStr
    phone: str | None = None
    role: str = Field(min_length=1)
    service: str = Field(min_length=1)
    deployment: str | None = None
    message: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)


class EnquiryOut(BaseModel):
    id: int
    organisation: str
    contact: str
    email: str
    deployment_preference: str | None
    message: str | None
    date: datetime
    status: EnquiryStatus

    model_config = {"from_attributes": True}


class StatusUpdate(BaseModel):
    status: EnquiryStatus
