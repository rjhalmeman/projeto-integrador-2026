const express = require('express');
const router = express.Router();
const unidadeMedidaController = require('../controllers/unidadeMedidaController');

// Rotas do CRUD de Unidades de Medida
router.get('/listar', unidadeMedidaController.listarUnidadesMedida);
router.get('/:id', unidadeMedidaController.obterUnidadeMedida);
router.post('/', unidadeMedidaController.criarUnidadeMedida);
router.put('/:id', unidadeMedidaController.atualizarUnidadeMedida);
router.delete('/:id', unidadeMedidaController.deletarUnidadeMedida);

module.exports = router;