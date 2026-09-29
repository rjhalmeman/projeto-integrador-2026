const express = require('express');
const multer = require('multer');
const router = express.Router();
const produtoController = require('../controllers/produtoController');

// Configura o Multer para armazenar em memória temporária para o Sharp processar
const upload = multer({ storage: multer.memoryStorage() });

// Rotas do CRUD de Produtos
router.get('/listar', produtoController.listarProdutos);
router.get('/:id', produtoController.obterProduto);
router.post('/', produtoController.criarProduto);
router.put('/:id', produtoController.atualizarProduto);
router.delete('/:id', produtoController.deletarProduto);

// Rota para upload da imagem
router.post('/upload/:id', upload.single('imagem'), produtoController.uploadImagem);

module.exports = router;