from copy import deepcopy
from datetime import datetime, timedelta
from typing import List

from app.api.router import api_router
from app.core.utils import generate_datetime_list
from app.crud.agent import get_agents_all
from app.crud.meeting import get_meetings_by_date_and_agent
from app.database import async_session
from app.schemas.time import AvailableTimePost, AvailableTimePostResponse


@api_router.post('/available_time')
async def available_time_handler(request_schema: AvailableTimePost) -> List[AvailableTimePostResponse]:
    async with async_session() as session:
        date = datetime.fromisoformat(request_schema.date)
        agents = await get_agents_all(session)
        datetime_list = await generate_datetime_list(date)
        for agent in agents:
            meetings = await get_meetings_by_date_and_agent(session, date, agent)
            available_time = {}
            agent_datetime_list = deepcopy(datetime_list)
            for meeting in meetings:
                start_datetime = meeting.start_datetime - timedelta(hours=1)
                end_datetime = meeting.end_datetime + timedelta(minutes=15)
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
