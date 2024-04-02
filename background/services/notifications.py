import datetime
import requests

SMS_KEY = 'xpaul6@gmail.com:38RApr1UuYnQmnm-fTt7Vf28q-EUPTgH'


def send_notification(user_phone: str, start_datetime: datetime.datetime, agent_name: str, agent_phone: str):
    url = f"https://{SMS_KEY}@gate.smsaero.ru/v2/sms/send"
    date = start_datetime.strftime("%d.%m.%Y")
    time = start_datetime.strftime("%H:%M")

    user_phone = '+79966251916'
    text = f'Напоминаем, что у Вас назначена встреча с представителем банка завтра, {date} в {time}. ' \
           f'Контакты представителя: {agent_name}, {agent_phone.replace("+", "%2B")}'
    payload = {"number": user_phone.replace('+', ''), "text": text, "sign": "SMS Aero"}

    r = requests.get(url=url, params=payload)
    return r.json()['success']


def update_meeting_to_notified(conn, cur, meeting_id):
    query = f"UPDATE meeting SET is_notified=true WHERE id={meeting_id}"
    cur.execute(query)
    conn.commit()


def notify_users_handler(conn, cur):
    meetings = get_unnotified_meetings(cur)
    for meeting in meetings:
        success = send_notification(user_phone=meeting[0], start_datetime=meeting[1], agent_name=meeting[2],
                                    agent_phone=meeting[3])
        if success:
            update_meeting_to_notified(conn, cur, meeting[4])


def get_unnotified_meetings(cur):
    query = """
    SELECT "user".phone, meeting.start_datetime, agent.fullname, agent.phone, meeting.id
    FROM meeting
    INNER JOIN "user" ON meeting.user_id = "user".id
    INNER JOIN agent ON meeting.agent_id = agent.id 
    WHERE meeting.status = 'confirmed' AND meeting.is_notified = false 
    AND meeting.start_datetime - NOW() < INTERVAL '24 hours'
    """
    cur.execute(query)
    return cur.fetchall()
