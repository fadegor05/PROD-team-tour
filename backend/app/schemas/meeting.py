from pydantic import BaseModel


class MeetingGet(BaseModel):
    start_datetime: str
    end_datetime: str
    status: str
    place: str
    agent_fullname: str
    agent_phone: str


class MeetingPost(BaseModel):
    place: str
    start_datetime: str
    phone: str


class MeetingPostResponse(BaseModel):
    meeting_id: str


class MeetingPatch(BaseModel):
    status: str
