import time

import psycopg2

from config import POSTGRES_URL, TIME
from services.meetings import complete_meetings_handler
from services.notifications import notify_users_handler


def main():
    while True:
        conn = psycopg2.connect(POSTGRES_URL)
        cur = conn.cursor()
        complete_meetings_handler(conn, cur)
        notify_users_handler(conn, cur)

        cur.close()
        conn.close()
        time.sleep(TIME)


if __name__ == '__main__':
    main()