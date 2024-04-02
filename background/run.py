import psycopg2

from config import POSTGRES_URL
from services.meetings import complete_meetings_handler


def main():
    conn = psycopg2.connect(POSTGRES_URL)
    cur = conn.cursor()

    complete_meetings_handler(conn, cur)

    cur.close()
    conn.close()

if __name__ == '__main__':
    main()