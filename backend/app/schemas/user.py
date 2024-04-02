from pydantic import BaseModel
from typing import List
from .meeting import MeetingGet


class UserGet(BaseModel):
    fullname: str
    organization: str
    organization_type: str
    meetings: List[MeetingGet]


class UserCreateGet(BaseModel):
    phone: str
