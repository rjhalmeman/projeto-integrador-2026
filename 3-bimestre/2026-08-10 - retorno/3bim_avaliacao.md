# DW1 - 2º Bimestre - Avaliação (Projeto) - 2026

## 📅 Data de Entrega
* **30/06/2026** – terça-feira (Data unificada para todas as equipes: **Sellf**, **Odonto Top**, **GYM IO** , **FinControl** e **Caminhos Vivos** ). 
* Uma pessoa da equipe apresenta para o professor o que foi feito. Pode ser a mesma pessoa do bimestre anterior.
* Temos 3 aulas no dia 30/06, são 150 minutos divididos em 5 equipes. Logo, até 30 minutos por equipe.
* Todos vão apresentar no mesmo dia, deste modo, a ordem é irrelevante.
---

## 🎯 Objetivo 

O objetivo desta avaliação prática é consolidar os conhecimentos em **desenvolvimento web fullstack**, avançando na construção da arquitetura de um sistema real. Nesta etapa, o foco está na **persistência de dados** e na **modularização do código**, garantindo que a base  do software seja sólida antes da implementação da regra de negócio principal.

O projeto terá valor de 
 até **5,0 pontos** para quem fizer apresentação no bimestre. 
 até 10,0 pontos para quem já fez apresentação em outros bimestres ou não apresentou ainda.

## 📦 Funcionalidades Obrigatórias (Escopo do 2º Bimestre)

O sistema deve apresentar no mínimo:

### 1. 🔐 Controle de Acesso (Autenticação)
* **Validação de Credenciais:** O processo de login deve validar os dados informados contra os registros reais armazenados no **banco de dados**.
* **Gestão de Estado:** A manutenção da sessão do usuário logado deve ser feita obrigatoriamente utilizando **cookies**, garantindo a persistência do estado de forma segura entre as requisições HTTP.

### 2. 🏠 Interface do Usuário (Menu Principal)
* **Contexto de Sessão:** Exibir de forma dinâmica o **nome do usuário autenticado**.
* **Encerramento de Sessão:** Disponibilizar uma opção clara de **logout** para destruir o cookie de sessão e redirecionar o usuário com segurança.

### 3. 🗂️ Persistência de Dados (CRUD Completo) para todas as entidades que não sejam o núcleo do sistema.
* **Operações Fundamentais:** Implementar o ciclo completo de **CRUD** (**Create, Read, Update e Delete**) para **todas as tabelas secundárias e de apoio** do banco de dados.
* **A Regra da Tabela Nuclear:** **NÃO** deve ser implementado o CRUD da **tabela nuclear** (a tabela central e mais importante do modelo de negócios). O objetivo neste bimestre é dominar a manipulação das tabelas periféricas que dão suporte à entidade principal, preparando o terreno para as regras de negócio complexas do próximo bimestre.

---

## 🏗️ Estrutura Arquitetural do Projeto

O ecossistema da aplicação deve ser rigorosamente dividido entre **frontend** (camada de apresentação) e **backend** (camada de lógica e dados), adotando o padrão **MVC (Model-View-Controller)** ou uma arquitetura em camadas equivalente que garanta a **separação de conceitos (Separation of Concerns)**.

### 🔧 Backend (Node.js)

O servidor deve ser modular, separando a escuta de requisições, o roteamento, as regras de validação e o acesso aos dados. Estrutura mínima exigida:

```text
backend/
  ├── server/       # Inicialização do servidor HTTP e middlewares
  ├── routes/       # Definição dos endpoints (rotas da API)
  ├── controllers/  # Intermediação e lógica de controle das requisições
  ├── models/       # Abstração das tabelas e consultas ao banco de dados
  └── config/       # Parâmetros de configuração (conexão com o banco, variáveis de ambiente)
```

* **Conexão Segura:** Centralizar as configurações de conexão com o banco.
* **Roteamento Isolado:** As rotas devem apenas direcionar as requisições para seus respectivos controladores.
* **Controladores Puros:** Os arquivos dentro de `controllers/` não devem conter consultas SQL diretas; eles gerenciam a requisição HTTP e chamam os métodos do `models/`.

---

### 💻 Frontend

Para a construção da interface, a equipe deve optar por uma das duas abordagens metodológicas abaixo:

#### ✔️ Opção 1 (Recomendada): Abordagem Componentizada (React + Vite)
* Utilização do ecossistema moderno do **React** com **Vite** para inicialização rápida.
* Organização estruturada em **componentes reutilizáveis**, **hooks customizados** e gerenciamento de estado local/global.

#### ✔️ Opção 2 (Simples): Abordagem Tradicional (HTML + CSS + JS Puro)
* Construção utilizando **Vanilla JavaScript**, **HTML5** estrutural e **CSS3** para estilização.
* Organização baseada em pastas por **funcionalidade** (ex: uma pasta específica para gerenciar cada fluxo de CRUD).

---

## 🗃️ Camada de Dados (Banco de Dados)

* usar um **Sistema Gerenciador de Banco de Dados (SGBD)**.

---

## 📁 Controle de Versão e Repositório (GitHub)

O ciclo de vida do desenvolvimento deve ser registrado e gerenciado via Git.

* **Gerenciamento de Tarefas:** Utilização obrigatória do **GitHub Projects** para rastrear o progresso das atividades de cada integrante (quadro Kanban).
* **Colaboração:** É indispensável adicionar o perfil do professor (**rjhalmeman**) como colaborador do repositório.

---

## 📚 Documentação Técnica

No diretório raiz do projeto, deve ser criada, impreterivelmente, uma pasta chamada:

```text
/Documentação
```

Este diretório funcionará como o manual de engenharia do software e deve conter os seguintes arquivos e especificações:

### 📄 1. Descrição do Sistema
* **Visão Geral:** Explicação detalhada do escopo completo do sistema (mesmo as partes que ainda não foram codificadas).
* **Stack Tecnológica:** Listagem explícita de todas as ferramentas, bibliotecas e frameworks adotados.
* **Justificativa Técnica:** Defesa argumentativa do porquê dessas escolhas tecnológicas frente ao problema proposto.

### 🖼️ 2. Wireframes
* **Arquitetura Visual:** Mapeamento visual das telas da aplicação completa.
* **Formatos Aceitos:** Podem ser diagramados em ferramentas de design (Figma, Adobe XD), desenhos à mão digitalizados ou capturas de tela das interfaces estruturadas.

### 🧩 3. DER (Diagrama Entidade-Relacionamento)
* **Modelagem de Dados:** Imagem nítida do modelo lógico e físico de dados.
* **Notação Padrão:** Preferencialmente utilizando a técnica **Crow’s Foot** (Pé de Galinha) para indicar a cardinalidade das relações.
* **Ferramental:** Sugere-se o uso do **DBeaver**, **draw.io** ou **dbdiagram.io**.

### 🗄️ 4. Scripts de Banco de Dados (.sql)
* **DDL (Data Definition Language):** Script completo de criação de tabelas, constraints, chaves primárias e estrangeiras.
* **DML (Data Manipulation Language):** Script de população inicial de dados para testar os fluxos de login e listagens primárias (massa de testes).

### ⚙️ 5. Guia de Configuração e Execução (ReadMe Técnico)
Instruções passo a passo para que qualquer desenvolvedor consiga rodar o projeto localmente, cobrindo:
1. Instalação e gerenciamento de **dependências** (comandos npm/yarn).
2. Configuração de variáveis de ambiente e **banco de dados**.
3. Comandos para inicialização do **backend**.
4. Comandos para inicialização do **frontend**.

---

## 🧠 Relatório Individual

O desenvolvimento de software envolve tomada de decisão e resolução de problemas. Portanto, **cada integrante da equipe** deve redigir um documento de autoavaliação contendo:

* Atividades e artefatos efetivamente produzidos no projeto pelo aluno.
* Conhecimentos teóricos e práticos adquiridos durante o bimestre.
* Maiores dificuldades técnicas encontradas e a metodologia aplicada para superá-las.

### 📏 Diretrizes do Relatório:
*  Mínimo de 1 página e máximo de 3 páginas.
*  Arquivo de texto puro em formato **Markdown (.md)**.
*  Salvar dentro da pasta `/Documentação` seguindo estritamente a máscara: `NomeIntegranteEquipe-Relatorio-2Bimestre.md`.

---

## 📊 Critérios de Avaliação


1. **Funcionamento Integral:** Os CRUDs das tabelas secundárias estão operantes, estáveis e integrados ao banco de dados? O fluxo de login protege as rotas privadas?
2. **Qualidade do Código:** Aplicação correta do padrão de arquitetura proposto, legibilidade, boas práticas de nomenclatura e ausência de códigos mortos.
3. **Documentação:** Presença de todos os artefatos técnicos exigidos dentro da pasta de documentação, incluindo os relatórios individuais.
4. **Apresentação:** Domínio técnico demonstrado na explicação da arquitetura e funcionamento do sistema.

