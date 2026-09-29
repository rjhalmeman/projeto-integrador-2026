const { query } = require('../database');
const path = require('path');

exports.abrirCrudCargo = (req, res) => {
  const usuario = req.cookies.usuarioLogado; // O cookie deve conter o nome/ID do usuário

  if (usuario) {
    res.sendFile(path.join(__dirname, '../../frontend/cargo/cargo.html'));
  } else {
    res.redirect('/login');
  }
};

exports.listarCargos = async (req, res) => {
  try {
    const result = await query('SELECT * FROM cargo ORDER BY id_cargo');
  //  console.log('Resultado do SELECT:', result.rows);
    res.json({ sucesso: true, cargos: result.rows });
  } catch (error) {
    console.error('Erro ao listar cargos:', error);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor' });
  }
};

exports.criarCargo = async (req, res) => {
  try {
    const { id_cargo, nome_cargo } = req.body;

    // Validação básica
    if (!nome_cargo) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'O nome do cargo é obrigatório'
      });
    }

    const result = await query(
      'INSERT INTO cargo (id_cargo, nome_cargo) VALUES ($1, $2) RETURNING *',
      [id_cargo, nome_cargo]
    );

    res.status(201).json({ sucesso: true, cargo: result.rows[0] });
  } catch (error) {
    console.error('Erro ao criar cargo:', error);

    // Verifica se é erro de violação de constraint NOT NULL
    if (error.code === '23502') {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Dados obrigatórios não fornecidos'
      });
    }

    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor' });
  }
};

exports.obterCargo = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ sucesso: false, mensagem: 'ID deve ser um número válido' });
    }

    const result = await query(
      'SELECT * FROM cargo WHERE id_cargo = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ sucesso: false, mensagem: 'Cargo não encontrado' });
    }

    res.json({ sucesso: true, cargo: result.rows[0] });
  } catch (error) {
    console.error('Erro ao obter cargo:', error);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor' });
  }
};

exports.atualizarCargo = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nome_cargo } = req.body;

    // Verifica se o cargo existe
    const existingPersonResult = await query(
      'SELECT * FROM cargo WHERE id_cargo = $1',
      [id]
    );

    if (existingPersonResult.rows.length === 0) {
      return res.status(404).json({ sucesso: false, mensagem: 'Cargo não encontrado' });
    }

    // Constrói os campos para atualização
    const currentPerson = existingPersonResult.rows[0];
    const updatedFields = {
      nome_cargo: nome_cargo !== undefined ? nome_cargo : currentPerson.nome_cargo
    };

    // Atualiza o cargo
    const updateResult = await query(
      'UPDATE cargo SET nome_cargo = $1 WHERE id_cargo = $2 RETURNING *',
      [updatedFields.nome_cargo, id]
    );

    res.json({ sucesso: true, cargo: updateResult.rows[0] });
  } catch (error) {
    console.error('Erro ao atualizar cargo:', error);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor' });
  }
};

exports.deletarCargo = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // Verifica se o cargo existe
    const existingPersonResult = await query(
      'SELECT * FROM cargo WHERE id_cargo = $1',
      [id]
    );

    if (existingPersonResult.rows.length === 0) {
      return res.status(404).json({ sucesso: false, mensagem: 'Cargo não encontrado' });
    }

    // Deleta o cargo
    await query(
      'DELETE FROM cargo WHERE id_cargo = $1',
      [id]
    );

    res.json({ sucesso: true, mensagem: 'Cargo excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar cargo:', error);

    // Verifica se é erro de violação de foreign key (dependências)
    if (error.code === '23503') {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Não é possível deletar cargo com dependências associadas'
      });
    }

    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor' });
  }
};