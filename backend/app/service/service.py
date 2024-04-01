from typing import Tuple, List

from app.service.api import request_ors_api


async def get_route_duration(coordinates: List[Tuple[float, float]]) -> int:
    response = await request_ors_api(coordinates)
    return round(response['routes'][0]['summary']['duration'] / 60)
