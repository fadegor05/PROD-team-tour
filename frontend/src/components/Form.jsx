import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './Form.module.css'
import UserInfo from './UserInfo.jsx'

export default function Form() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('new')

  return (
    <>
    <UserInfo />
    <div className={styles.card}>

      {status == 'new' &&
      <>
      <h2 className={styles.title}>Назначить встречу</h2>
      <h3 className={styles.subtitle}>Дата</h3>
      <input type="date" className={styles.dateinput}/>
      <h3 className={styles.subtitle}>Место</h3>
      <input type="text" placeholder="Место встречи" className={styles.textinput}/>
      <button className={styles.confirmbutton} onClick={() => setStatus('selectTime')}>Выбрать</button>
      </>
      }

      {status == 'selectTime' &&
      <>
      <h2 className={styles.title}>Выберите время</h2>
      <div className={styles.listitem}>
        <div className={styles.timeblock}><p className={styles.infofield}>10:00-11:00</p></div>
        <button className={styles.selectbutton} onClick={() => setStatus('confirm')}>Выбрать</button>
      </div>
      <div className={styles.listitem}>
        <div className={styles.timeblock}><p className={styles.infofield}>11:00-12:00</p></div>
        <button className={styles.selectbutton} onClick={() => setStatus('confirm')}>Выбрать</button>
      </div>
      </>
      }

      {status == 'confirm' &&
      <>
      <h2 className={styles.title}>Подтверждение</h2>
      <h3 className={styles.subtitle}>Время и место</h3>
      <div className={styles.infobox}>
        <p className={styles.infofield}>5 апреля, 14:00</p>
        <p className={styles.infofield}>Ул. Московская д. 5 оф. 4</p>
      </div>
      <h3 className={styles.subtitle}>Представитель</h3>
      <div className={styles.infobox}>
        <p className={styles.infofield}>Зубенко Михаил Петрович</p>
        <p className={styles.infofield}>+794356275782</p>
      </div>
      <h3 className={styles.subtitle}>Пакет документов</h3>
      <div className={styles.infobox}>
        <p className={styles.infofield}>Паспорт</p>
        <p className={styles.infofield}>Регистрация юр. лица</p>
      </div>
      <button className={styles.confirmbutton} onClick={() => {setStatus('new'); navigate('/meetings')}}>Подтвердить</button>
      </>
      }

    </div>
    </>
  )
}
