const knex = require('../conexao')

const queryNovaTarefa = async (novaTarefa) => {
    return await knex('tarefas').insert(novaTarefa)
}

const queryTarefas = async (id) => {
   return await knex('tarefas')
   .where({user_id: id})
}

const queryTarefaEspecifica = async (id, user_id) => {
    return await knex('tarefas').where({ id, user_id }).first()
}

const queryBuscarTarefa = async (id, user_id) => {
  return await knex('tarefas')
    .where({ id, user_id })
    .first()
}


const queryAtualizarTarefa = async (camposAtualizados, id, user_id) => {
    return await knex('tarefas')
    .where({id, user_id})
    .update(camposAtualizados)
    .returning('*')
}

const queryDeletarTarefa = async (id, user_id) => {
    return await knex('tarefas')
    .where({id, user_id})
    .delete()
}

module.exports = {
    queryNovaTarefa,
    queryTarefas,
    queryTarefaEspecifica,
    queryBuscarTarefa,
    queryAtualizarTarefa,
    queryDeletarTarefa
}