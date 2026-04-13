import { useState } from 'react'
import { loginApi, cadastrarApi } from '../services/api'
import styles from './Login.module.css'

export default function Login({ onLogin }) {
  const [aba, setAba] = useState('login')
  const [form, setForm] = useState({ nome: '', email: '', senha: '' })
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [loading, setLoading] = useState(false)

  const atualizar = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const fazerLogin = async () => {
    setErro(''); setLoading(true)
    try {
      const res = await loginApi(form.email, form.senha)
      if (res.token) {
        onLogin(res.token, res.usuario)
      } else {
        setErro(res.mensagem || 'Erro ao fazer login')
      }
    } catch {
      setErro('Erro de conexão com o servidor')
    }
    setLoading(false)
  }

  const fazerCadastro = async () => {
    setErro(''); setSucesso(''); setLoading(true)
    try {
      const res = await cadastrarApi(form.nome, form.email, form.senha)
      if (res.mensagem === 'Usuário cadastrado com sucesso') {
        setSucesso('Conta criada! Faça login.')
        setAba('login')
        setForm({ nome: '', email: '', senha: '' })
      } else {
        setErro(res.mensagem || 'Erro ao cadastrar')
      }
    } catch {
      setErro('Erro de conexão com o servidor')
    }
    setLoading(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.leftContent}>
          <h1 className={styles.brand}>do<span>it</span></h1>
          <p className={styles.tagline}>Organize suas tarefas.<br />Foque no que importa.</p>
          <div className={styles.decoration}>
            <div className={styles.circle1} />
            <div className={styles.circle2} />
            <div className={styles.circle3} />
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.card}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${aba === 'login' ? styles.tabAtivo : ''}`}
              onClick={() => { setAba('login'); setErro(''); setSucesso('') }}
            >Entrar</button>
            <button
              className={`${styles.tab} ${aba === 'cadastro' ? styles.tabAtivo : ''}`}
              onClick={() => { setAba('cadastro'); setErro(''); setSucesso('') }}
            >Criar conta</button>
          </div>

          {aba === 'login' ? (
            <div className={styles.form}>
              <div className={styles.formGroup}>
                <label>E-mail</label>
                <input name="email" type="email" placeholder="seu@email.com" value={form.email} onChange={atualizar} />
              </div>
              <div className={styles.formGroup}>
                <label>Senha</label>
                <input name="senha" type="password" placeholder="••••••••" value={form.senha} onChange={atualizar}
                  onKeyDown={e => e.key === 'Enter' && fazerLogin()} />
              </div>
              {erro && <p className={styles.erro}>{erro}</p>}
              {sucesso && <p className={styles.sucesso}>{sucesso}</p>}
              <button className={styles.btnPrimary} onClick={fazerLogin} disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </div>
          ) : (
            <div className={styles.form}>
              <div className={styles.formGroup}>
                <label>Nome</label>
                <input name="nome" type="text" placeholder="Seu nome" value={form.nome} onChange={atualizar} />
              </div>
              <div className={styles.formGroup}>
                <label>E-mail</label>
                <input name="email" type="email" placeholder="seu@email.com" value={form.email} onChange={atualizar} />
              </div>
              <div className={styles.formGroup}>
                <label>Senha</label>
                <input name="senha" type="password" placeholder="Mín. 5 caracteres" value={form.senha} onChange={atualizar}
                  onKeyDown={e => e.key === 'Enter' && fazerCadastro()} />
              </div>
              {erro && <p className={styles.erro}>{erro}</p>}
              <button className={styles.btnPrimary} onClick={fazerCadastro} disabled={loading}>
                {loading ? 'Criando...' : 'Criar conta'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}