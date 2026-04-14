const app = require('./src/app.js')

require('dotenv').config();

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Server rodando na porta ${port}`)
}).on('error', (err) => {
  console.error('Erro ao subir servidor:', err)
})