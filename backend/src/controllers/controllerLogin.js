require('dotenv').config()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { queryBuscarUsuarioPeloEmail } = require('../database/querys/queryUsuarios')

const login = async (req,res) => {
    const {email, senha} = req.body

    if (!email || !senha) {
        return res.status(400).json({mensagem:'Informe email e senha'})
    }

    try {
        const usuario = await queryBuscarUsuarioPeloEmail(email)

        if (!usuario) {
            return res.status(404).json({mensagem: 'Login ou senha incorreto'})
        }

        const senhacorreta = await bcrypt.compare(senha, usuario.senha)

        if (!senhacorreta) {
            return res.status(400).json({mensagem: 'Login ou senha incorreto'})
        }

        const dadosTokenUsuario = {
            id: usuario.id,
            email: usuario.email
        }

        const token = jwt.sign(dadosTokenUsuario, process.env.JWT_PWD || 'doit_secret_key_2026', { expiresIn: '2h'})

        const { senha: _, ...dadosUsuario } = usuario

        return res.status(200).json({
            usuario: dadosUsuario,
            token
        })
    } catch (error) {
        console.error("Ocorreu um erro ao realizar login:", error)
        return res.status(500).json({ mensagem: `Erro ao realizar login: ${error.message}`})
    }
}

module.exports = {
    login
}