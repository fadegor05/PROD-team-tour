
def complete_meetings_handler(conn, cur):
    meetings = get_must_completed_meetings(cur)
    update_complete_meetings(conn, cur, meetings)


def update_complete_meetings(conn, cur, meetings):
    for meeting in meetings:
        meeting_id = meeting[0]
        query = f"UPDATE meeting SET status = 'completed' WHERE id = %s"
        cur.execute(query, (meeting_id, ))
    conn.commit()


def get_must_completed_meetings(cur):
    query = "SELECT id FROM meeting WHERE status = 'confirmed' AND NOW() > end_datetime"
    cur.execute(query)
    return cur.fetchall()
