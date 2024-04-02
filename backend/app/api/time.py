from datetime import datetime
from typing import List

import geocoder

from fastapi import HTTPException

from app.api.router import api_router
from app.core.utils import get_available_time_slots
from app.database import async_session
from app.schemas.time import AvailableTimePost, AvailableTimePostResponse


@api_router.post('/available_time')
async def available_time_handler(request_schema: AvailableTimePost) -> List[AvailableTimePostResponse]:
    async with async_session() as session:
        date = datetime.fromisoformat(request_schema.date)
        geo = geocoder.osm(request_schema.place).json
        if not geo or not geo['lng'] or not geo['lat']:
            raise HTTPException(status_code=404, detail='place not found')
        available_time_slots = await get_available_time_slots(session, date, geo['lng'], geo['lat'])
    response = [AvailableTimePostResponse(start_datetime=time.isoformat()) for time in list(available_time_slots)]
    return response
