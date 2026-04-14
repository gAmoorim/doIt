import { useState, useEffect } from 'react'
import styles from './ModalTarefa.module.css'

const vazio = { titulo: '', descricao: '', prioridade: 'media', status: 'pendente', categoria: '', data_vencimento: '', etiquetas: '' }

export default function ModalTarefa({ aberto, tarefa, onSalvar, onFechar }) {
  const [form, setForm] = useState(vazio)

  useEffect(() => {
    if (tarefa) {
      const etiquetas = (() => {
        try { return (JSON.parse(tarefa.etiquetas) || []).join(', ') } catch { return '' }
      })()
      setForm({ ...tarefa, etiquetas })
    } else {
      setForm(vazio)
    }
  }, [tarefa, aberto])

  const atualizar = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const salvar = () => {
  const dados = {
    ...form,
    data_vencimento: form.data_vencimento || null,
    etiquetas: form.etiquetas ? form.etiquetas.split(',').map(e => e.trim()).filter(Boolean) : []
  }
  onSalvar(dados)
  }

  if (!aberto) return null

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onFechar()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>{tarefa ? 'Editar tarefa' : 'Nova tarefa'}</h3>
          <button className={styles.btnFechar} onClick={onFechar}>✕</button>
        </div>

        <div className={styles.body}>
          <div className={styles.formGroup}>
            <label>Título *</label>
            <input name="titulo" value={form.titulo} onChange={atualizar} placeholder="Título da tarefa" />
          </div>

          <div className={styles.formGroup}>
            <label>Descrição</label>
            <textarea name="descricao" value={form.descricao} onChange={atualizar} placeholder="Descreva a tarefa..." rows={3} />
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Prioridade *</label>
              <select name="prioridade" value={form.prioridade} onChange={atualizar}>
                <option value="alta">Alta</option>
                <option value="media">Média</option>
                <option value="baixa">Baixa</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Status</label>
              <select name="status" value={form.status} onChange={atualizar}>
                <option value="pendente">Pendente</option>
                <option value="em_andamento">Em andamento</option>
                <option value="concluida">Concluída</option>
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Categoria</label>
              <input name="categoria" value={form.categoria || ''} onChange={atualizar} placeholder="Ex: Trabalho" />
            </div>

            <div className={styles.formGroup}>
              <label>Vencimento</label>
              <input name="data_vencimento" type="date" value={form.data_vencimento?.slice(0,10) || ''} onChange={atualizar} />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Etiquetas <span>(separadas por vírgula)</span></label>
            <input name="etiquetas" value={form.etiquetas || ''} onChange={atualizar} placeholder="Ex: urgente, reunião, cliente" />
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.btnCancelar} onClick={onFechar}>Cancelar</button>
          <button className={styles.btnSalvar} onClick={salvar}>
            {tarefa ? 'Salvar alterações' : 'Criar tarefa'}
          </button>
        </div>
      </div>
    </div>
  )
}