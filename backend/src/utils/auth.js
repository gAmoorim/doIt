require('dotenv').config()
const jwt = require('jsonwebtoken')
const { queryUsuarioExistente } = require('../database/querys/queryUsuarios')

const auth = async (req, res, next) => {

    const {authorization} = req.headers

    if (!authorization) {
        return res.status(400).json({mensagem: 'Token nao informado'})
    }

    try {
        const token = authorization.replace('Bearer', '').split(' ')[1]

        const { id } = jwt.verify(token, process.env.JWT_PWD)

        const usuarioExiste = await queryUsuarioExistente(id)

        if (!usuarioExiste) {
            return res.status(404).json({mensagem: 'Token invalido'})
        }

        const { senha, ...usuario} = usuarioExiste
        req.usuario = usuario

        next()
    } catch (error) {
        console.error("Ocorreu um erro:", error)
    }
}

module.exports = auth