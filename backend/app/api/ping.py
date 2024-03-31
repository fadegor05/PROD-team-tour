from app.api.router import api_router


@api_router.get('/ping')
async def ping():
    return {'hello': 'world'}
