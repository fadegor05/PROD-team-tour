import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import LoadingGif from './components/LoadingGif'

export default function App({ updateUserInfo, updatePhone }) {
  const navigate = useNavigate()
  const [login, setLogin] = useState()

  function getLogin() {
    if (!localStorage.getItem('phone')) {
      fetch('/api/create_user')
        .then(response => {
          if (response.ok) {
            return response.json()
          }
          throw response
        })
        .then(info => {
          setLogin(info.phone)
          localStorage.setItem('phone', info.phone)
        })
        .catch(error => console.log(error))
    } else {
      setLogin(localStorage.getItem('phone'))
    }
  }

  function auth() {
    if (login) {
      fetch(`/api/user?phone=${encodeURIComponent(login)}`)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw response
      })
      .then(info => {
        updateUserInfo(info)
        updatePhone(login)
        if (info.meetings.filter(el => el.status == 'confirmed').length == 0) {
          navigate('/form')
        } else {
          navigate('/meetings')
        }
      })
      .catch(error => console.error(error))
    }
  }

  useEffect(getLogin, [])
  useEffect(auth, [login])
  return (
    <>
    <h1>MeetSync</h1>
    <LoadingGif />
    </>
  )
}
