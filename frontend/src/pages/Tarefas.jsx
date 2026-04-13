import { useState, useEffect } from 'react'
import { listarTarefasApi, criarTarefaApi, atualizarTarefaApi, deletarTarefaApi, filtrarTarefasApi } from '../services/api'
import TarefaCard from '../components/TarefaCard'
import ModalTarefa from '../components/ModalTarefa'
import styles from './Tarefas.module.css'

export default function Tarefas({ onLogout }) {
  const [tarefas, setTarefas] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalAberto, setModalAberto] = useState(false)
  const [tarefaEditando, setTarefaEditando] = useState(null)
  const [filtros, setFiltros] = useState({ status: '', categoria: '', titulo: '' })
  const [filtroAtivo, setFiltroAtivo] = useState(false)

  const usuario = (() => {
    try { return JSON.parse(sessionStorage.getItem('usuario')) } catch { return null }
  })()

  const carregar = async () => {
    setLoading(true)
    const data = await listarTarefasApi()
    setTarefas(Array.isArray(data) ? data : [])
    setFiltroAtivo(false)
    setLoading(false)
  }

  useEffect(() => { carregar() }, [])

  const aplicarFiltros = async () => {
    const params = Object.fromEntries(Object.entries(filtros).filter(([,v]) => v))
    if (Object.keys(params).length === 0) return carregar()
    setLoading(true)
    const data = await filtrarTarefasApi(params)
    setTarefas(Array.isArray(data) ? data : [])
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

  const deletar = async (id) => {
    if (!confirm('Tem certeza que quer deletar esta tarefa?')) return
    await deletarTarefaApi(id)
    carregar()
  }

  const pendentes   = tarefas.filter(t => t.status === 'pendente')
  const andamento   = tarefas.filter(t => t.status === 'em_andamento')
  const concluidas  = tarefas.filter(t => t.status === 'concluida')
  const outras      = tarefas.filter(t => !['pendente','em_andamento','concluida'].includes(t.status))

  return (
    <div className={styles.layout}>
      {/* SIDEBAR */}
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
          {usuario && (
            <div className={styles.usuarioInfo}>
              <strong>{usuario.nome}</strong>
              {usuario.email}
            </div>
          )}
          <button className={styles.btnSair} onClick={onLogout}>Sair</button>
        </div>
      </aside>

      {/* MAIN */}
      <main className={styles.main}>
        <div className={styles.mainHeader}>
          <div>
            <h2>Minhas tarefas</h2>
            <p className={styles.subtitulo}>
              {tarefas.length} tarefa{tarefas.length !== 1 ? 's' : ''}
              {filtroAtivo ? ' encontradas' : ' no total'}
            </p>
          </div>
          <button className={styles.btnNova} onClick={abrirNova}>+ Nova tarefa</button>
        </div>

        {loading ? (
          <div className={styles.loading}>Carregando...</div>
        ) : tarefas.length === 0 ? (
          <div className={styles.vazio}>
            <p>Nenhuma tarefa encontrada.</p>
            <span>Crie uma nova tarefa para começar!</span>
          </div>
        ) : (
          <div className={styles.colunas}>
            {[
              { label: 'Pendentes', cor: '#f59e0b', lista: pendentes },
              { label: 'Em andamento', cor: '#60a5fa', lista: andamento },
              { label: 'Concluídas', cor: '#4ade80', lista: concluidas },
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
                    <TarefaCard key={t.id} tarefa={t} onEditar={abrirEdicao} onDeletar={deletar} />
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
    </div>
  )
}