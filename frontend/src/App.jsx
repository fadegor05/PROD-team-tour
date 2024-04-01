import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const TEST_PHONE_NUMBER = '+79527774242'

export default function App() {
  const navigate = useNavigate()
  const [login, setLogin] = useState(TEST_PHONE_NUMBER)

  function auth() {
    if (login == TEST_PHONE_NUMBER) { 
      navigate('/form')
    }
  }

  useEffect(auth, [login])
  return (
    <>
    <h1>MeetSync</h1>
    <p>Authenticating...</p>
    </>
  )
}
