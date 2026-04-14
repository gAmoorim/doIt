const knex = require('../conexao')

const queryUsuarioExistente = async (id) => {
    return await knex('usuarios')
    .where({id})
    .first()
}

const queryBuscarUsuarioPeloEmail = async (email) => {
    return await knex('usuarios')
    .where({email})
    .first()
}

const queryCadastrarUsuario = async (dadosDoUsuario) => {
    return await knex('usuarios')
    .insert(dadosDoUsuario)
}

const queryAtualizarUsuario = async (dadosUsuarioAtualizado, id) => {
    return await knex('usuarios')
    .where({id})
    .update(dadosUsuarioAtualizado)
}

const queryDeletarUsuario = async(id) => {
    return await knex('usuarios')
    .where({id})
    .delete()
}

const queryExibirUsuarios = async() => {
    return await knex('usuarios')
}

module.exports = {
    queryUsuarioExistente,
    queryBuscarUsuarioPeloEmail,
    queryCadastrarUsuario,
    queryAtualizarUsuario,
    queryDeletarUsuario,
    queryExibirUsuarios
}