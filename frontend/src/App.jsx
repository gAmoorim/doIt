import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Tarefas from './pages/Tarefas'
import './index.css'

export default function App() {
  const [autenticado, setAutenticado] = useState(false)

  useEffect(() => {
    const token = sessionStorage.getItem('token')
    if (token) setAutenticado(true)
  }, [])

  const handleLogin = (token, usuario) => {
    sessionStorage.setItem('token', token)
    sessionStorage.setItem('usuario', JSON.stringify(usuario))
    setAutenticado(true)
  }

  const handleLogout = () => {
    sessionStorage.clear()
    setAutenticado(false)
  }

  return autenticado
    ? <Tarefas onLogout={handleLogout} />
    : <Login onLogin={handleLogin} />
}