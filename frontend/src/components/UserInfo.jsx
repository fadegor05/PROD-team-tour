import styles from './UserInfo.module.css'

export default function UserInfo({ info }) {
  return (
    <div className={styles.box}>
      <h3 className={styles.text}>{info.fullname}</h3>
      <p className={styles.text}>{`${info.organization_type} "${info.organization}"`}</p>
    </div>
  )
}
