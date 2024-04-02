import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AddToCalendarButton } from 'add-to-calendar-button-react'

import styles from './Meetings.module.css'
import UserInfo from './UserInfo.jsx'
import LoadingGif from './LoadingGif.jsx'

export default function Meetings({ newUserInfo, updateCurrentMeeting, phone }) {
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState(newUserInfo)
  const [docsList, setDocsList] = useState([])
  const [isLoading, setisLoading] = useState(false)
  const [areDocumentsLoading, setAreDocumentsLoading] = useState(false)
  const [isDelayLoading, setIsDelayLoading] = useState(false)
  
  function updateUserInfo() {
    fetch(`/api/user?phone=${encodeURIComponent(phone)}`)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw response
      })
      .then(info => {
        setUserInfo(info)
      })
      .catch(error => console.error(error))
  }

  function formatDate(date, delay) {
    let newDate = new Date(date)
    if (delay != 0) {
      newDate = new Date(newDate.setMinutes(newDate.getMinutes() + delay))
    }
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

  function isToday(el) {
    if (new Date().getDate() == new Date(el.start_datetime).getDate()
    &&
    new Date().getMonth() == new Date(el.start_datetime).getMonth()
    &&
    new Date().getFullYear() == new Date(el.start_datetime).getFullYear()) {
      return true
    }
    return false
  }

  function moveMeeting(meeting) {
    updateCurrentMeeting(meeting)
    navigate('/form')
  }

  function cancelMeeting(id, el) {
    if (confirm(`${formatDate(el.start_datetime, el.delay_status)}\n${el.place}\nОтменить встречу?`)) {
      setisLoading(true)
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
        setisLoading(false)
      })
      .catch(err => console.error(err))
    }
  }

  function handleDelay(delay_time, id) {
    setIsDelayLoading(true)
    fetch('/api/meeting_delay', {
      method: 'PATCH',
      body: JSON.stringify({
        meeting_id: id,
        delay_status: delay_time
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
        updateUserInfo()
        setIsDelayLoading(false)
      })
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
          userInfo.meetings
            .filter(el => el.status == 'confirmed')
            .sort((a, b) => new Date(a.start_datetime) - new Date(b.start_datetime))
            .map(el => 
            <div className={styles.meetingcard} key={el.meeting_id}>
              <div className={styles.calendarbutton}>
              <AddToCalendarButton
                    className={styles.calendarbutton}
                    name="Встреча с представителем банка"
                    startDate={new Date(el.start_datetime).toISOString().split('T')[0]}
                    startTime={new Intl.DateTimeFormat('ru-RU', {hour: '2-digit', minute: '2-digit'}).format(new Date(el.start_datetime))}
                    endTime={new Intl.DateTimeFormat('ru-RU', {hour: '2-digit', minute: '2-digit'}).format(new Date(new Date(el.start_datetime).setHours(new Date(el.start_datetime).getHours() + 1)))}
                    location={el.place}
                    listStyle='modal'
                    options="'Apple','Google','iCal','Outlook.com','Yahoo','MicrosoftTeams','Microsoft365'"
                    buttonStyle="round"
                    hideTextLabelButton/>
              </div>
              <h3 className={styles.subtitle}>Время и место</h3>
              <div className={styles.infobox}>
                <p className={styles.infofield} style={isToday(el) ? {color: '#2ecc71', fontWeight: 'bold'} : {}}>{formatDate(el.start_datetime, el.delay_status)}</p>
                <p className={styles.infofield}>{el.place}</p>
              </div>
              {isDelayLoading ? <LoadingGif />
              :
              <>
              {isToday(el)
              ?
              <div className={styles.delayblock}>
                {el.delay_status == 0 &&
                <>
                <h3 className={styles.subtitle} style={{color: '#2ecc71'}}>Опоздаю на:</h3>
                <div className={styles.inputbox}>
                  <button className={`${styles.delaybutton15} ${styles.delaybutton}`} onClick={() => handleDelay(15, el.meeting_id)}>15 минут</button>
                  <button className={`${styles.delaybutton30} ${styles.delaybutton}`} onClick={() => handleDelay(30, el.meeting_id)}>30 минут</button>
                </div>
                </>
                }
                {el.delay_status == 15 &&
                <>
                <h3 className={styles.subtitle} style={{color: '#2ecc71'}}>Опоздаю на:</h3>
                <div className={styles.inputbox}>
                  <button className={`${styles.delaybutton30} ${styles.delaybutton}`} onClick={() => handleDelay(30, el.meeting_id)}>30 минут</button>
                </div>
                </>
                }
                {el.delay_status == 30 &&
                <>
                </>
                }
              </div>
              :
              null
              }
              </>
              }
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
