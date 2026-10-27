import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import styles from './KanbanCard.module.css'

const coresPrioridade = {
  alta:  '#ef4444',
  media: '#f59e0b',
  baixa: '#22c55e',
}

export default function KanbanCard({ tarefa, onEditar, onDeletar }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: tarefa.id
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    visibility: isDragging ? 'hidden' : 'visible',
    cursor: isDragging ? 'grabbing' : 'grab',
  }

  const cor = coresPrioridade[tarefa.prioridade?.toLowerCase()] || '#666'

  const etiquetas = (() => {
    try {
      const parsed = JSON.parse(tarefa.etiquetas)
      return Array.isArray(parsed) ? parsed : []
    } catch { return [] }
  })()

  const formatarData = (data) => {
    if (!data) return null
    return new Date(data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={styles.card}>
      <div className={styles.prioridadeBarra} style={{ background: cor }} />
      <div className={styles.body}>
        <p className={styles.titulo}>{tarefa.titulo}</p>
        {tarefa.descricao && <p className={styles.descricao}>{tarefa.descricao}</p>}

        <div className={styles.meta}>
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
          {etiquetas.slice(0, 2).map((e, i) => (
            <span key={i} className={styles.badge} style={{ background: 'rgba(255,255,255,0.05)', color: '#9ca3af' }}>
              #{e}
            </span>
          ))}
        </div>

        <div className={styles.acoes}>
          <button
            className={styles.btnAcao}
            onPointerDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); onEditar(tarefa) }}
          >
            Editar
          </button>
          <button
            className={`${styles.btnAcao} ${styles.btnDeletar}`}
            onPointerDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); onDeletar(tarefa.id) }}
          >
            Deletar
          </button>
        </div>
      </div>
    </div>
  )
}