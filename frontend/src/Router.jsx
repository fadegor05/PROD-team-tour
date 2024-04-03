import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import App from './App'
import Form from './components/Form'
import Meetings from './components/Meetings'
import ErrorHandle from './ErrorHandle'


export default function Router() {
  const [userInfo, setUserInfo] = useState({})
  const [currentMeeting, setCurrentMeeting] = useState('')
  const [phone, setPhone] = useState()

  return (
    <ErrorBoundary FallbackComponent={ErrorHandle}>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App updateUserInfo={(userInfo) => setUserInfo(userInfo)} updatePhone={(phone) => setPhone(phone)}/>}/>
        <Route path='/form' element={<Form userInfo={userInfo} currentMeeting={currentMeeting} updateCurrentMeeting={(meeting) => setCurrentMeeting(meeting)} phone={phone}/>}/>
        <Route path='/meetings' element={<Meetings newUserInfo={userInfo} updateCurrentMeeting={(meeting) => setCurrentMeeting(meeting)} phone={phone}/>}/>
        <Route path='/*' element={<ErrorHandle />}/>
    </Routes>
    </BrowserRouter>
    </ErrorBoundary>
  )
}
