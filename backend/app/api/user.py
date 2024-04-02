from typing import Annotated
from fastapi import HTTPException
from fastapi import Query
from app.crud.user import get_user_by_phone
from app.api.router import api_router
from app.database import async_session
from app.schemas.meeting import MeetingGet
from app.schemas.user import UserGet


@api_router.get('/user')
async def get_user_handler(phone: Annotated[str, Query()]) -> UserGet:
    async with async_session() as session:
        user = await get_user_by_phone(session=session, phone=phone)
    if not user:
        raise HTTPException(status_code=404, detail="user with such phone not found")
    meetings = user.meetings

    meetings_response = [MeetingGet(meeting_id=meeting.id, status=meeting.status, place=meeting.place,
                                    agent_fullname=meeting.agent.fullname, agent_phone=meeting.agent.phone,
                                    agent_image=meeting.agent.image,
                                    start_datetime=meeting.start_datetime.isoformat(),
                                    end_datetime=meeting.end_datetime.isoformat()) for meeting in meetings]
    user_response = UserGet(fullname=user.fullname, organization=user.organization,
                            organization_type=user.organization_type, meetings=meetings_response)
    return user_response
