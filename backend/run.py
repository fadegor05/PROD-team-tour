import uvicorn
from app.core.server import Server
from fastapi import FastAPI
from app.database import db_init
import asyncio

async def main() -> None:
    await db_init()

if __name__ == '__main__':
    asyncio.run(main())
    app = FastAPI()
    uvicorn.run(Server(app).get_app(), host='0.0.0.0', port=8000)