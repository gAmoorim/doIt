const knex = require('../database/conexao')

const filtros = async (req,res) => {
    const {status, categoria, data_vencimento, search, titulo} = req.query
    const user_id = req.usuario.id;

    try {
        let query = knex('tarefas').select('*').where({ user_id });

        if (status) {
            query.where("status", status)
        }

        if (titulo) {
            query.where("titulo", "like", `%${titulo}%`)
        }

        if (categoria) {
            query.where('categoria', categoria)
        }

        if (data_vencimento) {
            query.where('data_vencimento', data_vencimento)
        }

       if (search) {
            query.andWhere(function () {
                this.where("titulo", "like", `%${search}%`)
                    .orWhere("descricao", "like", `%${search}%`);
            })
        }

        const tarefas = await query;
        res.json(tarefas);

    } catch (error) {
        console.error("Erro ao aplicar filtros nas tarefas:", error)
        return res.status(500).json({ mensagem: "Erro interno do servidor." })
    }
}

module.exports = {
    filtros
}