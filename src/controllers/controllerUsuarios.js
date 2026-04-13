const bcrypt = require('bcrypt');
const { queryBuscarUsuarioPeloEmail, queryCadastrarUsuario, queryAtualizarUsuario, queryDeletarUsuario, queryExibirUsuarios } = require('../database/querys/queryUsuarios');

const cadastrarUsuario = async (req, res) => {
    const {nome, email, senha} = req.body

    if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Preencha todos os campos'})
    }

    if (!validarEmail(email)) {
        return res.status(400).json({ error: 'Formato do email inválido' })
    }

    try {
        const usuarioExistente = await queryBuscarUsuarioPeloEmail(email)

        if (usuarioExistente) {
            return res.status(400).json({mensagem: 'Já existe um usuario com esse e-mail'})
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10)

        const dadosDoUsuario = {
            nome,
            email,
            senha: senhaCriptografada,
            criado_em: new Date()
        }

        await queryCadastrarUsuario(dadosDoUsuario)
    
        return res.status(201).json({mensagem: 'Usuário cadastrado com sucesso'})       
    } catch (error) {
        console.error("Ocorreu um erro ao cadastrar a tarefa:", error)
        return res.status(500).json({ mensagem: `Erro ao cadastrar usuário: ${error.message}`})
    }
}

const obterUsuario = (req,res) => {
    try {
        return res.status(200).json(req.usuario)
    } catch (error) {
        console.error("Ocorreu um erro ao obter o usuário:", error)
        return res.status(500).json({ mensagem: `Erro ao obter usuário: ${error.message}`})
    }
}

const atualizarUsuario = async (req, res) => {
   let { nome, email, senha } = req.body

   if (!nome && !senha && !email) {
        return res.status(400).json({mensage: 'Informe ao menos um campo para ser atualizado'})
   }

   const {id} = req.usuario

   try {
        if (senha) {
            if (senha.length < 5) {
                return res.status(400).json({mensagem: 'A senha deve conter no mínimo 5 caracteres'})
            }
            senha = await bcrypt.hash(senha,10)
        }

        if (email !== req.usuario.email) {
            const emailJaExiste = await queryBuscarUsuarioPeloEmail(email)

            if (emailJaExiste) {
                return res.status(400).json({mensagem: 'O email ja existe'})
            }
        }

        const dadosUsuarioAtualizado = {
            nome,
            senha,
            email
        }

        await queryAtualizarUsuario(dadosUsuarioAtualizado, id)

        return res.status(200).json({mensagem: 'Usuario atualizado com sucesso'})
   } catch (error) {
        console.error("Ocorreu um erro ao atualizar o usuário:", error)
        return res.status(500).json({ mensagem: `Erro ao atualizar o usuário: ${error.message}`})
   }
}

const deletarUsuario = async (req,res) => {
    try {
        const {id} = req.usuario

        if (!id) {
            return res.status(400).json({mensagem: "Erro ao obter o id do usuário"})
        }

        await queryDeletarUsuario(id)
        return res.status(200).json({mensagem:" Usuário deletado com sucesso. "})
    } catch (error) {
        console.error("Ocorreu um erro ao deletar o usuário:", error)
        return res.status(500).json({ mensagem: `Erro ao deletar o usuário: ${error.message}`})
    }
}

const exibirUsuarios = async (req,res) => {
    try {
        const usuarios = await queryExibirUsuarios()

        return res.status(200).json(usuarios)
    } catch (error) {
        console.error("Ocorreu um erro ao exibir usuários:", error)
        return res.status(500).json({ mensagem: `Erro ao deletar o usuário: ${error.message}`})
    }
}

module.exports = {
    cadastrarUsuario,
    obterUsuario,
    atualizarUsuario,
    deletarUsuario,
    exibirUsuarios
}
