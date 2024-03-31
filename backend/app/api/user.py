from typing import Annotated
from fastapi import HTTPException
from fastapi import Query
from app.crud.user import get_user_by_phone
from app.api.router import api_router
from app.database import async_session
from app.schemas.user import UserGet


@api_router.get('/user')
async def get_user_handler(phone: Annotated[str, Query()]) -> UserGet:
    async with async_session() as session:
        user = await get_user_by_phone(session=session, phone=phone)
    if not user:
        raise HTTPException(status_code=404, detail="user with such phone not found")
    return user
