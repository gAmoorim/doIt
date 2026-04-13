import styles from './TarefaCard.module.css'

const cores = {
  alta:  { dot: '#ef4444', bg: 'rgba(239,68,68,0.1)', label: 'Alta' },
  media: { dot: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: 'Média' },
  baixa: { dot: '#22c55e', bg: 'rgba(34,197,94,0.1)',  label: 'Baixa' },
}

const statusStyle = {
  pendente:     { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24', label: 'Pendente' },
  concluida:    { bg: 'rgba(34,197,94,0.15)',  color: '#4ade80', label: 'Concluída' },
  em_andamento: { bg: 'rgba(96,165,250,0.15)', color: '#60a5fa', label: 'Em andamento' },
}

export default function TarefaCard({ tarefa, onEditar, onDeletar }) {
  const prioridade = cores[tarefa.prioridade?.toLowerCase()] || { dot: '#666', bg: 'rgba(255,255,255,0.05)', label: tarefa.prioridade }
  const status = statusStyle[tarefa.status] || { bg: 'rgba(255,255,255,0.05)', color: '#aaa', label: tarefa.status }

  const etiquetas = (() => {
    try { return JSON.parse(tarefa.etiquetas) || [] } catch { return [] }
  })()

  const formatarData = (data) => {
    if (!data) return null
    return new Date(data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  return (
    <div className={`${styles.card} ${tarefa.status === 'concluida' ? styles.concluida : ''}`}>
      <div className={styles.prioridadeBarra} style={{ background: prioridade.dot }} />

      <div className={styles.corpo}>
        <div className={styles.topo}>
          <h3 className={styles.titulo}>{tarefa.titulo}</h3>
          <div className={styles.acoes}>
            <button className={styles.btnEditar} onClick={() => onEditar(tarefa)}>Editar</button>
            <button className={styles.btnDeletar} onClick={() => onDeletar(tarefa.id)}>Deletar</button>
          </div>
        </div>

        {tarefa.descricao && <p className={styles.descricao}>{tarefa.descricao}</p>}

        <div className={styles.meta}>
          {tarefa.status && (
            <span className={styles.badge} style={{ background: status.bg, color: status.color }}>
              {status.label}
            </span>
          )}
          <span className={styles.badge} style={{ background: prioridade.bg, color: prioridade.dot }}>
            {prioridade.label}
          </span>
          {tarefa.categoria && (
            <span className={styles.badge} style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa' }}>
              {tarefa.categoria}
            </span>
          )}
          {tarefa.data_vencimento && (
            <span className={styles.badge} style={{ background: 'rgba(255,255,255,0.05)', color: '#9ca3af' }}>
              📅 {formatarData(tarefa.data_vencimento)}
            </span>
          )}
          {etiquetas.map((e, i) => (
            <span key={i} className={styles.badge} style={{ background: 'rgba(255,255,255,0.05)', color: '#9ca3af' }}>
              #{e}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}