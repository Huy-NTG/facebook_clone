import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Siderbar from './components/Siderbar'
import PostManagement from './pages/PostManagement'
import UserManagement from './pages/UserManagement'
import ReportManagement from './pages/ReportManagement'
import SystemManagement from './pages/SystemConfig'
import ActivityLog from './pages/ActivityLog'

function App() {

  return (
      <BrowserRouter>
        <div className='flex'>
            <Siderbar />
            <Routes>
            <Route path="/" element={<h1>Home</h1>} />
            <Route path="/posts" element={<PostManagement />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/reports" element={<ReportManagement />} />
            <Route path="/systems" element={<SystemManagement />} />
            <Route path="/activities" element={<ActivityLog />} />
            <Route path="*" element={<h1>404</h1>} />
            </Routes>
        </div>
      </BrowserRouter>
  )
}

export default App
