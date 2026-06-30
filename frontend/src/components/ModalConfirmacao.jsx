import styles from './ModalConfirmacao.module.css'

export default function ModalConfirmacao({ aberto, titulo, mensagem, onConfirmar, onCancelar, textoConfirmar = 'Confirmar' }) {
  if (!aberto) return null

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onCancelar()}>
      <div className={styles.modal}>
        <h3>{titulo}</h3>
        <p>{mensagem}</p>
        <div className={styles.acoes}>
          <button className={styles.btnCancelar} onClick={onCancelar}>Cancelar</button>
          <button className={styles.btnConfirmar} onClick={onConfirmar}>{textoConfirmar}</button>
        </div>
      </div>
    </div>
  )
}