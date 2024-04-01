from pydantic import BaseModel


class MeetingGet(BaseModel):
    meeting_id: int
    start_datetime: str
    end_datetime: str
    status: str
    place: str
    agent_fullname: str
    agent_phone: str
    agent_image: str


class MeetingPost(BaseModel):
    place: str
    start_datetime: str
    phone: str


class MeetingPostResponse(BaseModel):
    meeting_id: int


class MeetingPatch(BaseModel):
    meeting_id: int
    status: str
