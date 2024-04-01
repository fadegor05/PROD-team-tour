import { useNavigate } from 'react-router-dom'

import styles from './Meetings.module.css'
import UserInfo from './UserInfo.jsx'

export default function Meetings({ userInfo }) {
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

  return (
    <>
    <UserInfo info={userInfo} />
    <div className={styles.card}>
      <h2 className={styles.title}>Ваши встречи</h2>
      <div className={styles.cardslist}>
        {
          userInfo.meetings.map(el => 
            <div className={styles.meetingcard} key={Date.now()}>
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
                <button className={`${styles.button} ${styles.movebutton}`}>Перенести</button>
                <button className={`${styles.button} ${styles.cancelbutton}`}>Отменить</button>
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
