from typing import List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Agent


async def get_agents_all(session: AsyncSession) -> List[Agent]:
    stmt = select(Agent)
    result = await session.scalars(stmt)
    agents = result.all()
    return agents


async def get_agent_by_id(session: AsyncSession, id: int) -> Agent | None:
    stmt = select(Agent).where(Agent.id == id)
    agent = await session.scalar(stmt)
    return agent


async def get_agent_by_phone(session: AsyncSession, phone: str) -> Agent | None:
    stmt = select(Agent).where(Agent.phone == phone)
    agent = await session.scalar(stmt)
    return agent


async def create_agent(session: AsyncSession, phone: str, fullname: str) -> Agent:
    agent = Agent(phone=phone, fullname=fullname)
    session.add(agent)
    await session.commit()
    await session.refresh(agent)
    return agent
