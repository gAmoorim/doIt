import { useState } from 'react'
import { atualizarUsuarioApi, deletarUsuarioApi } from '../services/api'
import styles from './ModalConta.module.css'

export default function ModalConta({ aberto, usuario, onFechar, onContaAtualizada, onContaDeletada }) {
  const [nome, setNome] = useState(usuario?.nome || '')
  const [email, setEmail] = useState(usuario?.email || '')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [confirmarDelete, setConfirmarDelete] = useState(false)

  if (!aberto) return null

  const salvar = async () => {
    setErro(''); setSucesso('')

    if (!nome.trim() || !email.trim()) {
      setErro('Nome e e-mail são obrigatórios')
      return
    }

    if (senha && senha.length < 6) {
      setErro('A senha deve ter no mínimo 6 caracteres')
      return
    }

    setSalvando(true)
    const dados = { nome, email }
    if (senha) dados.senha = senha

    const res = await atualizarUsuarioApi(dados)

    if (res.mensagem === 'Usuario atualizado com sucesso') {
      setSucesso('Conta atualizada com sucesso!')
      setSenha('')
      onContaAtualizada({ nome, email })
    } else {
      setErro(res.mensagem || 'Erro ao atualizar conta')
    }
    setSalvando(false)
  }

  const deletar = async () => {
    await deletarUsuarioApi()
    onContaDeletada()
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onFechar()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>Minha conta</h3>
          <button className={styles.btnFechar} onClick={onFechar}>✕</button>
        </div>

        <div className={styles.body}>
          <div className={styles.formGroup}>
            <label>Nome</label>
            <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Seu nome" />
          </div>

          <div className={styles.formGroup}>
            <label>E-mail</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" />
          </div>

          <div className={styles.formGroup}>
            <label>Nova senha <span>(deixe em branco para manter a atual)</span></label>
            <input type="password" value={senha} onChange={e => setSenha(e.target.value)} placeholder="Mín. 6 caracteres" />
          </div>

          {erro && <p className={styles.erro}>{erro}</p>}
          {sucesso && <p className={styles.sucesso}>{sucesso}</p>}
        </div>

        <div className={styles.footer}>
          <button className={styles.btnCancelar} onClick={onFechar}>Cancelar</button>
          <button className={styles.btnSalvar} onClick={salvar} disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </div>

        <div className={styles.zonaPerigo}>
          {!confirmarDelete ? (
            <button className={styles.btnDeletarConta} onClick={() => setConfirmarDelete(true)}>
              Deletar minha conta
            </button>
          ) : (
            <div className={styles.confirmacaoDelete}>
              <p>Essa ação é <strong>permanente</strong> e vai deletar sua conta e todas as suas tarefas. Tem certeza?</p>
              <div className={styles.confirmacaoAcoes}>
                <button className={styles.btnCancelar} onClick={() => setConfirmarDelete(false)}>Cancelar</button>
                <button className={styles.btnDeletarConfirmar} onClick={deletar}>Sim, deletar conta</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}