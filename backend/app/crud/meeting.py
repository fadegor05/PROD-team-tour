import datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import User, Agent, Meeting


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
