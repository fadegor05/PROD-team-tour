import math
from copy import deepcopy
from datetime import datetime, timedelta
from typing import Dict, List

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.data import USERS, AGENTS, MEETINGS
from app.crud.agent import get_agents_all, create_agent, get_agent_by_id
from app.crud.meeting import create_meeting, get_meetings_by_date_and_agent
from app.crud.user import get_users_all, create_user, get_user_by_id
from app.database import async_session
from app.services.ors.service import get_route_duration


async def generate_datetime_dict(date: datetime, from_hour: int = 9, to_hour: int = 20) -> Dict:
    start_time = datetime(date.year, date.month, date.day, from_hour, 0, 0)
    end_time = datetime(date.year, date.month, date.day, to_hour, 0, 0)

    time_values = {}

    current_time = start_time
    while current_time <= end_time:
        time_values[current_time] = []
        current_time += timedelta(minutes=15)

    return time_values


async def generate_datetime_list(date: datetime, from_hour: int = 9, to_hour: int = 20) -> List[datetime]:
    start_time = datetime(date.year, date.month, date.day, from_hour, 0, 0)
    end_time = datetime(date.year, date.month, date.day, to_hour, 0, 0)

    time_values = []

    current_time = start_time
    while current_time <= end_time:
        time_values.append(current_time)
        current_time += timedelta(minutes=15)

    return time_values


async def db_fill() -> None:
    async with async_session() as session:
        users = await get_users_all(session)
        agents = await get_agents_all(session)
        if len(users) == 0 and len(agents) == 0:
            await db_fill_data(session)


async def db_fill_data(session: AsyncSession) -> None:
    for user_data in USERS:
        await create_user(session, phone=user_data['phone'], fullname=user_data['fullname'],
                          organization=user_data['organization'],
                          organization_type=user_data['organization_type'])

    for agent_data in AGENTS:
        await create_agent(session, phone=agent_data['phone'], fullname=agent_data['fullname'], image=agent_data['image'])

    for n, meeting_data in enumerate(MEETINGS):
        user = await get_user_by_id(session, meeting_data['user_id'])
        agent = await get_agent_by_id(session, meeting_data['agent_id'])
        now = datetime.now()
        start_datetime = datetime(now.year, now.month, now.day, 10+n, 15*n, 0)
        await create_meeting(session, user=user, agent=agent,
                             start_datetime=start_datetime,
                             end_datetime=start_datetime + timedelta(hours=1),
                             place=meeting_data['place'], lon=meeting_data['lon'], lat=meeting_data['lat'])


async def get_available_time_slots(session: AsyncSession, date: datetime, lon: float,
                                   lat: float) -> Dict[datetime, List[int]]:
    agents = await get_agents_all(session)
    time_slots_list = await generate_datetime_list(date)
    available_time_slots = await generate_datetime_dict(date)
    for agent in agents:
        meetings = await get_meetings_by_date_and_agent(session, date, agent)
        agent_time_slots_list = deepcopy(time_slots_list)
        for n, meeting in enumerate(meetings):
            duration = await get_route_duration([(meeting.lon, meeting.lat), (lon, lat)])
            duration = math.ceil(duration / 15) * 15
            start_datetime = meeting.start_datetime - timedelta(hours=1, minutes=duration)
            end_datetime = meeting.end_datetime + timedelta(minutes=duration+30)  # 30 mins opportunity to delay meeting
            current_datetime = start_datetime
            while current_datetime < end_datetime:
                if current_datetime in agent_time_slots_list:
                    agent_time_slots_list.remove(current_datetime)
                current_datetime += timedelta(minutes=15)
        for agent_datetime in agent_time_slots_list:
            if agent_datetime in available_time_slots:
                available_time_slots[agent_datetime].append(agent.id)
    for time_slot in list(available_time_slots):
        if not available_time_slots[time_slot]:
            del available_time_slots[time_slot]
    return available_time_slots
