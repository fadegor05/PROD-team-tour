from typing import Annotated
from fastapi import HTTPException
from fastapi import Query

from app.crud.agent import get_agent_by_id
from app.crud.meeting import get_meeting_by_id, create_meeting, update_meeting_status
from app.api.router import api_router
from app.crud.user import get_user_by_phone
from app.database import async_session
from app.schemas.meeting import MeetingGet, MeetingPost, MeetingPostResponse, MeetingPatch
from datetime import datetime, timedelta


@api_router.get('/meeting')
async def get_meeting_by_id_handler(meeting_id: Annotated[int, Query()]) -> MeetingGet:
    async with async_session() as session:
        meeting = await get_meeting_by_id(session, id=meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="meeting not found")
    response = MeetingGet(start_datetime=meeting.start_datetime.isoformat(),
                          end_datetime=meeting.end_datetime.isoformat(),
                          status=meeting.status, place=meeting.place,
                          agent_fullname=meeting.agent.fullname, agent_phone=meeting.agent.phone)
    return response


@api_router.patch('/meeting')
async def update_meeting_handler(meeting_schema: MeetingPatch):
    async with async_session() as session:
        meeting = await get_meeting_by_id(session, id=meeting_schema.meeting_id)
        if not meeting:
            raise HTTPException(status_code=404, detail="meeting not found")
        await update_meeting_status(session, meeting=meeting, status=meeting_schema.status)
    return HTTPException(status_code=200, detail="OK")


@api_router.post('/meeting')
async def create_meeting_handler(meeting_schema: MeetingPost) -> MeetingPostResponse:
    async with async_session() as session:
        user = await get_user_by_phone(session, meeting_schema.phone)
        if not user:
            raise HTTPException(status_code=404, detail="user not found")
        start_datetime = datetime.fromisoformat(meeting_schema.start_datetime)
        end_datetime = datetime.fromisoformat(meeting_schema.start_datetime) + timedelta(hours=1)
        # agent = await get_available_agent(start_datetime, meeting_schema.place)
        agent = await get_agent_by_id(session, id=1)  # PLACEHOLDER
        meeting = await create_meeting(session, user=user, agent=agent, start_datetime=start_datetime,
                                       end_datetime=end_datetime, place=meeting_schema.place, lon=1.2, lat=1.3)
        #  TODO: lon и lat должны получаться (как-то), внедрить механику нахождения свободного агента (48-49 стр)

    meeting = MeetingPostResponse(meeting_id=meeting.id)
    return meeting