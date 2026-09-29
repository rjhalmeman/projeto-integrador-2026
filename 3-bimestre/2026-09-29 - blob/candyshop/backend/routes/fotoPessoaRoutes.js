const express = require('express');
const router = express.Router();
const multer = require('multer');
const fotoPessoaController = require('../controllers/fotoPessoaController');

// Configura o multer para salvar temporariamente em memória (Buffer)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // Limite de 5MB por foto
});

// Salvar/Atualizar foto da pessoa
router.post('/', upload.single('foto'), fotoPessoaController.salvarFotoPessoa);

// Obter a foto da pessoa em formato de imagem/binário
router.get('/:cpf', fotoPessoaController.obterFotoPessoa);

// Deletar a foto da pessoa
router.delete('/:cpf', fotoPessoaController.deletarFotoPessoa);

module.exports = router;