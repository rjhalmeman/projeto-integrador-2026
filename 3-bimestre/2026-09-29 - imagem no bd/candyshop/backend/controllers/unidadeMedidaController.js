const { query } = require('../database');

// Listar todas as unidades de medida
exports.listarUnidadesMedida = async (req, res) => {
    try {
        const result = await query('SELECT * FROM public.unidade_medida ORDER BY id_unidade_medida');
        res.json({ sucesso: true, unidades: result.rows });
    } catch (error) {
        console.error('Erro ao listar unidades de medida:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao listar unidades de medida.' });
    }
};

// Obter unidade de medida por ID
exports.obterUnidadeMedida = async (req, res) => {
    try {
        const id = req.params.id ? req.params.id.trim().toUpperCase() : '';
        if (!id || id.length > 2) {
            return res.status(400).json({ sucesso: false, mensagem: 'ID inválido (deve ter até 2 caracteres).' });
        }

        const result = await query('SELECT * FROM public.unidade_medida WHERE id_unidade_medida = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'Unidade de medida não encontrada.' });
        }

        res.json({ sucesso: true, unidade: result.rows[0] });
    } catch (error) {
        console.error('Erro ao obter unidade de medida:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' });
    }
};

// Criar unidade de medida
exports.criarUnidadeMedida = async (req, res) => {
    try {
        const { id_unidade_medida, nome_unidade_medida } = req.body;
        const id = id_unidade_medida ? id_unidade_medida.trim().toUpperCase() : '';

        if (!id || id.length > 2) {
            return res.status(400).json({ sucesso: false, mensagem: 'A sigla/ID deve ter até 2 caracteres.' });
        }

        if (!nome_unidade_medida) {
            return res.status(400).json({ sucesso: false, mensagem: 'O nome da unidade é obrigatório.' });
        }

        const sql = `
            INSERT INTO public.unidade_medida (id_unidade_medida, nome_unidade_medida)
            VALUES ($1, $2)
            RETURNING *
        `;

        const result = await query(sql, [id, nome_unidade_medida]);
        res.status(201).json({ sucesso: true, mensagem: 'Unidade de medida inserida com sucesso!', unidade: result.rows[0] });
    } catch (error) {
        console.error('Erro ao criar unidade de medida:', error);
        if (error.code === '23505') {
            return res.status(400).json({ sucesso: false, mensagem: 'Esta sigla de unidade já está cadastrada.' });
        }
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao inserir unidade de medida no banco de dados.' });
    }
};

// Atualizar unidade de medida
exports.atualizarUnidadeMedida = async (req, res) => {
    try {
        const id = req.params.id ? req.params.id.trim().toUpperCase() : '';
        const { nome_unidade_medida } = req.body;

        if (!id || id.length > 2) {
            return res.status(400).json({ sucesso: false, mensagem: 'ID inválido.' });
        }

        const sql = `
            UPDATE public.unidade_medida 
            SET nome_unidade_medida = $1 
            WHERE id_unidade_medida = $2
            RETURNING *
        `;

        const result = await query(sql, [nome_unidade_medida, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'Unidade de medida não encontrada.' });
        }

        res.json({ sucesso: true, mensagem: 'Unidade de medida alterada com sucesso!', unidade: result.rows[0] });
    } catch (error) {
        console.error('Erro ao atualizar unidade de medida:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao atualizar unidade de medida.' });
    }
};

// Deletar unidade de medida
exports.deletarUnidadeMedida = async (req, res) => {
    try {
        const id = req.params.id ? req.params.id.trim().toUpperCase() : '';

        if (!id || id.length > 2) {
            return res.status(400).json({ sucesso: false, mensagem: 'ID inválido.' });
        }

        await query('DELETE FROM public.unidade_medida WHERE id_unidade_medida = $1', [id]);

        res.json({ sucesso: true, mensagem: 'Unidade de medida excluída com sucesso!' });
    } catch (error) {
        console.error('Erro ao deletar unidade de medida:', error);
        if (error.code === '23503') {
            return res.status(400).json({ sucesso: false, mensagem: 'Não é possível excluir: existem produtos associados a esta unidade.' });
        }
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao excluir unidade de medida.' });
    }
};