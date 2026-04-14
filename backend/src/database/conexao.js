const path = require('path')
const fs = require('fs')

let dataDir

try {
  const { app } = require('electron')
  dataDir = path.join(app.getPath('userData'), 'data')
} catch {
  dataDir = path.join(__dirname, '../../../data')
}

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: path.join(dataDir, 'todolist.db')
    },
    useNullAsDefault: true
})

const inicializarBanco = async () => {
    const temUsuarios = await knex.schema.hasTable('usuarios')
    if (!temUsuarios) {
        await knex.schema.createTable('usuarios', (t) => {
            t.increments('id').primary()
            t.string('nome').notNullable()
            t.string('email').unique().notNullable()
            t.string('senha').notNullable()
            t.timestamp('criado_em').defaultTo(knex.fn.now())
        })
        console.log('Tabela usuarios criada.')
    }

    const temTarefas = await knex.schema.hasTable('tarefas')
    if (!temTarefas) {
        await knex.schema.createTable('tarefas', (t) => {
            t.increments('id').primary()
            t.string('titulo').notNullable()
            t.text('descricao')
            t.string('status').defaultTo('pendente')
            t.string('prioridade')
            t.string('categoria')
            t.datetime('data_vencimento')
            t.text('etiquetas')
            t.integer('user_id').references('id').inTable('usuarios').onDelete('CASCADE')
            t.timestamp('criado_em').defaultTo(knex.fn.now())
        })
        console.log('Tabela tarefas criada.')
    }
}

inicializarBanco().catch(console.error)

module.exports = knex