import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './Form.module.css'
import UserInfo from './UserInfo.jsx'

export default function Form({ userInfo, currentMeeting, updateCurrentMeeting, phone }) {
  const navigate = useNavigate()
  const [status, setStatus] = useState('new')
  const [timesList, setTimeslist] = useState([])
  const [date, setDate] = useState(currentMeeting.start_datetime ? currentMeeting.start_datetime : '')
  const [place, setPlace] = useState(currentMeeting.place ? currentMeeting.place : '')
  const [time, setTime] = useState()
  const [docsList, setDocsList] = useState([])

  function timeIntervalFormat(date) {
    let newTime = new Date(date)
    let startTime = new Intl.DateTimeFormat('ru-RU', {
      hour: 'numeric',
      minute: 'numeric'
    }).format(newTime)
    let endTime = newTime.setHours(newTime.getHours() + 1)
    endTime = new Intl.DateTimeFormat('ru-RU', {
      hour: 'numeric',
      minute: 'numeric'
    }).format(endTime)
    newTime = `${startTime} - ${endTime}`
    return newTime
  }

  function formatMeetDate(date) {
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

  function handleFirstConfirm() {
    fetch('/api/available_time', {
      method: 'POST',
      body: JSON.stringify({
        place: place,
        date: new Date(date).toISOString()
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then(response => {
        if (!response.ok) {
          alert(JSON.stringify(response))
        } else {
          return response.json()
        }
      })
      .then(info => {
        setTimeslist(info)
        setStatus('selectTime')
        })
      .catch(err => console.log(err))
  }

  function handleSecondConfirm(meetTime) {
    setStatus('confirm')
    setTime(meetTime)
    fetch(`/api/documents?org_type=${encodeURIComponent(userInfo.organization_type)}`)
      .then(response => response.json())
      .then(info => {
        setDocsList(info.documents)
      })
  }

  function handleFinalConfirm() {
    fetch('/api/meeting', {
      method: 'POST',
      body: JSON.stringify({
        place: place,
        start_datetime: time,
        phone: phone
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then(response => {
        if (!response.ok) {
          alert(response)
        } else {
          return response.json()
        }
      })
      .then(info => {
        if (currentMeeting != '') {
           fetch('/api/meeting', {
            method: 'PATCH',
              body: JSON.stringify({
              meeting_id: currentMeeting.meeting_id,
              status: 'canceled'
            }),
            headers: {
              'Content-type': 'application/json; charset=UTF-8'
            }
          })
            .then(response => response.json())
            .then(info => {
              if (info.status_code == 200) {
                null
              } else {
                alert(info.detail)
              }
            })
            .catch(err => console.log(err))
            updateCurrentMeeting('')
        }
        setTimeout(() => {
          navigate('/')
        }, 250);
      })
  }
  
  return (
    <>
    <UserInfo info={userInfo} />
    <div className={styles.card}>

      {status == 'new' &&
      <>
      <h2 className={styles.title}>Назначить встречу</h2>
      <h3 className={styles.subtitle}>Дата</h3>
      <input type="date" className={styles.dateinput} value={date !== '' ? new Date(date).toISOString().split('T')[0] : ''} onChange={(e) => setDate(e.target.value)}/>
      <h3 className={styles.subtitle}>Место</h3>
      <input type="text" placeholder="Место встречи" className={styles.textinput} value={place} onChange={(e) => setPlace(e.target.value)}/>
      <div className={styles.inputbox}>
        <button className={styles.confirmbutton} onClick={() => {date && place ? handleFirstConfirm() : null}}>Выбрать</button>
        {
          userInfo.meetings.filter(el => el.status == 'confirmed').length !== 0 ? 
          <button className={styles.confirmbutton} onClick={() => navigate('/')}>Назад</button>
          : null
        }
      </div>
      </>
      }

      {status == 'selectTime' &&
      <>
      <h2 className={styles.title}>Выберите время</h2>
      <div className={styles.list}>
      {
        timesList.map(el => 
          <div className={styles.listitem} onClick={() => handleSecondConfirm(el.start_datetime)} key={el.start_datetime}>
            <div className={styles.timeblock}>{timeIntervalFormat(el.start_datetime)}</div>
          </div>
          )
      }
      </div>
      <button className={styles.confirmbutton} onClick={() => setStatus('new')}>Назад</button>
      </>
      }

      {status == 'confirm' &&
      <>
      <h2 className={styles.title}>Подтверждение</h2>
      <h3 className={styles.subtitle}>Время и место</h3>
      <div className={styles.infobox}>
        <p className={styles.infofield}>{formatMeetDate(time)}</p>
        <p className={styles.infofield}>{place}</p>
      </div>
      <h3 className={styles.subtitle}>Пакет документов</h3>
      <div className={styles.infobox}>
        {
          docsList.map(el => 
            <p className={styles.infofield} key={el}>{el}</p>  
          )
        }
      </div>
      <div className={styles.inputbox}>
        <button className={styles.confirmbutton} onClick={() => handleFinalConfirm()}>Подтвердить</button>
        <button className={styles.confirmbutton} onClick={() => setStatus('selectTime')}>Назад</button>
      </div>
      </>
      }

    </div>
    </>
  )
}
