import math
from copy import deepcopy
from datetime import datetime, timedelta
from typing import List

import geocoder

from fastapi import HTTPException

from app.api.router import api_router
from app.core.utils import generate_datetime_list
from app.crud.agent import get_agents_all
from app.crud.meeting import get_meetings_by_date_and_agent
from app.database import async_session
from app.schemas.time import AvailableTimePost, AvailableTimePostResponse
from app.service.service import get_route_duration


@api_router.post('/available_time')
async def available_time_handler(request_schema: AvailableTimePost) -> List[AvailableTimePostResponse]:
    async with async_session() as session:
        date = datetime.fromisoformat(request_schema.date)
        geo = geocoder.osm(request_schema.place).json
        lon = geo['lng']
        lat = geo['lat']
        if not lon or not lat:
            raise HTTPException(status_code=404, detail='place not found')
        agents = await get_agents_all(session)
        datetime_list = await generate_datetime_list(date)
        for agent in agents:
            meetings = await get_meetings_by_date_and_agent(session, date, agent)
            available_time = {}
            agent_datetime_list = deepcopy(datetime_list)
            for n, meeting in enumerate(meetings):
                duration = await get_route_duration([(meeting.lon, meeting.lat), (lon, lat)])
                duration = math.ceil(duration / 15) * 15
                start_datetime = meeting.start_datetime - timedelta(hours=1, minutes=duration)
                end_datetime = meeting.end_datetime + timedelta(minutes=duration)
                current_datetime = start_datetime
                while current_datetime < end_datetime:
                    if current_datetime in agent_datetime_list:
                        agent_datetime_list.remove(current_datetime)
                    current_datetime += timedelta(minutes=15)
            for agent_datetime in agent_datetime_list:
                if agent_datetime not in available_time:
                    available_time[agent_datetime] = True
    response = [AvailableTimePostResponse(start_datetime=time.isoformat()) for time in list(available_time)]
    return response
