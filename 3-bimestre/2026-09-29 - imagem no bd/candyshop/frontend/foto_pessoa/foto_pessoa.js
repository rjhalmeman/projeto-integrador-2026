const URL_BASE = 'http://localhost:3001';

const selectPessoa = document.getElementById('selectPessoa');
const inputFoto = document.getElementById('inputFoto');
const imgPreview = document.getElementById('imgPreview');
const formFoto = document.getElementById('formFoto');
const btnDeletar = document.getElementById('btnDeletar');
const divMensagem = document.getElementById('mensagem');

const PLACEHOLDER_IMG = 'https://via.placeholder.com/180?text=Sem+Foto';

// 🔄 Função para carregar e preencher o select com as Pessoas do banco
async function carregarPessoas() {
  try {
    // Ajuste a URL abaixo de acordo com a sua rota do pessoaRoutes (ex: /pessoa ou /pessoa/listar)
    const response = await fetch(`${URL_BASE}/pessoa`);
    
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const data = await response.json();

    // Limpa e adiciona a opção padrão
    selectPessoa.innerHTML = '<option value="">-- Selecione uma Pessoa --</option>';

    // Identifica se os dados vieram como lista direta ou dentro de uma propriedade (ex: data.pessoas)
    const pessoas = Array.isArray(data) ? data : (data.pessoas || data.dados || []);

    if (pessoas.length === 0) {
      const option = document.createElement('option');
      option.value = "";
      option.textContent = "Nenhuma pessoa encontrada";
      selectPessoa.appendChild(option);
      return;
    }

    // Preenche o <select> com o CPF como valor e o Nome/CPF para exibição
    pessoas.forEach(p => {
      const cpf = p.cpf_pessoa || p.cpf;
      const nome = p.nome_pessoa || p.nome || 'Sem Nome';

      if (cpf) {
        const option = document.createElement('option');
        option.value = cpf;
        option.textContent = `${nome} (${cpf})`;
        selectPessoa.appendChild(option);
      }
    });

  } catch (error) {
    console.error('Erro ao carregar pessoas:', error);
    selectPessoa.innerHTML = '<option value="">Erro ao carregar lista de pessoas</option>';
    exibirMensagem('Não foi possível carregar a lista de pessoas.', false);
  }
}

// 📸 Atualiza a foto e os botões ao selecionar uma pessoa
async function aoSelecionarPessoa() {
  const cpf = selectPessoa.value;

  inputFoto.value = ''; // Limpa o campo de arquivo

  if (!cpf) {
    imgPreview.src = PLACEHOLDER_IMG;
    btnDeletar.style.display = 'none';
    return;
  }

  // Adiciona timestamp (?t=...) para evitar que o navegador use a imagem do cache
  const fotoUrl = `${URL_BASE}/foto_pessoa/${cpf}?t=${new Date().getTime()}`;

  try {
    const res = await fetch(fotoUrl);
    if (res.ok) {
      imgPreview.src = fotoUrl;
      btnDeletar.style.display = 'inline-block';
    } else {
      imgPreview.src = PLACEHOLDER_IMG;
      btnDeletar.style.display = 'none';
    }
  } catch {
    imgPreview.src = PLACEHOLDER_IMG;
    btnDeletar.style.display = 'none';
  }
}

// Pré-visualização local ao escolher um arquivo no input
inputFoto.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      imgPreview.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Envio do formulário (Salvar Foto)
formFoto.addEventListener('submit', async (e) => {
  e.preventDefault();

  const cpf = selectPessoa.value;
  const file = inputFoto.files[0];

  if (!cpf) {
    exibirMensagem('Por favor, selecione uma pessoa.', false);
    return;
  }

  if (!file) {
    exibirMensagem('Por favor, escolha uma imagem.', false);
    return;
  }

  const formData = new FormData();
  formData.append('pessoa_cpf_pessoa', cpf);
  formData.append('foto', file);

  try {
    const response = await fetch(`${URL_BASE}/foto_pessoa`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (data.sucesso) {
      exibirMensagem('Foto salva com sucesso!', true);
      aoSelecionarPessoa();
    } else {
      exibirMensagem(data.mensagem || 'Erro ao salvar foto', false);
    }
  } catch (error) {
    console.error(error);
    exibirMensagem('Erro de conexão ao salvar foto', false);
  }
});

// Exclusão da foto
btnDeletar.addEventListener('click', async () => {
  const cpf = selectPessoa.value;
  if (!cpf) return;

  if (!confirm('Deseja realmente remover a foto desta pessoa?')) return;

  try {
    const response = await fetch(`${URL_BASE}/foto_pessoa/${cpf}`, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (data.sucesso) {
      exibirMensagem('Foto removida com sucesso!', true);
      aoSelecionarPessoa();
    } else {
      exibirMensagem(data.mensagem || 'Erro ao remover foto', false);
    }
  } catch (error) {
    console.error(error);
    exibirMensagem('Erro de conexão ao deletar foto', false);
  }
});

function exibirMensagem(texto, sucesso) {
  divMensagem.textContent = texto;
  divMensagem.className = `mensagem ${sucesso ? 'sucesso' : 'erro'}`;
  setTimeout(() => {
    divMensagem.textContent = '';
    divMensagem.className = 'mensagem';
  }, 4000);
}

// Eventos e Inicialização
selectPessoa.addEventListener('change', aoSelecionarPessoa);
carregarPessoas();