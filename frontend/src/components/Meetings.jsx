import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './Meetings.module.css'
import UserInfo from './UserInfo.jsx'
import LoadingGif from './LoadingGif.jsx'

export default function Meetings({ userInfo, updateCurrentMeeting }) {
  const navigate = useNavigate()
  const [docsList, setDocsList] = useState([])
  const [isLoading, setisLoading] = useState(false)
  const [areDocumentsLoading, setAreDocumentsLoading] = useState(false)
  
  function formatDate(date) {
    let newDate = new Date(date)
    newDate = new Intl.DateTimeFormat('ru-RU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: 'numeric',
      minute: 'numeric'
    }).format(newDate)
    return newDate[0].toUpperCase() + newDate.slice(1)
  }

  function getDocsInfo() {
    setAreDocumentsLoading(true)
    fetch(`/api/documents?org_type=${encodeURIComponent(userInfo.organization_type)}`)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw response
      })
      .then(info => {
        setDocsList(info.documents)
        setAreDocumentsLoading(false)
      })
      .catch(error => console.error(error))
  }

  function moveMeeting(meeting) {
    updateCurrentMeeting(meeting)
    navigate('/form')
  }

  function cancelMeeting(id, el) {
    setisLoading(true)
    if (confirm(`${formatDate(el.start_datetime)}\n${el.place}\nОтменить встречу?`)) {
      fetch('/api/meeting', {
      method: 'PATCH',
      body: JSON.stringify({
        meeting_id: id,
        status: 'canceled'
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw response
      })
      .then(info => {
        if (info.status_code == 200) {
          navigate('/')
        } else {
          console.log(info.detail)
        }
      })
      .catch(err => console.error(err))
      .finally(() => setisLoading(false))
    }
  }

  
  useEffect(getDocsInfo, [])
  useEffect(() => updateCurrentMeeting(''),[])
  return (
    <>
    <UserInfo info={userInfo} />
    {isLoading ? <LoadingGif />
    :
    <>
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
                <img src={el.agent_image} alt="Фото" className={styles.agentpicture}/>
                <p className={styles.infofield}>{el.agent_fullname}</p>
                <p className={styles.infofield}>{el.agent_phone}</p>
              </div>
              <h3 className={styles.subtitle}>Пакет документов</h3>
              {areDocumentsLoading ? <LoadingGif />
              :
              <div className={styles.infobox}>
                {
                  docsList.map(el =>
                    <p className={styles.infofield} key={el}>{el}</p>
                  )
                }
              </div>
              }
              <div className={styles.inputbox}>
                <button className={`${styles.button} ${styles.movebutton}`} 
                  onClick={() => moveMeeting(el)}>Перенести</button>
                <button className={`${styles.button} ${styles.cancelbutton}`} 
                  onClick={() => cancelMeeting(el.meeting_id, el)}>Отменить</button>
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
    }
    </>
  )
}
