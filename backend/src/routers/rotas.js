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

rotas.get('/tarefas/filtro', auth, filtros)
rotas.get('/usuario', auth, obterUsuario)
rotas.put('/usuario', auth, atualizarUsuario)
rotas.delete('/usuario', auth, deletarUsuario)

rotas.post('/tarefa', auth, criarTarefa)
rotas.get('/tarefas', auth, listarTarefas)

rotas.get('/tarefas/:id', auth, listarTarefaEspecifica)
rotas.put('/tarefas/:id', auth, atualizarTarefa)
rotas.delete('/tarefas/:id', auth, deletarTarefa)

module.exports = rotas