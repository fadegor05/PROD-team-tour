

def notify_users_handler(conn, cur):
    #meetings = get_unnotified_meetings()
    ...


def get_unnotified_meetings(cur):
    query = """
    SELECT * 
    FROM meeting WHERE meeting.start_datetime - NOW() < INTERVAL '24 hours' AND 
    status = 'confirmed' AND is_notified = false
    """
    cur.execute(query)
    return cur.fetchall()