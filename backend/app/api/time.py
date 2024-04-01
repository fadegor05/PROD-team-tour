from app.api.router import api_router
from app.database import async_session
from app.schemas.time import AvailableTimePost, AvailableTimePostResponse


@api_router.post('/available_time')
async def available_time_handler(request_schema: AvailableTimePost):  # -> List[AvailableTimePostResponse]
    async with async_session() as session:
        ...
    return {"route": "is in process..."}
