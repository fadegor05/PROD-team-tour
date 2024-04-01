import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import App from './App.jsx'
import Form from './components/Form.jsx'
import Meetings from './components/Meetings.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}/>
        <Route path='/form' element={<Form />} />
        <Route path='/meetings' element={<Meetings />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
