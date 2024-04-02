from random import randint
from typing import Annotated
from fastapi import HTTPException
from fastapi import Query
from app.crud.user import get_user_by_phone, create_user
from app.api.router import api_router
from app.database import async_session
from app.schemas.meeting import MeetingGet
from app.schemas.user import UserGet, UserCreateGet


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
                                    delay_status=meeting.delay_status,
                                    end_datetime=meeting.end_datetime.isoformat()) for meeting in meetings]
    user_response = UserGet(fullname=user.fullname, organization=user.organization,
                            organization_type=user.organization_type, meetings=meetings_response)
    return user_response


@api_router.get('/create_user')
async def create_user_handler() -> UserCreateGet:
    async with async_session() as session:
        phone = f'+7{randint(1000000000, 9999999999)}'
        if randint(0, 1) == 1:
            organization = 'Максимович'
            organization_type = 'ИП'
        else:
            organization = 'Третье джакузи за день'
            organization_type = 'ООО'
        user = await create_user(session, phone, 'Макс Максимович Бетов', organization, organization_type)
        return user