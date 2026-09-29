const { query } = require('../database');

// Salvar ou Atualizar Foto (UPSERT)
exports.salvarFotoPessoa = async (req, res) => {
  try {
    const { pessoa_cpf_pessoa } = req.body;
    const file = req.file;

    if (!pessoa_cpf_pessoa) {
      return res.status(400).json({ sucesso: false, mensagem: 'O CPF da pessoa é obrigatório' });
    }

    if (!file) {
      return res.status(400).json({ sucesso: false, mensagem: 'O arquivo de imagem é obrigatório' });
    }

    // req.file.buffer contém os dados binários do arquivo
    const fotoBuffer = file.buffer;

    // Executa UPSERT: insere ou atualiza se já existir o registro para este CPF
    const sql = `
      INSERT INTO foto_pessoa (pessoa_cpf_pessoa, foto)
      VALUES ($1, $2)
      ON CONFLICT (pessoa_cpf_pessoa)
      DO UPDATE SET foto = EXCLUDED.foto
      RETURNING pessoa_cpf_pessoa;
    `;

    await query(sql, [pessoa_cpf_pessoa, fotoBuffer]);

    return res.json({ sucesso: true, mensagem: 'Foto salva com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar foto:', error);

    // Erro de Foreign Key se o CPF não existir na tabela pessoa
    if (error.code === '23503') {
      return res.status(400).json({ sucesso: false, mensagem: 'Pessoa não encontrada no cadastro' });
    }

    return res.status(500).json({ sucesso: false, mensagem: 'Erro interno ao salvar foto' });
  }
};

// Obter a foto da pessoa
exports.obterFotoPessoa = async (req, res) => {
  try {
    const { cpf } = req.params;

    const result = await query(
      'SELECT foto FROM foto_pessoa WHERE pessoa_cpf_pessoa = $1',
      [cpf]
    );

    if (result.rows.length === 0 || !result.rows[0].foto) {
      return res.status(404).json({ sucesso: false, mensagem: 'Foto não encontrada' });
    }

    const imgBuffer = result.rows[0].foto;

    // Define o cabeçalho HTTP como imagem JPEG/PNG genérica
    res.setHeader('Content-Type', 'image/jpeg');
    return res.send(imgBuffer);
  } catch (error) {
    console.error('Erro ao buscar foto:', error);
    return res.status(500).json({ sucesso: false, mensagem: 'Erro ao buscar foto' });
  }
};

// Deletar a foto da pessoa
exports.deletarFotoPessoa = async (req, res) => {
  try {
    const { cpf } = req.params;

    const result = await query(
      'DELETE FROM foto_pessoa WHERE pessoa_cpf_pessoa = $1 RETURNING *',
      [cpf]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ sucesso: false, mensagem: 'Foto não encontrada para exclusão' });
    }

    return res.json({ sucesso: true, mensagem: 'Foto excluída com sucesso!' });
  } catch (error) {
    console.error('Erro ao deletar foto:', error);
    return res.status(500).json({ sucesso: false, mensagem: 'Erro ao deletar foto' });
  }
};