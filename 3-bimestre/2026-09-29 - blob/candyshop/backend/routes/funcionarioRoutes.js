const express = require('express');
const router = express.Router();
const funcionarioController = require('./../controllers/funcionarioController');

// CRUD de Funcionarios

router.get('/abrirCrudFuncionario', funcionarioController.abrirCrudFuncionario);
router.get('/', funcionarioController.listarFuncionarios);
router.post('/', funcionarioController.criarFuncionario);
router.get('/:id', funcionarioController.obterFuncionario);
router.put('/:id', funcionarioController.atualizarFuncionario);
router.delete('/:id', funcionarioController.deletarFuncionario);

module.exports = router;
