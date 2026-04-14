const express = require('express')
const { login } = require('../controllers/controllerLogin')
const { listarTarefas, criarTarefa, listarTarefaEspecifica, atualizarTarefa, deletarTarefa } = require('../controllers/controllerTarefas')
const { cadastrarUsuario, obterUsuario, atualizarUsuario, deletarUsuario, exibirUsuarios } = require('../controllers/controllerUsuarios')
const { filtros } = require('../controllers/controllerFiltros')
const auth = require('../utils/auth')
const rotas = express()


rotas.post('/cadastro', cadastrarUsuario)
rotas.get('/usuarios', exibirUsuarios)

rotas.post('/login', login)

rotas.use(auth)

rotas.get('/tarefas/filtro', filtros)
rotas.get('/usuario', obterUsuario)
rotas.put('/usuario', atualizarUsuario)
rotas.delete('/usuario', deletarUsuario)

rotas.post('/tarefa', criarTarefa)
rotas.get('/tarefas', listarTarefas)

rotas.get('/tarefas/:id', listarTarefaEspecifica)
rotas.put('/tarefas/:id', atualizarTarefa)
rotas.delete('/tarefas/:id', deletarTarefa)

module.exports = rotas