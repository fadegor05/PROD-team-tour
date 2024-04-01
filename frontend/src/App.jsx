import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const TEST_PHONE_NUMBER = '+72690300082'

export default function App({ updateUserInfo }) {
  const navigate = useNavigate()
  const [login, setLogin] = useState(TEST_PHONE_NUMBER)

  function auth() {
    fetch(`http://localhost:8000/api/user?phone=${encodeURIComponent(TEST_PHONE_NUMBER)}`)
      .then(response => response.json())
      .then(info => {
        updateUserInfo(info)
        if (info.meetings.filter(el => el.status == 'confirmed').length == 0) {
          navigate('/form')
        } else {
          navigate('/meetings')
        }
      })
  }

  useEffect(auth, [login])
  return (
    <>
    <h1>MeetSync</h1>
    <p>Authenticating...</p>
    </>
  )
}
