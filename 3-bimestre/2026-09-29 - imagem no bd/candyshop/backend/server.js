const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Importa a função de consulta do banco
const { query } = require('./database');

// Importa as rotas
const produtoRoutes = require('./routes/produtoRoutes');
const unidadeMedidaRoutes = require('./routes/unidadeMedidaRoutes');
const cargoRoutes = require('./routes/cargoRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Servir imagens estáticas
app.use('/imagens', express.static(path.join(__dirname, '../imagens')));

// Definir Rotas
app.use('/produto', produtoRoutes);
app.use('/unidade_medida', unidadeMedidaRoutes);

// clienteRoutes tem que vir antes de pessoaRoutes
const clienteRoutes = require('./routes/clienteRoutes');
app.use('/cliente', clienteRoutes);

// funcionarioRoutes tem que vir antes de pessoaRoutes
const funcionarioRoutes = require('./routes/funcionarioRoutes');
app.use('/funcionario', funcionarioRoutes);

const pessoaRoutes = require('./routes/pessoaRoutes');
app.use('/pessoa', pessoaRoutes);

app.use('/cargo', cargoRoutes);

// --- ROTA DE FOTO PESSOA ---
const fotoPessoaRoutes = require('./routes/fotoPessoaRoutes');
app.use('/foto_pessoa', fotoPessoaRoutes);

const PORT = process.env.PORT || 3001;

// Inicializa o servidor e testa o PostgreSQL
app.listen(PORT, async () => {
    console.log(`\n=================================`);
    console.log(`🚀 Servidor executando na porta ${PORT}`);
    
    try {
        await query('SELECT 1');
        console.log(`✅ Banco de Dados ${process.env.DB_NAME} conectado com sucesso!`);
    } catch (error) {
        console.error(`❌ FALHA NA CONEXÃO COM O BANCO DE DADOS:`);
        console.error(`   Motivo: ${error.message}`);
        console.error(`👉 Ajuste o arquivo .env com a senha correta do seu PostgreSQL.`);
    }
    console.log(`=================================\n`);
});