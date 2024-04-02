import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import LoadingGif from './components/LoadingGif'

const TEST_PHONE_NUMBER = '+79527774242'

export default function App({ updateUserInfo, updatePhone }) {
  const navigate = useNavigate()
  const [login, setLogin] = useState(TEST_PHONE_NUMBER)

  function auth() {
    fetch(`/api/user?phone=${encodeURIComponent(TEST_PHONE_NUMBER)}`)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw response
      })
      .then(info => {
        updateUserInfo(info)
        updatePhone(TEST_PHONE_NUMBER)
        if (info.meetings.filter(el => el.status == 'confirmed').length == 0) {
          navigate('/form')
        } else {
          navigate('/meetings')
        }
      })
      .catch(error => console.error(error))
  }

  useEffect(auth, [login])
  return (
    <>
    <h1>MeetSync</h1>
    <LoadingGif />
    </>
  )
}
