import asyncio
import asyncpg

from config import POSTGRES_URL


async def main():
    conn = await asyncpg.connect(POSTGRES_URL)
    




if __name__ == '__main__':
    asyncio.get_event_loop().run_until_complete(main())