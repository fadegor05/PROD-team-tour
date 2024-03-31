from app.api.router import api_router
from app.database import db_init


@api_router.on_event('startup')
async def on_startup_db_init():
    await db_init()
