const BASE = 'http://localhost:3100'

const getToken = () => sessionStorage.getItem('token')

const headers = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
})

// AUTH
export const loginApi = async (email, senha) => {
  const res = await fetch(`${BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha })
  })
  return res.json()
}

export const cadastrarApi = async (nome, email, senha) => {
  const res = await fetch(`${BASE}/cadastro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email, senha })
  })
  return res.json()
}

// TAREFAS
export const listarTarefasApi = async () => {
  const res = await fetch(`${BASE}/tarefas`, { headers: headers() })
  return res.json()
}

export const criarTarefaApi = async (dados) => {
  const res = await fetch(`${BASE}/tarefa`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(dados)
  })
  return res.json()
}

export const atualizarTarefaApi = async (id, dados) => {
  const res = await fetch(`${BASE}/tarefas/${id}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(dados)
  })
  return res.json()
}

export const deletarTarefaApi = async (id) => {
  const res = await fetch(`${BASE}/tarefas/${id}`, {
    method: 'DELETE',
    headers: headers()
  })
  return res.json()
}

export const filtrarTarefasApi = async (params) => {
  const query = new URLSearchParams(params).toString()
  const res = await fetch(`${BASE}/tarefas/filtro?${query}`, { headers: headers() })
  return res.json()
}