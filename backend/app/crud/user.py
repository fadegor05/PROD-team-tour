from typing import List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import User


async def get_users_all(session: AsyncSession) -> List[User]:
    stmt = select(User)
    result = await session.scalars(stmt)
    users = result.all()
    return users


async def create_user(session: AsyncSession, phone: str, fullname: str, organization: str,
                      organization_type: str) -> User:
    user = User(phone=phone, fullname=fullname, organization=organization,
                organization_type=organization_type)
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user


async def get_user_by_id(session: AsyncSession, id: int) -> User | None:
    stmt = select(User).where(User.id == id)
    user = await session.scalar(stmt)
    return user


async def get_user_by_phone(session: AsyncSession, phone: str) -> User | None:
    stmt = select(User).where(User.phone == phone)
    user = await session.scalar(stmt)
    return user
