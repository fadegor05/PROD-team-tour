from easyschedule import EasyScheduler

from app.api.router import api_router
from app.core.utils import db_fill
from app.database import db_init

scheduler = EasyScheduler()


@scheduler(schedule='15 * * * *')
async def main_schedule():
    ...


@api_router.on_event('startup')
async def on_startup_db_init():
    await db_init()
    await db_fill()
    await scheduler.start()
