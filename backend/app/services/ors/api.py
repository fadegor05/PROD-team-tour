from typing import Tuple, List, Dict

import requests

from app.core.config import ORS_KEY


async def request_ors_api(coordinates: List[Tuple[float, float]]) -> Dict:
    url = 'https://api.openrouteservice.org/v2/directions/driving-car'
    body = {
        'coordinates': coordinates,
        'radiuses': [900]
    }
    response = requests.post(url, json=body, headers={'Authorization': ORS_KEY})
    data = response.json()
    return data
