import { useNavigate } from 'react-router-dom'

import styles from './Meetings.module.css'
import UserInfo from './UserInfo.jsx'

export default function Meetings({ userInfo, updateCurrentMeeting }) {
  const navigate = useNavigate()
  
  function formatDate(date) {
    let newDate = new Date(date)
    newDate = new Intl.DateTimeFormat('ru-RU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: 'numeric',
      minute: 'numeric',
      timeZone: 'UTC'
    }).format(newDate)
    return newDate[0].toUpperCase() + newDate.slice(1)
  }

  function moveMeeting(id, meeting) {
    fetch('http://localhost:8000/api/meeting', {
      method: 'PATCH',
      body: JSON.stringify({
        meeting_id: id,
        status: 'canceled'
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then(response => response.json())
      .then(info => {
        if (info.status_code == 200) {
          updateCurrentMeeting(meeting)
          navigate('/form')
        } else {
          alert(info.detail)
        }
      })
      .catch(err => console.log(err))
  }

  function cancelMeeting(id) {
    fetch('http://localhost:8000/api/meeting', {
      method: 'PATCH',
      body: JSON.stringify({
        meeting_id: id,
        status: 'canceled'
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then(response => response.json())
      .then(info => {
        if (info.status_code == 200) {
          navigate('/')
        } else {
          alert(info.detail)
        }
      })
      .catch(err => console.log(err))
  }

  return (
    <>
    <UserInfo info={userInfo} />
    <div className={styles.card}>
      <h2 className={styles.title}>Ваши встречи</h2>
      <div className={styles.cardslist}>
        {
          userInfo.meetings.filter(el => el.status == 'confirmed').map(el => 
            <div className={styles.meetingcard} key={el.meeting_id}>
              <h3 className={styles.subtitle}>Время и место</h3>
              <div className={styles.infobox}>
                <p className={styles.infofield}>{formatDate(el.start_datetime)}</p>
                <p className={styles.infofield}>{el.place}</p>
              </div>
              <h3 className={styles.subtitle}>Представитель</h3>
              <div className={styles.infobox}>
                <p className={styles.infofield}>{el.agent_fullname}</p>
                <p className={styles.infofield}>{el.agent_phone}</p>
              </div>
              <h3 className={styles.subtitle}>Пакет документов</h3>
              <div className={styles.infobox}>
                <p className={styles.infofield}>Паспорт</p>
                <p className={styles.infofield}>Регистрация юр. лица</p>
              </div>
              <div className={styles.inputbox}>
                <button className={`${styles.button} ${styles.movebutton}`} 
                  onClick={() => moveMeeting(el.meeting_id, el)}>Перенести</button>
                <button className={`${styles.button} ${styles.cancelbutton}`} 
                  onClick={() => cancelMeeting(el.meeting_id)}>Отменить</button>
              </div>
            </div>  
          )
        }
      </div>
      <div className={styles.footer}>
        <button className={`${styles.button} ${styles.newbutton}`} onClick={() => navigate('/form')}>Назначить новую встречу</button>
      </div>
    </div>
    </>
  )
}
