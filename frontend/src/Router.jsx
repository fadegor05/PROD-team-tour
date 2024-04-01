import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'

import App from './App'
import Form from './components/Form'
import Meetings from './components/Meetings'


export default function Router() {
  const [userInfo, setUserInfo] = useState({})

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App updateUserInfo={(userInfo) => setUserInfo(userInfo)}/>}/>
        <Route path='/form' element={<Form userInfo={userInfo}/>} />
        <Route path='/meetings' element={<Meetings userInfo={userInfo}/>} />
    </Routes>
    </BrowserRouter>
  )
}
