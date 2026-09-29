const API_BASE_URL = 'http://localhost:3001';
let currentPersonId = null;
let operacao = null;

// Elementos do DOM
const form = document.getElementById('pessoaForm');
const searchId = document.getElementById('searchId');
const btnBuscar = document.getElementById('btnBuscar');
const btnIncluir = document.getElementById('btnIncluir');
const btnAlterar = document.getElementById('btnAlterar');
const btnExcluir = document.getElementById('btnExcluir');
const btnCancelar = document.getElementById('btnCancelar');
const btnSalvar = document.getElementById('btnSalvar');
const pessoasTableBody = document.getElementById('pessoasTableBody');
const messageContainer = document.getElementById('messageContainer');

// Carregar lista de pessoas e popular menu de cargos ao inicializar
document.addEventListener('DOMContentLoaded', () => {
    carregarPessoas();
    popularCargosSelect();
});

// Event Listeners
btnBuscar.addEventListener('click', buscarPessoa);
btnIncluir.addEventListener('click', incluirPessoa);
btnAlterar.addEventListener('click', alterarPessoa);
btnExcluir.addEventListener('click', excluirPessoa);
btnCancelar.addEventListener('click', cancelarOperacao);
btnSalvar.addEventListener('click', salvarOperacao);

mostrarBotoes(true, false, false, false, false, false);
bloquearCampos(false);

function mostrarMensagem(texto, tipo = 'info') {
    messageContainer.innerHTML = `<div class="message ${tipo}">${texto}</div>`;
    setTimeout(() => {
        messageContainer.innerHTML = '';
    }, 3000);
}

function bloquearCampos(bloquearPrimeiro) {
    const inputs = document.querySelectorAll('input, select, checkbox');
    inputs.forEach((input, index) => {
        if (index === 0) {
            input.disabled = bloquearPrimeiro;
        } else {
            input.disabled = !bloquearPrimeiro;
        }
    });
}

function limparFormulario() {
    form.reset();
    document.getElementById('checkboxFuncionario').checked = false;
    document.getElementById('salario_funcionario').value = '';
    document.getElementById('cargo_id_cargo').value = '';
    document.getElementById('porcentagem_comissao_funcionario').value = '';

    document.getElementById('checkboxCliente').checked = false;
    document.getElementById('renda_cliente').value = '';
    document.getElementById('data_cadastro_cliente').value = '';
}

function mostrarBotoes(btBuscar, btIncluir, btAlterar, btExcluir, btSalvar, btCancelar) {
    btnBuscar.style.display = btBuscar ? 'inline-block' : 'none';
    btnIncluir.style.display = btIncluir ? 'inline-block' : 'none';
    btnAlterar.style.display = btAlterar ? 'inline-block' : 'none';
    btnExcluir.style.display = btExcluir ? 'inline-block' : 'none';
    btnSalvar.style.display = btSalvar ? 'inline-block' : 'none';
    btnCancelar.style.display = btCancelar ? 'inline-block' : 'none';
}

function formatarData(dataString) {
    if (!dataString) return '';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
}

function converterDataParaISO(dataString) {
    if (!dataString) return null;
    return new Date(dataString).toISOString();
}

function converterDataParaFormatoYYYYMMDD(isoDateString) {
    if (!isoDateString || typeof isoDateString !== 'string') {
        return '';
    }
    const partes = isoDateString.split('T');
    return partes.length > 0 ? partes[0] : '';
}

async function funcaoEhFuncionario(pessoaId) {
    try {
        const response = await fetch(`${API_BASE_URL}/funcionario/${pessoaId}`);
        const data = await response.json();

        if (response.ok && data.sucesso && data.funcionario) {
            return {
                ehFuncionario: true,
                salario_funcionario: data.funcionario.salario_funcionario,
                cargo_id_cargo: data.funcionario.cargo_id_cargo,
                porcentagem_comissao_funcionario: data.funcionario.porcentagem_comissao_funcionario
            };
        }
        return { ehFuncionario: false };
    } catch (error) {
        console.error('Erro ao verificar se é funcionario:', error);
        return { ehFuncionario: false };
    }
}

async function funcaoEhCliente(pessoaId) {
    try {
        const response = await fetch(`${API_BASE_URL}/cliente/${pessoaId}`);
        const data = await response.json();

        if (response.ok && (data.sucesso ? data.cliente : data)) {
            const clienteObj = data.cliente || data;
            return {
                ehCliente: true,
                renda_cliente: clienteObj.renda_cliente,
                data_cadastro_cliente: clienteObj.data_cadastro_cliente
            };
        }
        return { ehCliente: false };
    } catch (error) {
        console.error('Erro ao verificar se é cliente:', error);
        return { ehCliente: false };
    }
}

async function buscarPessoa() {
    const id = searchId.value.trim();
    if (!id) {
        mostrarMensagem('Digite um CPF para buscar', 'warning');
        return;
    }

    bloquearCampos(false);
    searchId.focus();
    try {
        const response = await fetch(`${API_BASE_URL}/pessoa/${id}`);
        const data = await response.json();

        if (response.ok && data.sucesso) {
            preencherFormulario(data.pessoa);
            mostrarBotoes(true, false, true, true, false, false);
            mostrarMensagem('Pessoa encontrada!', 'success');
        } else {
            limparFormulario();
            searchId.value = id;
            mostrarBotoes(true, true, false, false, false, false);
            mostrarMensagem('Pessoa não encontrada. Você pode incluir uma nova pessoa.', 'info');
            bloquearCampos(false);
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem('Erro ao buscar pessoa', 'error');
    }
}

async function preencherFormulario(pessoa) {
    currentPersonId = pessoa.cpf_pessoa;
    searchId.value = pessoa.cpf_pessoa;
    document.getElementById('nome_pessoa').value = pessoa.nome_pessoa || '';

    if (pessoa.data_nascimento_pessoa) {
        const data = new Date(pessoa.data_nascimento_pessoa);
        const dataFormatada = converterDataParaFormatoYYYYMMDD(data.toISOString());
        document.getElementById('data_nascimento').value = dataFormatada;
    } else {
        document.getElementById('data_nascimento').value = '';
    }
    document.getElementById('endereco_pessoa').value = pessoa.endereco_pessoa || '';
    document.getElementById('senha_pessoa').value = pessoa.senha_pessoa || '';
    document.getElementById('email_pessoa').value = pessoa.email_pessoa || '';

    // Verifica funcionário
    const ehFunc = await funcaoEhFuncionario(currentPersonId);
    if (ehFunc.ehFuncionario) {
        document.getElementById('checkboxFuncionario').checked = true;
        document.getElementById('cargo_id_cargo').value = ehFunc.cargo_id_cargo;
        document.getElementById('salario_funcionario').value = ehFunc.salario_funcionario;
        document.getElementById('porcentagem_comissao_funcionario').value = ehFunc.porcentagem_comissao_funcionario;
    } else {
        document.getElementById('checkboxFuncionario').checked = false;
        document.getElementById('cargo_id_cargo').value = '';
        document.getElementById('salario_funcionario').value = '';
        document.getElementById('porcentagem_comissao_funcionario').value = '';
    }

    // Verifica cliente
    const ehCli = await funcaoEhCliente(currentPersonId);
    if (ehCli.ehCliente) {
        document.getElementById('checkboxCliente').checked = true;
        document.getElementById('renda_cliente').value = ehCli.renda_cliente;
        document.getElementById('data_cadastro_cliente').value = converterDataParaFormatoYYYYMMDD(ehCli.data_cadastro_cliente);
    } else {
        document.getElementById('checkboxCliente').checked = false;
        document.getElementById('renda_cliente').value = '';
        document.getElementById('data_cadastro_cliente').value = '';
    }
}

async function incluirPessoa() {
    mostrarMensagem('Digite os dados!', 'success');
    currentPersonId = searchId.value;
    limparFormulario();
    searchId.value = currentPersonId;
    bloquearCampos(true);
    mostrarBotoes(false, false, false, false, true, true);
    document.getElementById('nome_pessoa').focus();
    operacao = 'incluir';
}

async function alterarPessoa() {
    mostrarMensagem('Digite os dados!', 'success');
    bloquearCampos(true);
    mostrarBotoes(false, false, false, false, true, true);
    document.getElementById('nome_pessoa').focus();
    operacao = 'alterar';
}

async function excluirPessoa() {
    mostrarMensagem('Excluindo pessoa...', 'info');
    currentPersonId = searchId.value;
    searchId.disabled = true;
    bloquearCampos(false);
    mostrarBotoes(false, false, false, false, true, true);
    operacao = 'excluir';
}

async function salvarOperacao() {
    const formData = new FormData(form);
    const pessoa = {
        cpf_pessoa: searchId.value.trim(),
        nome_pessoa: formData.get('nome_pessoa'),
        data_nascimento_pessoa: converterDataParaISO(formData.get('data_nascimento')) || null,
        endereco_pessoa: formData.get('endereco_pessoa'),
        senha_pessoa: formData.get('senha_pessoa'),
        email_pessoa: formData.get('email_pessoa')
    };

    let funcionario = null;
    if (document.getElementById('checkboxFuncionario').checked) {
        funcionario = {
            pessoa_cpf_pessoa: pessoa.cpf_pessoa,
            salario_funcionario: document.getElementById('salario_funcionario').value,
            cargo_id_cargo: parseInt(document.getElementById('cargo_id_cargo').value, 10),
            porcentagem_comissao_funcionario: document.getElementById('porcentagem_comissao_funcionario').value
        };
    }
    const caminhoFunc = `${API_BASE_URL}/funcionario/${currentPersonId}`;

    let cliente = null;
    if (document.getElementById('checkboxCliente').checked) {
        cliente = {
            pessoa_cpf_pessoa: pessoa.cpf_pessoa,
            renda_cliente: document.getElementById('renda_cliente').value,
            data_cadastro_cliente: document.getElementById('data_cadastro_cliente').value || null
        };
    }
    const caminhoCliente = `${API_BASE_URL}/cliente/${currentPersonId}`;

    try {
        let respPessoa = null;
        switch (operacao) {
            case 'incluir':
                respPessoa = await fetch(`${API_BASE_URL}/pessoa`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(pessoa)
                });
                const dataPessoaInc = await respPessoa.json();

                if (!dataPessoaInc.sucesso) {
                    throw new Error('Erro ao criar pessoa: ' + (dataPessoaInc.mensagem || respPessoa.status));
                }

                if (funcionario) {
                    await fetch(`${API_BASE_URL}/funcionario`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(funcionario)
                    });
                }

                if (cliente) {
                    await fetch(`${API_BASE_URL}/cliente`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(cliente)
                    });
                }

                mostrarMensagem('Pessoa incluída com sucesso!', 'success');
                limparFormulario();
                carregarPessoas();
                break;

            case 'alterar':
                respPessoa = await fetch(`${API_BASE_URL}/pessoa/${currentPersonId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(pessoa)
                });
                const dataPessoaAlt = await respPessoa.json();
                if (!dataPessoaAlt.sucesso) {
                    throw new Error('Erro ao alterar pessoa: ' + (dataPessoaAlt.mensagem || respPessoa.status));
                }

                // Trata Cliente
                if (document.getElementById('checkboxCliente').checked) {
                    const respVerifCli = await fetch(caminhoCliente);
                    if (respVerifCli.status === 404) {
                        await fetch(`${API_BASE_URL}/cliente`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(cliente)
                        });
                    } else {
                        await fetch(caminhoCliente, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(cliente)
                        });
                    }
                } else {
                    try {
                        const respCli = await fetch(caminhoCliente, { method: 'DELETE' });
                        const dataCli = await respCli.json().catch(() => ({}));
                        if (respCli.status === 409 || dataCli.sucesso === false) {
                            alert(dataCli.mensagem || 'Não foi possível remover o cliente');
                            document.getElementById('checkboxCliente').checked = true;
                        }
                    } catch (error) {
                        console.error('Erro ao excluir cliente:', error);
                    }
                }

                // Trata Funcionário
                if (document.getElementById('checkboxFuncionario').checked) {
                    const respVerifFunc = await fetch(caminhoFunc);
                    const dataVerifFunc = await respVerifFunc.json().catch(() => ({}));

                    if (respVerifFunc.status === 404 || !dataVerifFunc.sucesso) {
                        await fetch(`${API_BASE_URL}/funcionario`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(funcionario)
                        });
                    } else {
                        await fetch(caminhoFunc, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(funcionario)
                        });
                    }
                } else {
                    const respVerifFunc = await fetch(caminhoFunc);
                    const dataVerifFunc = await respVerifFunc.json().catch(() => ({}));
                    if (respVerifFunc.status === 200 && dataVerifFunc.sucesso) {
                        await fetch(caminhoFunc, { method: 'DELETE' });
                    }
                }

                mostrarMensagem('Pessoa alterada com sucesso!', 'success');
                limparFormulario();
                carregarPessoas();
                break;

            case 'excluir':
                const respCliDel = await fetch(caminhoCliente);
                if (respCliDel.status === 200) {
                    await fetch(caminhoCliente, { method: 'DELETE' });
                }

                const respFuncDel = await fetch(caminhoFunc);
                const dataFuncDel = await respFuncDel.json().catch(() => ({}));
                if (respFuncDel.status === 200 && dataFuncDel.sucesso) {
                    await fetch(caminhoFunc, { method: 'DELETE' });
                }

                const respDelPessoa = await fetch(`${API_BASE_URL}/pessoa/${currentPersonId}`, { method: 'DELETE' });
                const dataDelPessoa = await respDelPessoa.json();

                if (!dataDelPessoa.sucesso) {
                    throw new Error('Erro ao excluir pessoa: ' + (dataDelPessoa.mensagem || respDelPessoa.status));
                }

                mostrarMensagem('Pessoa excluída com sucesso!', 'success');
                limparFormulario();
                carregarPessoas();
                break;
        }
    } catch (error) {
        console.error('Erro salvarOperacao:', error);
        mostrarMensagem(error.message || 'Erro ao processar operação', 'error');
    } finally {
        mostrarBotoes(true, false, false, false, false, false);
        bloquearCampos(false);
        document.getElementById('searchId').focus();
    }
}

function cancelarOperacao() {
    limparFormulario();
    mostrarBotoes(true, false, false, false, false, false);
    bloquearCampos(false);
    document.getElementById('searchId').focus();
    mostrarMensagem('Operação cancelada', 'info');
}

async function carregarPessoas() {
    try {
        const response = await fetch(`${API_BASE_URL}/pessoa`);
        const data = await response.json();

        if (response.ok && data.sucesso) {
            renderizarTabelaPessoas(data.pessoas);
        } else {
            throw new Error(data.mensagem || 'Erro ao carregar pessoas');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem('Erro ao carregar lista de pessoas', 'error');
    }
}

function renderizarTabelaPessoas(pessoas) {
    pessoasTableBody.innerHTML = '';

    pessoas.forEach(pessoa => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <button class="btn-id" onclick="selecionarPessoa(${pessoa.cpf_pessoa})">
                    ${pessoa.cpf_pessoa}
                </button>
            </td>
            <td>${pessoa.nome_pessoa}</td>
            <td>${formatarData(pessoa.data_nascimento_pessoa)}</td>                 
            <td>${pessoa.endereco_pessoa}</td>
            <td>${pessoa.senha_pessoa}</td>
            <td>${pessoa.email_pessoa}</td>
        `;
        pessoasTableBody.appendChild(row);
    });
}

async function selecionarPessoa(id) {
    searchId.value = id;
    await buscarPessoa();
}

// Busca os cargos no backend e preenche o select
async function popularCargosSelect() {
    const selectCargo = document.getElementById('cargo_id_cargo');
    selectCargo.innerHTML = '<option value="">Cargo</option>';

    try {
        const response = await fetch(`${API_BASE_URL}/cargo/listar`);
        const data = await response.json();

        if (data.sucesso && Array.isArray(data.cargos)) {
            data.cargos.forEach(cargo => {
                const option = document.createElement('option');
                option.value = cargo.id_cargo;
                option.textContent = cargo.nome_cargo;
                selectCargo.appendChild(option);
            });
        } else {
            console.error('Erro ao listar cargos:', data.mensagem);
        }
    } catch (error) {
        console.error('Falha ao popular o menu de cargos:', error);
        const optionErro = document.createElement('option');
        optionErro.textContent = 'Erro ao carregar cargos';
        optionErro.disabled = true;
        selectCargo.appendChild(optionErro);
    }
}