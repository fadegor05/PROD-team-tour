import datetime
from typing import List

from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import User, Agent, Meeting


async def get_meetings_by_date_and_agent(session: AsyncSession, date: datetime.datetime, agent: Agent) -> List[Meeting]:
    min_datetime = datetime.datetime(date.year, date.month, date.day, 0, 0, 0)
    max_datetime = datetime.datetime(date.year, date.month, date.day, 23, 59, 59)
    stmt = select(Meeting).where(and_(Meeting.start_datetime >= min_datetime, Meeting.end_datetime <= max_datetime,
                                      Meeting.agent_id == agent.id,
                                      Meeting.status == 'confirmed')).order_by(Meeting.start_datetime)
    result = await session.scalars(stmt)
    meetings = result.all()
    return meetings


async def create_meeting(session: AsyncSession, user: User, agent: Agent,
                         start_datetime: datetime.datetime, end_datetime: datetime.datetime,
                         place: str, lon: float, lat: float) -> Meeting:
    meeting = Meeting(user=user, agent=agent, start_datetime=start_datetime,
                      end_datetime=end_datetime, place=place, lon=lon, lat=lat)
    session.add(meeting)
    await session.commit()
    await session.refresh(meeting)
    return meeting


async def update_meeting_status(session: AsyncSession, meeting: Meeting, status: str) -> Meeting:
    meeting.status = status
    await session.commit()
    await session.refresh(meeting)
    return meeting


async def get_meeting_by_id(session: AsyncSession, id: int) -> Meeting | None:
    stmt = select(Meeting).where(Meeting.id == id)
    meeting = await session.scalar(stmt)
    return meeting
