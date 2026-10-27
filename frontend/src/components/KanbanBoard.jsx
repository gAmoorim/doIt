import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  useSensor,
  useSensors,
  closestCorners,
  MeasuringStrategy
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove
} from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import KanbanCard from './KanbanCard'
import styles from './KanbanBoard.module.css'

const COLUNAS = [
  { id: 'em_andamento', label: 'Em andamento', cor: '#60a5fa' },
  { id: 'pendente',     label: 'Pendentes',    cor: '#f59e0b' },
  { id: 'concluida',   label: 'Concluídas',   cor: '#4ade80' },
]

function Coluna({ coluna, tarefas, onEditar, onDeletar }) {
  const { setNodeRef, isOver } = useDroppable({ id: coluna.id })

  return (
    <div className={`${styles.coluna} ${isOver ? styles.colunaOver : ''}`}>
      <div className={styles.colunaHeader}>
        <span className={styles.colunaDot} style={{ background: coluna.cor }} />
        <h3 className={styles.colunaLabel}>{coluna.label}</h3>
        <span className={styles.colunaCount}>{tarefas.length}</span>
      </div>

      <div ref={setNodeRef} className={styles.colunaBody}>
        <SortableContext items={tarefas.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tarefas.map(t => (
            <KanbanCard key={t.id} tarefa={t} onEditar={onEditar} onDeletar={onDeletar} />
          ))}
        </SortableContext>

        {tarefas.length === 0 && (
          <div className={styles.vazio}>Nenhuma tarefa</div>
        )}
      </div>
    </div>
  )
}

export default function KanbanBoard({ tarefas, onEditar, onDeletar, onAtualizarStatus, onReordenar }) {
  const [ativo, setAtivo] = useState(null)

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } })
  )

  const getTarefasPorStatus = (status) =>
    tarefas.filter(t => t.status === status)

  const encontrarColuna = (id) => {
    return COLUNAS.find(col =>
      getTarefasPorStatus(col.id).some(t => t.id === id)
    )?.id
  }

  const handleDragStart = ({ active }) => {
    setAtivo(tarefas.find(t => t.id === active.id) || null)
    document.body.style.overflow = 'hidden'
  }

  const handleDragEnd = ({ active, over }) => {
    setAtivo(null)
    document.body.style.overflow = ''
    if (!over) return

    const colunaDestino = COLUNAS.find(c => c.id === over.id)?.id
      || encontrarColuna(over.id)

    if (!colunaDestino) return

    const colunaOrigem = encontrarColuna(active.id)

    if (colunaOrigem !== colunaDestino) {
      // move para outra coluna
      onAtualizarStatus(active.id, colunaDestino)
    } else {
      // reordena dentro da mesma coluna
      const listaColuna = getTarefasPorStatus(colunaOrigem)
      const oldIndex = listaColuna.findIndex(t => t.id === active.id)
      const newIndex = listaColuna.findIndex(t => t.id === over.id)

      if (oldIndex !== newIndex && newIndex !== -1) {
        const novaOrdem = arrayMove(listaColuna, oldIndex, newIndex)
        onReordenar(colunaOrigem, novaOrdem)
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      autoScroll={false}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
    >
      <div className={styles.board}>
        {COLUNAS.map(col => (
          <Coluna
            key={col.id}
            coluna={col}
            tarefas={getTarefasPorStatus(col.id)}
            onEditar={onEditar}
            onDeletar={onDeletar}
          />
        ))}
      </div>

      <DragOverlay>
        {ativo && (
          <div style={{ transform: 'rotate(2deg)', opacity: 0.95 }}>
            <KanbanCard tarefa={ativo} onEditar={() => {}} onDeletar={() => {}} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}