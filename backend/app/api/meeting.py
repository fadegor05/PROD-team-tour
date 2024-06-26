from random import randint
from typing import Annotated

import geocoder
from fastapi import HTTPException
from fastapi import Query

from app.core.utils import get_available_time_slots
from app.crud.agent import get_agent_by_id
from app.crud.meeting import get_meeting_by_id, create_meeting, update_meeting_status, update_delay_status
from app.api.router import api_router
from app.crud.user import get_user_by_phone
from app.database import async_session
from app.schemas.meeting import MeetingGet, MeetingPost, MeetingPostResponse, MeetingPatch, MeetingDelayPatch
from datetime import datetime, timedelta


@api_router.get('/meeting')
async def get_meeting_by_id_handler(meeting_id: Annotated[int, Query()]) -> MeetingGet:
    async with async_session() as session:
        meeting = await get_meeting_by_id(session, id=meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="meeting not found")
    response = MeetingGet(meeting_id=meeting.id,
                          start_datetime=meeting.start_datetime.isoformat(),
                          end_datetime=meeting.end_datetime.isoformat(),
                          status=meeting.status, place=meeting.place, delay_status=meeting.delay_status,
                          agent_fullname=meeting.agent.fullname, agent_phone=meeting.agent.phone,
                          agent_image=meeting.agent.image)
    return response


@api_router.patch('/meeting')
async def update_meeting_handler(meeting_schema: MeetingPatch):
    async with async_session() as session:
        meeting = await get_meeting_by_id(session, id=meeting_schema.meeting_id)
        if not meeting:
            raise HTTPException(status_code=404, detail="meeting not found")
        await update_meeting_status(session, meeting=meeting, status=meeting_schema.status)
    return HTTPException(status_code=200, detail="OK")


@api_router.patch("/meeting_delay")
async def update_meeting_delay_handler(delay_schema: MeetingDelayPatch):
    async with async_session() as session:
        meeting = await get_meeting_by_id(session, id=delay_schema.meeting_id)
        if not meeting:
            raise HTTPException(status_code=404, detail="meeting not found")
        await update_delay_status(session, meeting=meeting, delay_status=delay_schema.delay_status)
    return HTTPException(status_code=200, detail="Success")


@api_router.post('/meeting')
async def create_meeting_handler(meeting_schema: MeetingPost) -> MeetingPostResponse:
    async with async_session() as session:
        user = await get_user_by_phone(session, meeting_schema.phone)
        if not user:
            raise HTTPException(status_code=404, detail="user not found")
        start_datetime = datetime.fromisoformat(meeting_schema.start_datetime)
        end_datetime = start_datetime + timedelta(hours=1)
        geo = geocoder.osm(meeting_schema.place).json
        if not geo or not geo['address'] or not geo['lng'] or not geo['lat']:
            raise HTTPException(status_code=404, detail='place not found')
        raw = geo['raw']
        address = raw['address']
        place_parts = [raw.get('name'), address.get('road'), address.get('house_number'),
                       address.get('city'), address.get('country')]
        place = ', '.join(list(filter(lambda item: item is not None, place_parts)))
        available_time_slots = await get_available_time_slots(session, start_datetime, geo['lng'], geo['lat'])
        available_agents = available_time_slots.get(start_datetime)
        if not available_agents:
            raise HTTPException(status_code=404)
        agent_id = available_agents[randint(0, len(available_agents) - 1)]
        agent = await get_agent_by_id(session, agent_id)
        meeting = await create_meeting(session, user=user, agent=agent, start_datetime=start_datetime,
                                       end_datetime=end_datetime, place=place, lon=geo['lng'], lat=geo['lat'])

    meeting = MeetingPostResponse(meeting_id=meeting.id)
    return meeting
