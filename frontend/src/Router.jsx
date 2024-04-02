import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'

import App from './App'
import Form from './components/Form'
import Meetings from './components/Meetings'


export default function Router() {
  const [userInfo, setUserInfo] = useState({})
  const [currentMeeting, setCurrentMeeting] = useState('')
  const [phone, setPhone] = useState()

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App updateUserInfo={(userInfo) => setUserInfo(userInfo)} updatePhone={(phone) => setPhone(phone)}/>}/>
        <Route path='/form' element={<Form userInfo={userInfo} currentMeeting={currentMeeting} updateCurrentMeeting={(meeting) => setCurrentMeeting(meeting)} phone={phone}/>}/>
        <Route path='/meetings' element={<Meetings userInfo={userInfo} updateCurrentMeeting={(meeting) => setCurrentMeeting(meeting)}/>}/>
    </Routes>
    </BrowserRouter>
  )
}
