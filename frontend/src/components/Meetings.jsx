import React from 'react'

import styles from './Meetings.module.css'

export default function Meetings() {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Ваши встречи</h2>
      <div className={styles.cardslist}>
        <div className={styles.meetingcard}>
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
          <div className={styles.inputbox}>
            <button className={`${styles.button} ${styles.movebutton}`}>Перенести</button>
            <button className={`${styles.button} ${styles.cancelbutton}`}>Отменить</button>
          </div>
        </div>
        <div className={styles.meetingcard}>
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
          <div className={styles.inputbox}>
            <button className={`${styles.button} ${styles.movebutton}`}>Перенести</button>
            <button className={`${styles.button} ${styles.cancelbutton}`}>Отменить</button>
          </div>
        </div>
        <div className={styles.meetingcard}>
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
          <div className={styles.inputbox}>
            <button className={`${styles.button} ${styles.movebutton}`}>Перенести</button>
            <button className={`${styles.button} ${styles.cancelbutton}`}>Отменить</button>
          </div>
        </div>
      </div>
    </div>
  )
}
