const { queryNovaTarefa, queryTarefas, queryTarefaEspecifica, queryBuscarTarefa, queryAtualizarTarefa, queryDeletarTarefa } = require("../database/querys/queryTarefas")

const criarTarefa = async (req,res) => {
    const { titulo, descricao, data_vencimento, prioridade, categoria, status, etiquetas} = req.body

    if (!titulo || !descricao || !prioridade) {
        return res.status(400).json({mensagem: 'Preencha pelo menos o titulo, a descrição e a prioridade'})
    }

    const {id} = req.usuario

    try {
        const novaTarefa = {
            titulo,
            descricao,
            data_vencimento,
            prioridade,
            categoria,
            status,
            etiquetas: JSON.stringify(etiquetas),
            user_id: id
        }

        await queryNovaTarefa(novaTarefa)

        return res.status(201).json({mensagem: "Nova tarefa criada com sucesso!"})
    } catch (error) {
        console.error("Ocorreu um erro ao cadastrar uma nova tarefa:", error)
        return res.status(500).json({ mensagem: "Erro interno ao criar tarefa." })
    }
}

const listarTarefas = async (req,res) => {

    try {
        // LISTAR TAREFAS DO USUARIO LOGADO
        const {id} = req.usuario
        const tarefas = await queryTarefas(id)

        if (!tarefas) {
            return res.status(404).json({mensagem: 'Nenhuma tarefa encontrada'})
        }

        return res.status(200).json(tarefas)
    } catch (error) {
        console.error("Ocorreu um erro ao listar as tarefas:", error)
        return res.status(500).json({ mensagem: "Erro interno ao listar tarefas." })
    }
}

const listarTarefaEspecifica = async (req,res) => {
    const {id} = req.params
    const user_id = req.usuario.id

    try {
        const tarefa = await queryTarefaEspecifica(id, user_id)

        if (!tarefa) {
            return res.status(404).json({mensagem: 'Nenhuma tarefa encontrada'})
        }

        return res.status(200).json(tarefa)
    } catch (error) {
        console.error("Ocorreu um erro ao listar a tarefa Especifica:", error)
        return res.status(500).json({ mensagem: "Erro interno ao listar a tarefa." })
    }
}

const atualizarTarefa = async (req,res) => {
    const {titulo, descricao, data_vencimento, prioridade, categoria, status, etiquetas} = req.body
    const {id} = req.params
    const user_id = req.usuario.id

    try {
        const tarefa = queryBuscarTarefa(id, user_id)

        if (!tarefa) {
            return res.status(404).json({mensagem: 'Nenhuma tarefa encontrada'})
        }

        const camposAtualizados = {
            titulo,
            descricao,
            data_vencimento,
            prioridade,
            categoria,
            status,
            etiquetas: JSON.stringify(etiquetas)
        }

        const tarefaAtualizda = await queryAtualizarTarefa(camposAtualizados, id, user_id)

        return res.status(200).json({mensagem: 'Tarefa atualizada com sucesso.', tarefa: tarefaAtualizda})        
    } catch (error) {
        console.error("Ocorreu um erro ao atualizar a tarefa:", error)
        return res.status(500).json({ mensagem: "Erro interno ao atualizar a tarefa." })
    }
}

const deletarTarefa = async (req,res) => {
    const {id} = req.params
    const user_id = req.usuario.id

    try {
        const tarefa = await queryBuscarTarefa(id, user_id)

        if (!tarefa) {
            return res.status(404).json({mensagem: 'Nenhuma tarefa encontrad'})
        }

        await queryDeletarTarefa(id, user_id)
        return res.status(200).json({mensagem: "Tarefa deletada com sucesso"})
    } catch (error) {
       console.error("Ocorreu um erro ao deletar a tarefa:", error)
       return res.status(500).json({ mensagem: "Erro interno ao deletar a tarefa." })
    }
}


module.exports = {
    criarTarefa,
    listarTarefas,
    listarTarefaEspecifica,
    atualizarTarefa,
    deletarTarefa
}
