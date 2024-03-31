from pydantic import BaseModel


class AvailableTimePost(BaseModel):
    place: str
    date: str


class AvailableTimePostResponse(BaseModel):
    start_datetime: str
