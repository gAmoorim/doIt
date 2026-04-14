import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Tarefas from './pages/Tarefas'
import './index.css'

export default function App() {
  const [autenticado, setAutenticado] = useState(false)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const verificarSessao = async () => {
      try {
        const dados = await window.tokenStore.carregar()
        if (dados?.token) {
          sessionStorage.setItem('token', dados.token)
          sessionStorage.setItem('usuario', JSON.stringify(dados.usuario))
          setAutenticado(true)
        }
      } catch {
        // sem sessão salva
      }
      setCarregando(false)
    }
    verificarSessao()
  }, [])

  const handleLogin = async (token, usuario) => {
    sessionStorage.setItem('token', token)
    sessionStorage.setItem('usuario', JSON.stringify(usuario))
    await window.tokenStore.salvar(token, usuario)
    setAutenticado(true)
  }

  const handleLogout = async () => {
    sessionStorage.clear()
    await window.tokenStore.limpar()
    setAutenticado(false)
  }

  if (carregando) return null

  return autenticado
    ? <Tarefas onLogout={handleLogout} />
    : <Login onLogin={handleLogin} />
}