// ===== POO: cada movimentação é um objeto da classe Transacao =====
class Transacao {
  constructor(id, descricao, tipo, categoria, valor, data) {
    this.id = id;
    this.descricao = descricao;
    this.tipo = tipo;            // "entrada" ou "saida"
    this.categoria = categoria;
    this.valor = Number(valor);
    this.data = data;            // formato AAAA-MM-DD
  }

  // Valor formatado em reais: R$ 25,00
  valorFormatado() {
    return Transacao.moeda(this.valor);
  }

  // Data formatada: 19/11/2026
  dataFormatada() {
    const [a, m, d] = this.data.split('-');
    return `${d}/${m}/${a}`;
  }

  static moeda(numero) {
    return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}

// ===== Constantes =====
const CATEGORIAS = {
  'Alimentação': '🍄',
  'Saúde':       '❤️',
  'Lazer':       '⭐',
  'Transporte':  '🚂',
  'Educação':    '📘',
  'Outros':      '🎲'
};
const CHAVE_STORAGE = 'superMoedasBros.transacoes';

// ===== Estado =====
let transacoes = carregar();

// ===== Elementos =====
const $ = (id) => document.getElementById(id);
const form = $('formulario');
const campos = {
  id: $('idEdicao'), descricao: $('descricao'), tipo: $('tipo'),
  categoria: $('categoria'), valor: $('valor'), data: $('data')
};

// ===== localStorage =====
function carregar() {
  try {
    const bruto = localStorage.getItem(CHAVE_STORAGE);
    if (bruto === null) return dadosIniciais();
    return JSON.parse(bruto).map(t =>
      new Transacao(t.id, t.descricao, t.tipo, t.categoria, t.valor, t.data));
  } catch (e) {
    return dadosIniciais();
  }
}

function salvar() {
  try {
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(transacoes));
  } catch (e) { /* storage indisponível: segue só em memória */ }
}

// Dados fictícios de exemplo (primeiro acesso)
function dadosIniciais() {
  return [
    new Transacao(1, 'Mesada do Toad', 'entrada', 'Outros', 150, '2026-11-02'),
    new Transacao(2, 'Venda de cogumelos', 'entrada', 'Outros', 80, '2026-11-08'),
    new Transacao(3, 'Almoço no restaurante', 'saida', 'Alimentação', 25, '2026-11-19'),
    new Transacao(4, 'Passagem de trem', 'saida', 'Transporte', 12.5, '2026-11-10'),
    new Transacao(5, 'Cinema com a Peach', 'saida', 'Lazer', 40, '2026-11-14'),
    new Transacao(6, 'Livro de matemática', 'saida', 'Educação', 55, '2026-11-05')
  ];
}

// ===== Utilitários =====
function proximoId() {
  return transacoes.reduce((max, t) => Math.max(max, t.id), 0) + 1;
}

// Evita injeção de HTML ao exibir a descrição digitada
function esc(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

function hoje() {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}

// ===== Preencher selects =====
function montarCategorias() {
  campos.categoria.innerHTML = Object.keys(CATEGORIAS)
    .map(c => `<option value="${c}">${CATEGORIAS[c]} ${c}</option>`).join('');

  $('filtroCategoria').innerHTML =
    '<option value="todas">🌍 Todas as categorias</option>' +
    Object.keys(CATEGORIAS)
      .map(c => `<option value="${c}">${CATEGORIAS[c]} ${c}</option>`).join('');
}

// ===== Resumo financeiro =====
function atualizarResumo() {
  const entradas = transacoes.filter(t => t.tipo === 'entrada')
    .reduce((soma, t) => soma + t.valor, 0);
  const saidas = transacoes.filter(t => t.tipo === 'saida')
    .reduce((soma, t) => soma + t.valor, 0);
  const saldo = entradas - saidas;

  $('totalEntradas').textContent = Transacao.moeda(entradas);
  $('totalSaidas').textContent = Transacao.moeda(saidas);
  $('saldoAtual').textContent = Transacao.moeda(saldo);
  $('blocoSaldo').classList.toggle('negativo', saldo < 0);
}

// ===== Listagem (com busca e filtro) =====
function listar() {
  const termo = $('busca').value.trim().toLowerCase();
  const cat = $('filtroCategoria').value;

  const visiveis = transacoes
    .filter(t => t.descricao.toLowerCase().includes(termo))
    .filter(t => cat === 'todas' || t.categoria === cat)
    .sort((a, b) => b.data.localeCompare(a.data) || b.id - a.id);

  $('lista').innerHTML = visiveis.map(t => `
    <li class="item ${t.tipo}">
      <div class="item-icone" aria-hidden="true">${CATEGORIAS[t.categoria] || '🎲'}</div>
      <div>
        <div class="item-desc">${esc(t.descricao)}</div>
        <div class="item-meta">${t.tipo === 'entrada' ? '🪙 Entrada' : '🔥 Saída'} • ${t.categoria} • ${t.dataFormatada()}</div>
      </div>
      <div class="item-valor">${t.tipo === 'entrada' ? '+' : '-'} ${t.valorFormatado()}</div>
      <div class="item-acoes">
        <button class="mini editar" data-acao="editar" data-id="${t.id}">✏️ EDITAR</button>
        <button class="mini excluir" data-acao="excluir" data-id="${t.id}">🗑️ EXCLUIR</button>
      </div>
    </li>`).join('');

  $('vazio').hidden = visiveis.length > 0;
}

function atualizarTela() {
  atualizarResumo();
  listar();
}

// ===== Formulário: cadastrar / editar =====
function limparFormulario() {
  form.reset();
  campos.id.value = '';
  campos.data.value = hoje();
  $('erro').textContent = '';
  $('tituloForm').textContent = '➕ NOVA FASE';
  $('btnSalvar').textContent = '▶ SALVAR';
  $('btnCancelar').hidden = true;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const descricao = campos.descricao.value.trim();
  const valor = parseFloat(campos.valor.value);
  const data = campos.data.value;

  if (!descricao) return mostrarErro('Digite uma descrição!');
  if (!(valor > 0)) return mostrarErro('O valor precisa ser maior que zero!');
  if (!data) return mostrarErro('Escolha uma data!');

  const idEdicao = Number(campos.id.value);

  if (idEdicao) {
    const t = transacoes.find(x => x.id === idEdicao);
    t.descricao = descricao;
    t.tipo = campos.tipo.value;
    t.categoria = campos.categoria.value;
    t.valor = valor;
    t.data = data;
  } else {
    transacoes.push(new Transacao(
      proximoId(), descricao, campos.tipo.value, campos.categoria.value, valor, data));
  }

  salvar();
  limparFormulario();
  atualizarTela();
});

function mostrarErro(msg) {
  $('erro').textContent = '⚠ ' + msg;
}

$('btnCancelar').addEventListener('click', limparFormulario);

// ===== Ações da lista (editar / excluir) =====
$('lista').addEventListener('click', (e) => {
  const botao = e.target.closest('button[data-acao]');
  if (!botao) return;
  const id = Number(botao.dataset.id);

  if (botao.dataset.acao === 'excluir') {
    const t = transacoes.find(x => x.id === id);
    if (confirm(`Excluir "${t.descricao}"?`)) {
      transacoes = transacoes.filter(x => x.id !== id);
      salvar();
      if (Number(campos.id.value) === id) limparFormulario();
      atualizarTela();
    }
  } else {
    const t = transacoes.find(x => x.id === id);
    campos.id.value = t.id;
    campos.descricao.value = t.descricao;
    campos.tipo.value = t.tipo;
    campos.categoria.value = t.categoria;
    campos.valor.value = t.valor;
    campos.data.value = t.data;
    $('erro').textContent = '';
    $('tituloForm').textContent = '✏️ EDITAR FASE';
    $('btnSalvar').textContent = '▶ ATUALIZAR';
    $('btnCancelar').hidden = false;
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    campos.descricao.focus();
  }
});

// ===== Busca e filtro =====
$('busca').addEventListener('input', listar);
$('filtroCategoria').addEventListener('change', listar);

// ===== Início =====
montarCategorias();
limparFormulario();
atualizarTela();
