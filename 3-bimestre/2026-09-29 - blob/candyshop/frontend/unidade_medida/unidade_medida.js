const URL_API = 'http://localhost:3001';

let oQueEstaFazendo = '';
let unidadeMedida = null;
bloquearAtributos(true);

async function procurePorChavePrimaria(chave) {
    try {
        const resposta = await fetch(`${URL_API}/unidade_medida/${chave}`);
        const data = await resposta.json();
        return data.sucesso ? data.unidade : null;
    } catch (erro) {
        return null;
    }
}

async function procure() {
    const id_unidade_medida = document.getElementById("inputId_unidade_medida").value.trim().toUpperCase();
    if (!id_unidade_medida || id_unidade_medida.length > 2) {
        mostrarAviso("O ID/Sigla deve conter de 1 a 2 caracteres (ex: KG, UN).");
        return;
    }

    document.getElementById("inputId_unidade_medida").value = id_unidade_medida;
    unidadeMedida = await procurePorChavePrimaria(id_unidade_medida);
    oQueEstaFazendo = '';
    
    if (unidadeMedida) {
        mostrarDadosUnidade(unidadeMedida);
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
    mostrarAviso("INSERINDO - Digite o nome da unidade e clique em salvar");
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
    const id_unidade_medida = document.getElementById("inputId_unidade_medida").value.trim().toUpperCase();
    const nome_unidade_medida = document.getElementById("inputNome_unidade_medida").value;

    const dadosUnidade = { id_unidade_medida, nome_unidade_medida };

    try {
        if (oQueEstaFazendo === 'inserindo') {
            const resp = await fetch(`${URL_API}/unidade_medida`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dadosUnidade) });
            const data = await resp.json();
            if (!data.sucesso) return mostrarAviso(data.mensagem);
            mostrarAviso("Inserido no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'alterando') {
            const resp = await fetch(`${URL_API}/unidade_medida/${id_unidade_medida}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dadosUnidade) });
            const data = await resp.json();
            if (!data.sucesso) return mostrarAviso(data.mensagem);
            mostrarAviso("Alterado no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'excluindo') {
            const resposta = await fetch(`${URL_API}/unidade_medida/${id_unidade_medida}`, { method: 'DELETE' });
            const data = await resposta.json();
            if (!data.sucesso) {
                mostrarAviso(data.mensagem || "Erro ao excluir no servidor.");
                return;
            }
            mostrarAviso("Excluído do Banco de Dados!");
        }

        visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
        limparAtributos();
        document.getElementById("inputId_unidade_medida").value = "";
        listar();
    } catch (erro) {
        mostrarAviso("Erro ao efetuar operação no servidor.");
    }
}

async function listar() {
    try {
        const resposta = await fetch(`${URL_API}/unidade_medida/listar`);
        const data = await resposta.json();
        
        if (data.sucesso) {
            let texto = "";
            for (let linha of data.unidades) {
                texto += `<b>[${linha.id_unidade_medida}]</b> - ${linha.nome_unidade_medida}<br>`;
            }
            document.getElementById("outputSaida").innerHTML = texto || "Nenhuma unidade de medida cadastrada.";
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

function mostrarDadosUnidade(u) {
    document.getElementById("inputId_unidade_medida").value = u.id_unidade_medida;
    document.getElementById("inputNome_unidade_medida").value = u.nome_unidade_medida;
    bloquearAtributos(true);
}

function limparAtributos() {
    unidadeMedida = null;
    oQueEstaFazendo = '';
    document.getElementById("inputNome_unidade_medida").value = "";
    bloquearAtributos(true);
}

function bloquearAtributos(soLeitura) {
    document.getElementById("inputId_unidade_medida").readOnly = !soLeitura;
    document.getElementById("inputNome_unidade_medida").readOnly = soLeitura;
}

function visibilidadeDosBotoes(btP, btI, btA, btE, btS) {
    document.getElementById("btProcure").style.display = btP;
    document.getElementById("btInserir").style.display = btI;
    document.getElementById("btAlterar").style.display = btA;
    document.getElementById("btExcluir").style.display = btE;
    document.getElementById("btSalvar").style.display = btS;
    document.getElementById("btCancelar").style.display = btS;
}