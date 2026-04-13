const express = require('express')
const rotas = require('./routers/rotas')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())
app.use(rotas)

module.exports = app