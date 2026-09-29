const URL_API = 'http://localhost:3001';

let oQueEstaFazendo = '';
let cargo = null;
bloquearAtributos(true);

async function procurePorChavePrimaria(chave) {
    try {
        const resposta = await fetch(`${URL_API}/cargo/${chave}`);
        const data = await resposta.json();
        return data.sucesso ? data.cargo : null;
    } catch (erro) {
        return null;
    }
}

async function procure() {
    const id_cargo = parseInt(document.getElementById("inputId_cargo").value, 10);
    if (isNaN(id_cargo)) {
        mostrarAviso("O ID do Cargo não pode ser vazio e deve ser um número.");
        return;
    }

    cargo = await procurePorChavePrimaria(id_cargo);
    oQueEstaFazendo = '';
    
    if (cargo) {
        mostrarDadosCargo(cargo);
        visibilidadeDosBotoes('inline', 'none', 'inline', 'inline', 'none');
        mostrarAviso("Achou no banco, pode alterar ou excluir");
    } else {
        limparAtributos();
        visibilidadeDosBotoes('inline', 'inline', 'none', 'none', 'none');
        mostrarAviso("Não achou no banco, pode inserir");
    }
}

function inserir() {
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'inserindo';
    mostrarAviso("INSERINDO - Digite o nome do cargo e clique em salvar");
}

function alterar() {
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'alterando';
    mostrarAviso("ALTERANDO - Digite o novo nome e clique em salvar");
}

function excluir() {
    bloquearAtributos(true);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'excluindo';
    mostrarAviso("EXCLUINDO - Clique em salvar para confirmar a exclusão");
}

async function salvar() {
    const id_cargo = parseInt(document.getElementById("inputId_cargo").value, 10);
    const nome_cargo = document.getElementById("inputNome_cargo").value.trim();

    if (isNaN(id_cargo)) {
        mostrarAviso("O ID do cargo deve ser um número válido.");
        return;
    }

    const dadosCargo = { id_cargo, nome_cargo };

    try {
        if (oQueEstaFazendo === 'inserindo') {
            const resp = await fetch(`${URL_API}/cargo`, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(dadosCargo) 
            });
            const data = await resp.json();
            if (!data.sucesso) return mostrarAviso(data.mensagem);
            mostrarAviso("Inserido no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'alterando') {
            const resp = await fetch(`${URL_API}/cargo/${id_cargo}`, { 
                method: 'PUT', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(dadosCargo) 
            });
            const data = await resp.json();
            if (!data.sucesso) return mostrarAviso(data.mensagem);
            mostrarAviso("Alterado no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'excluindo') {
            const resposta = await fetch(`${URL_API}/cargo/${id_cargo}`, { method: 'DELETE' });
            const data = await resposta.json();
            if (!data.sucesso) {
                mostrarAviso(data.mensagem || "Erro ao excluir no servidor.");
                return;
            }
            mostrarAviso("Excluído do Banco de Dados!");
        }

        visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
        limparAtributos();
        document.getElementById("inputId_cargo").value = "";
        listar();
    } catch (erro) {
        mostrarAviso("Erro ao efetuar operação no servidor.");
    }
}

async function listar() {
    try {
        const resposta = await fetch(`${URL_API}/cargo/listar`);

       
        const data = await resposta.json();
       // alert("teste "+stringify(dada))
        if (data.sucesso) {
            let texto = "";
            for (let linha of data.cargos) {
                texto += `<b>[${linha.id_cargo}]</b> - ${linha.nome_cargo}<br>`;
            }
            document.getElementById("outputSaida").innerHTML = texto || "Nenhum cargo cadastrado.";
        } else {
            document.getElementById("outputSaida").innerHTML = `Erro no banco: ${data.mensagem}`;
        }
    } catch (erro) {
        console.error("Erro ao listar:", erro);
        document.getElementById("outputSaida").innerHTML = "Servidor offline ou erro de conexão (CORS).";
    }
}

function cancelarOperacao() {
    limparAtributos();
    bloquearAtributos(true);
    visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
    mostrarAviso("Cancelou a operação");
}

function mostrarAviso(mensagem) {
    document.getElementById("divAviso").innerHTML = mensagem;
}

function mostrarDadosCargo(u) {
    document.getElementById("inputId_cargo").value = u.id_cargo;
    document.getElementById("inputNome_cargo").value = u.nome_cargo;
    bloquearAtributos(true);
}

function limparAtributos() {
    cargo = null;
    oQueEstaFazendo = '';
    document.getElementById("inputNome_cargo").value = "";
    bloquearAtributos(true);
}

function bloquearAtributos(soLeitura) {
    document.getElementById("inputId_cargo").readOnly = !soLeitura;
    document.getElementById("inputNome_cargo").readOnly = soLeitura;
}

function visibilidadeDosBotoes(btP, btI, btA, btE, btS) {
    document.getElementById("btProcure").style.display = btP;
    document.getElementById("btInserir").style.display = btI;
    document.getElementById("btAlterar").style.display = btA;
    document.getElementById("btExcluir").style.display = btE;
    document.getElementById("btSalvar").style.display = btS;
    document.getElementById("btCancelar").style.display = btS;
}