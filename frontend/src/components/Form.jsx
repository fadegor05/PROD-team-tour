import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './Form.module.css'
import UserInfo from './UserInfo.jsx'

export default function Form({ userInfo, currentMeeting, updateCurrentMeeting, phone }) {
  const navigate = useNavigate()
  const [status, setStatus] = useState('new')
  const [timesList, setTimeslist] = useState()
  const [date, setDate] = useState()
  const [place, setPlace] = useState()
  const [time, setTime] = useState()

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
    fetch('http://localhost:8000/api/available_time', {
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
          alert(response)
        } else {
          return response.json()
        }
      })
      .then(info => {
        setTimeslist(info)
        setStatus('selectTime')
        updateCurrentMeeting({})
        })
      .catch(err => console.log(err))
  }

  function handleSecondConfirm(meetTime) {
    setStatus('confirm')
    setTime(meetTime)
  }

  function handleFinalConfirm() {
    fetch('http://localhost:8000/api/meeting', {
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
        console.log(info)
        navigate('/meetings')
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
      <input type="date" className={styles.dateinput} onChange={(e) => setDate(e.target.value)}/>
      <h3 className={styles.subtitle}>Место</h3>
      <input type="text" placeholder="Место встречи" className={styles.textinput} value={currentMeeting.place} onChange={(e) => setPlace(e.target.value)}/>
      <button className={styles.confirmbutton} onClick={() => handleFirstConfirm()}>Выбрать</button>
      </>
      }

      {status == 'selectTime' &&
      <>
      <h2 className={styles.title}>Выберите время</h2>
      {
        timesList.map(el => 
          <div className={styles.listitem} key={el.start_datetime}>
            <div className={styles.timeblock}><p className={styles.infofield}>{timeIntervalFormat(el.start_datetime)}</p></div>
            <button className={styles.selectbutton} onClick={() => handleSecondConfirm(el.start_datetime)}>Выбрать</button>
          </div>
          )
      }
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
        <p className={styles.infofield}>Паспорт</p>
        <p className={styles.infofield}>Регистрация юр. лица</p>
      </div>
      <button className={styles.confirmbutton} onClick={() => handleFinalConfirm()}>Подтвердить</button>
      </>
      }

    </div>
    </>
  )
}
