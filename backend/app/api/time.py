import math
from copy import deepcopy
from datetime import datetime, timedelta
from typing import List

import geocoder

from fastapi import HTTPException

from app.api.router import api_router
from app.core.utils import generate_datetime_dict, generate_datetime_list
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
        lon = geo.get('lng')
        lat = geo.get('lat')
        if not lon or not lat:
            raise HTTPException(status_code=404, detail='place not found')
        agents = await get_agents_all(session)
        datetime_list = await generate_datetime_list(date)
        available_time = await generate_datetime_dict(date)
        for agent in agents:
            meetings = await get_meetings_by_date_and_agent(session, date, agent)
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
                if agent_datetime in available_time:
                    available_time[agent_datetime].append(agent.id)
        for time in list(available_time):
            if len(available_time[time]) == 0:
                del available_time[time]
    response = [AvailableTimePostResponse(start_datetime=time.isoformat()) for time in list(available_time)]
    return response
