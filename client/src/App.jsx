import './App.css'
import Login from './components/Login'
import Signup from './components/Signup'
import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './components/Dashboard'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<Navigate to="/signup" replace />} />
      <Route path='/dashboard' element={<Dashboard />} />
    </Routes>
  )
}

export default App
