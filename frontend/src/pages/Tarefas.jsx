import { useState, useEffect } from 'react'
import { listarTarefasApi, criarTarefaApi, atualizarTarefaApi, deletarTarefaApi, filtrarTarefasApi } from '../services/api'
import TarefaCard from '../components/TarefaCard'
import ModalTarefa from '../components/ModalTarefa'
import ModalConfirmacao from '../components/ModalConfirmacao'
import ModalConta from '../components/ModalConta'
import KanbanBoard from '../components/KanbanBoard'
import styles from './Tarefas.module.css'

const ordemPrioridade = { alta: 1, media: 2, baixa: 3 }

const ordenarPorPrioridade = (lista) =>
  [...lista].sort((a, b) =>
    (ordemPrioridade[a.prioridade] || 4) - (ordemPrioridade[b.prioridade] || 4)
  )

export default function Tarefas({ onLogout }) {
  const [tarefas, setTarefas] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalAberto, setModalAberto] = useState(false)
  const [tarefaEditando, setTarefaEditando] = useState(null)
  const [filtros, setFiltros] = useState({ status: '', categoria: '', titulo: '' })
  const [filtroAtivo, setFiltroAtivo] = useState(false)
  const [msgBackup, setMsgBackup] = useState('')
  const [confirmacao, setConfirmacao] = useState(null)
  const [modalContaAberto, setModalContaAberto] = useState(false)
  const [visualizacao, setVisualizacao] = useState(() =>
    localStorage.getItem('doit_visualizacao') || 'lista'
  )
  const [usuario, setUsuario] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('usuario')) } catch { return null }
  })

  const carregar = async () => {
    setLoading(true)
    const data = await listarTarefasApi()
    setTarefas(Array.isArray(data) ? ordenarPorPrioridade(data) : [])
    setFiltroAtivo(false)
    setLoading(false)
  }

  useEffect(() => { carregar() }, [])

  const trocarVisualizacao = (modo) => {
    setVisualizacao(modo)
    localStorage.setItem('doit_visualizacao', modo)
  }

  const aplicarFiltros = async () => {
    const params = Object.fromEntries(Object.entries(filtros).filter(([,v]) => v))
    if (Object.keys(params).length === 0) return carregar()
    setLoading(true)
    const data = await filtrarTarefasApi(params)
    setTarefas(Array.isArray(data) ? ordenarPorPrioridade(data) : [])
    setFiltroAtivo(true)
    setLoading(false)
  }

  const limparFiltros = () => {
    setFiltros({ status: '', categoria: '', titulo: '' })
    carregar()
  }

  const abrirNova = () => { setTarefaEditando(null); setModalAberto(true) }
  const abrirEdicao = (tarefa) => { setTarefaEditando(tarefa); setModalAberto(true) }

  const salvar = async (dados) => {
    if (tarefaEditando) {
      await atualizarTarefaApi(tarefaEditando.id, dados)
    } else {
      await criarTarefaApi(dados)
    }
    setModalAberto(false)
    carregar()
  }

  const pedirConfirmacaoDeletar = (id) => {
    setConfirmacao({
      titulo: 'Deletar tarefa',
      mensagem: 'Tem certeza que quer deletar esta tarefa? Essa ação não pode ser desfeita.',
      textoConfirmar: 'Deletar',
      acao: async () => {
        await deletarTarefaApi(id)
        carregar()
        setConfirmacao(null)
      }
    })
  }

  const atualizarStatus = async (id, novoStatus) => {
  const tarefa = tarefas.find(t => t.id === id)
  if (!tarefa) return

  // atualiza localmente sem recarregar
  setTarefas(prev =>
    ordenarPorPrioridade(
      prev.map(t => t.id === id ? { ...t, status: novoStatus } : t)
    )
  )

  // salva na API em background
  await atualizarTarefaApi(id, { ...tarefa, status: novoStatus })
}

const reordenarTarefas = (status, novaOrdem) => {
  setTarefas(prev => {
    const outras = prev.filter(t => t.status !== status)
    return [...outras, ...novaOrdem]
  })
}

  const exportarBackup = async () => {
    const res = await window.backup.exportar()
    setMsgBackup(res.mensagem)
    setTimeout(() => setMsgBackup(''), 4000)
  }

  const pedirConfirmacaoImportar = () => {
    setConfirmacao({
      titulo: 'Importar backup',
      mensagem: 'Atenção: importar um backup vai substituir TODOS os dados atuais. Esta ação não pode ser desfeita.',
      textoConfirmar: 'Importar',
      acao: async () => {
        const res = await window.backup.importar()
        setMsgBackup(res.mensagem)
        setTimeout(() => setMsgBackup(''), 4000)
        setConfirmacao(null)
      }
    })
  }

  const pedirConfirmacaoLogout = () => {
    setConfirmacao({
      titulo: 'Sair da conta',
      mensagem: 'Tem certeza que deseja sair?',
      textoConfirmar: 'Sair',
      acao: () => { setConfirmacao(null); onLogout() }
    })
  }

  const handleContaAtualizada = (dadosNovos) => {
    const usuarioAtualizado = { ...usuario, ...dadosNovos }
    setUsuario(usuarioAtualizado)
    sessionStorage.setItem('usuario', JSON.stringify(usuarioAtualizado))
  }

  const handleContaDeletada = () => {
    setModalContaAberto(false)
    onLogout()
  }

  const pendentes  = tarefas.filter(t => t.status === 'pendente')
  const andamento  = tarefas.filter(t => t.status === 'em_andamento')
  const concluidas = tarefas.filter(t => t.status === 'concluida')
  const outras     = tarefas.filter(t => !['pendente','em_andamento','concluida'].includes(t.status))

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>do<span>it</span></div>

        <div className={styles.sidebarSection}>
          <p className={styles.sidebarLabel}>Filtros</p>

          <div className={styles.filtroGrupo}>
            <label>Título</label>
            <input
              placeholder="Buscar por título..."
              value={filtros.titulo}
              onChange={e => setFiltros({ ...filtros, titulo: e.target.value })}
            />
          </div>

          <div className={styles.filtroGrupo}>
            <label>Status</label>
            <select value={filtros.status} onChange={e => setFiltros({ ...filtros, status: e.target.value })}>
              <option value="">Todos</option>
              <option value="pendente">Pendente</option>
              <option value="em_andamento">Em andamento</option>
              <option value="concluida">Concluída</option>
            </select>
          </div>

          <div className={styles.filtroGrupo}>
            <label>Categoria</label>
            <input
              placeholder="Ex: Trabalho"
              value={filtros.categoria}
              onChange={e => setFiltros({ ...filtros, categoria: e.target.value })}
            />
          </div>

          <button className={styles.btnFiltrar} onClick={aplicarFiltros}>Filtrar</button>
          {filtroAtivo && (
            <button className={styles.btnLimpar} onClick={limparFiltros}>Limpar filtros</button>
          )}
        </div>

        <div className={styles.sidebarFooter}>
          <p className={styles.sidebarLabel}>Backup</p>
          <button className={styles.btnBackup} onClick={exportarBackup}>⬆ Exportar backup</button>
          <button className={styles.btnBackup} onClick={pedirConfirmacaoImportar}>⬇ Importar backup</button>
          {msgBackup && <p className={styles.msgBackup}>{msgBackup}</p>}

          <div className={styles.separador} />

          {usuario && (
            <button className={styles.usuarioInfo} onClick={() => setModalContaAberto(true)}>
              <strong>{usuario.nome}</strong>
              {usuario.email}
            </button>
          )}
          <button className={styles.btnSair} onClick={pedirConfirmacaoLogout}>Sair</button>
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.mainHeader}>
          <div>
            <h2>Minhas tarefas</h2>
            <p className={styles.subtitulo}>
              {tarefas.length} tarefa{tarefas.length !== 1 ? 's' : ''}
              {filtroAtivo ? ' encontradas' : ' no total'}
            </p>
          </div>

          <div className={styles.headerAcoes}>
            <div className={styles.toggleVisualizacao}>
              <button
                className={`${styles.toggleBtn} ${visualizacao === 'lista' ? styles.toggleAtivo : ''}`}
                onClick={() => trocarVisualizacao('lista')}
              >
                ☰ Lista
              </button>
              <button
                className={`${styles.toggleBtn} ${visualizacao === 'kanban' ? styles.toggleAtivo : ''}`}
                onClick={() => trocarVisualizacao('kanban')}
              >
                ⊞ Kanban
              </button>
            </div>
            <button className={styles.btnNova} onClick={abrirNova}>+ Nova tarefa</button>
          </div>
        </div>

        {loading ? (
          <div className={styles.loading}>Carregando...</div>
        ) : tarefas.length === 0 ? (
          <div className={styles.vazio}>
            {filtroAtivo ? (
              <>
                <p>Nenhuma tarefa encontrada com esse filtro.</p>
                <span>Tente ajustar os filtros ou limpe-os para ver todas as tarefas.</span>
              </>
            ) : (
              <>
                <p>Nenhuma tarefa encontrada.</p>
                <span>Crie uma nova tarefa para começar!</span>
              </>
            )}
          </div>
        ) : visualizacao === 'kanban' ? (
          <KanbanBoard
            tarefas={tarefas}
            onEditar={abrirEdicao}
            onDeletar={pedirConfirmacaoDeletar}
            onAtualizarStatus={atualizarStatus}
            onReordenar={reordenarTarefas}
          />
        ) : (
          <div className={styles.colunas}>
            {[
              { label: 'Em andamento', cor: '#60a5fa', lista: andamento },
              { label: 'Pendentes',    cor: '#f59e0b', lista: pendentes },
              { label: 'Concluídas',   cor: '#4ade80', lista: concluidas },
              ...(outras.length ? [{ label: 'Outras', cor: '#9ca3af', lista: outras }] : [])
            ].map(({ label, cor, lista }) => lista.length > 0 && (
              <section key={label} className={styles.secao}>
                <div className={styles.secaoHeader}>
                  <span className={styles.secaoDot} style={{ background: cor }} />
                  <h3>{label}</h3>
                  <span className={styles.secaoCount}>{lista.length}</span>
                </div>
                <div className={styles.lista}>
                  {lista.map(t => (
                    <TarefaCard key={t.id} tarefa={t} onEditar={abrirEdicao} onDeletar={pedirConfirmacaoDeletar} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      <ModalTarefa
        aberto={modalAberto}
        tarefa={tarefaEditando}
        onSalvar={salvar}
        onFechar={() => setModalAberto(false)}
      />

      <ModalConfirmacao
        aberto={!!confirmacao}
        titulo={confirmacao?.titulo}
        mensagem={confirmacao?.mensagem}
        textoConfirmar={confirmacao?.textoConfirmar}
        onConfirmar={confirmacao?.acao}
        onCancelar={() => setConfirmacao(null)}
      />

      <ModalConta
        aberto={modalContaAberto}
        usuario={usuario}
        onFechar={() => setModalContaAberto(false)}
        onContaAtualizada={handleContaAtualizada}
        onContaDeletada={handleContaDeletada}
      />
    </div>
  )
}