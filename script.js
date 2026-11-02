/* =========================================================
   SISTEMA DE CONTROLE DE ESTOQUE — FÁBRICA DE BOTINAS
   script.js
   Todos os dados são salvos automaticamente no navegador
   (localStorage). Ao fechar e abrir de novo, tudo continua lá.
   ========================================================= */

(function () {
  'use strict';

  /* ---------------- Configuração ---------------- */
  const CHAVE_DADOS = 'estoque_botinas_dados_v1';
  const CHAVE_TEMA = 'estoque_tema';

  const CATEGORIAS_PADRAO = ['Linhas', 'Agulhas', 'Lixas', 'Couro', 'Solados', 'Palmilhas', 'Colas e Adesivos', 'Ilhoses e Rebites', 'Cadarços', 'Elásticos', 'Embalagens', 'Outros'];
  const UNIDADES_PADRAO = ['un', 'cone', 'rolo', 'caixa', 'pacote', 'par', 'folha', 'm', 'm²', 'kg', 'L'];

  const EXEMPLOS = [
    { codigo: 'LIN-001', nome: 'Linha de nylon 40 – preta', categoria: 'Linhas', unidade: 'cone', quantidade: 24, minimo: 10, preco: 18.5, local: 'Almoxarifado A-1', fornecedor: '' },
    { codigo: 'LIN-002', nome: 'Linha de nylon 40 – marrom', categoria: 'Linhas', unidade: 'cone', quantidade: 6, minimo: 10, preco: 18.5, local: 'Almoxarifado A-1', fornecedor: '' },
    { codigo: 'AGU-001', nome: 'Agulha para máquina de costura nº 22', categoria: 'Agulhas', unidade: 'caixa', quantidade: 12, minimo: 5, preco: 32, local: 'Almoxarifado A-2', fornecedor: '' },
    { codigo: 'LIX-001', nome: 'Lixa grão 80', categoria: 'Lixas', unidade: 'folha', quantidade: 150, minimo: 50, preco: 1.9, local: 'Almoxarifado B-1', fornecedor: '' },
    { codigo: 'LIX-002', nome: 'Lixa grão 120', categoria: 'Lixas', unidade: 'folha', quantidade: 0, minimo: 50, preco: 1.9, local: 'Almoxarifado B-1', fornecedor: '' },
    { codigo: 'SOL-001', nome: 'Solado de borracha nº 40', categoria: 'Solados', unidade: 'par', quantidade: 80, minimo: 30, preco: 14, local: 'Depósito C', fornecedor: '' }
  ];

  /* ---------------- Estado ---------------- */
  let dados = carregar();
  let ordenacao = { campo: 'nome', direcao: 'asc' };

  function dadosVazios() {
    return { produtos: [], movimentos: [], categorias: CATEGORIAS_PADRAO.slice(), unidades: UNIDADES_PADRAO.slice(), ultimoBackup: null, sequencia: 1 };
  }

  function carregar() {
    try {
      const bruto = localStorage.getItem(CHAVE_DADOS);
      if (bruto) {
        const d = JSON.parse(bruto);
        return Object.assign(dadosVazios(), d);
      }
    } catch (e) { console.warn('Não foi possível ler os dados salvos.', e); }
    // Primeira vez: cria alguns produtos de exemplo
    const d = dadosVazios();
    const agora = new Date().toISOString();
    EXEMPLOS.forEach(function (p) {
      d.produtos.push(Object.assign({ id: gerarId(), descricao: '', criadoEm: agora, atualizadoEm: agora }, p));
    });
    d.sequencia = EXEMPLOS.length + 1;
    return d;
  }

  function salvar() {
    try {
      localStorage.setItem(CHAVE_DADOS, JSON.stringify(dados));
    } catch (e) {
      avisar('Não foi possível salvar no navegador. Faça um backup!', 'erro');
    }
  }

  /* ---------------- Utilidades ---------------- */
  function gerarId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }

  function esc(t) {
    return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function num(v) {
    const n = Number(v) || 0;
    return n.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
  }
  function moeda(v) { return (Number(v) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }
  function hojeISO() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function dataBR(iso) {
    if (!iso) return '';
    const p = iso.slice(0, 10).split('-');
    return p[2] + '/' + p[1] + '/' + p[0];
  }
  function horaBR(iso) {
    if (!iso || iso.length < 16) return '';
    return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }
  function normalizar(t) { return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function produtoPorId(id) { return dados.produtos.find(function (p) { return p.id === id; }); }

  function statusProduto(p) {
    if (p.quantidade <= 0) return 'zerado';
    if (p.minimo > 0 && p.quantidade <= p.minimo) return 'baixo';
    return 'ok';
  }
  const SELOS = {
    ok: '<span class="selo selo-ok">Em estoque</span>',
    baixo: '<span class="selo selo-baixo">Estoque baixo</span>',
    zerado: '<span class="selo selo-zerado">Zerado</span>'
  };

  const ICONES = {
    entrada: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7 7 7-7"/></svg>',
    saida: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12l7-7 7 7"/></svg>',
    editar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
    excluir: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>',
    alerta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4M12 17h.01"/><circle cx="12" cy="12" r="9"/></svg>'
  };

  /* ---------------- Avisos e confirmação ---------------- */
  function avisar(texto, tipo) {
    const el = document.createElement('div');
    el.className = 'aviso ' + (tipo || '');
    el.textContent = texto;
    $('#avisos').appendChild(el);
    setTimeout(function () { el.classList.add('saindo'); }, 2800);
    setTimeout(function () { el.remove(); }, 3200);
  }

  function confirmar(titulo, texto, rotuloSim) {
    return new Promise(function (resolver) {
      $('#confirmarTitulo').textContent = titulo;
      $('#confirmarTexto').textContent = texto;
      $('#confirmarSim').textContent = rotuloSim || 'Confirmar';
      const modal = $('#modalConfirmar');
      modal.hidden = false;
      function fim(r) {
        modal.hidden = true;
        $('#confirmarSim').onclick = null;
        $('#confirmarNao').onclick = null;
        resolver(r);
      }
      $('#confirmarSim').onclick = function () { fim(true); };
      $('#confirmarNao').onclick = function () { fim(false); };
    });
  }

  /* ---------------- Navegação ---------------- */
  function irPara(tela) {
    $$('.tela').forEach(function (t) { t.classList.toggle('ativa', t.id === 'tela-' + tela); });
    $$('.menu-item').forEach(function (m) { m.classList.toggle('ativo', m.dataset.ir === tela); });
    $('#menu').classList.remove('aberto');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    renderizarTudo();
  }

  document.addEventListener('click', function (e) {
    const ir = e.target.closest('[data-ir]');
    if (ir) {
      e.preventDefault();
      if (ir.dataset.filtroStatus) $('#filtroStatus').value = ir.dataset.filtroStatus;
      irPara(ir.dataset.ir);
      return;
    }
    const acao = e.target.closest('[data-acao]');
    if (acao) {
      const a = acao.dataset.acao;
      if (a === 'novo-produto') abrirModalProduto();
      if (a === 'mov-entrada' || a === 'mov-saida') {
        irPara('movimentar');
        const radio = document.querySelector('input[name="tipo"][value="' + (a === 'mov-entrada' ? 'entrada' : 'saida') + '"]');
        radio.checked = true;
        atualizarFormMovimento();
        setTimeout(function () { $('#movProduto').focus(); }, 300);
      }
    }
    if (e.target.closest('[data-fechar]')) {
      e.target.closest('.modal-fundo').hidden = true;
    }
  });

  $('#botaoMenuMobile').addEventListener('click', function () { $('#menu').classList.toggle('aberto'); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      $$('.modal-fundo').forEach(function (m) { if (m.id !== 'modalConfirmar') m.hidden = true; });
    }
  });
  $$('.modal-fundo').forEach(function (m) {
    m.addEventListener('mousedown', function (e) { if (e.target === m && m.id !== 'modalConfirmar') m.hidden = true; });
  });

  /* ---------------- Tema claro / escuro ---------------- */
  function aplicarTema(tema) {
    if (tema === 'escuro') document.documentElement.setAttribute('data-tema', 'escuro');
    else document.documentElement.removeAttribute('data-tema');
    $$('[data-tema-escolha]').forEach(function (b) {
      const ativo = b.dataset.temaEscolha === tema;
      b.classList.toggle('ativo', ativo);
      b.setAttribute('aria-pressed', ativo ? 'true' : 'false');
    });
    try { localStorage.setItem(CHAVE_TEMA, tema); } catch (e) {}
  }
  $('#botaoClaro').addEventListener('click', function () { aplicarTema('claro'); });
  $('#botaoEscuro').addEventListener('click', function () { aplicarTema('escuro'); });

  /* ---------------- Voltar ao topo ---------------- */
  const botaoTopo = $('#botaoTopo');
  window.addEventListener('scroll', function () {
    botaoTopo.classList.toggle('visivel', window.scrollY > 300);
  }, { passive: true });
  botaoTopo.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ---------------- Selects (categorias, unidades, produtos) ---------------- */
  function preencherSelects() {
    const cats = dados.categorias.slice().sort(function (a, b) { return a.localeCompare(b, 'pt-BR'); });
    const filtroCat = $('#filtroCategoria');
    const valorFiltro = filtroCat.value;
    filtroCat.innerHTML = '<option value="">Todas as categorias</option>' + cats.map(function (c) { return '<option>' + esc(c) + '</option>'; }).join('');
    filtroCat.value = valorFiltro;

    $('#prodCategoria').innerHTML = cats.map(function (c) { return '<option>' + esc(c) + '</option>'; }).join('');
    $('#prodUnidade').innerHTML = dados.unidades.map(function (u) { return '<option>' + esc(u) + '</option>'; }).join('');

    const movSel = $('#movProduto');
    const valorMov = movSel.value;
    const prods = dados.produtos.slice().sort(function (a, b) { return a.nome.localeCompare(b.nome, 'pt-BR'); });
    movSel.innerHTML = '<option value="">Selecione o produto...</option>' + prods.map(function (p) {
      return '<option value="' + p.id + '">' + esc(p.codigo ? p.codigo + ' — ' : '') + esc(p.nome) + ' (' + num(p.quantidade) + ' ' + esc(p.unidade) + ')</option>';
    }).join('');
    movSel.value = valorMov;
  }

  /* ---------------- PAINEL ---------------- */
  function renderizarPainel() {
    const hoje = hojeISO();
    const movHoje = dados.movimentos.filter(function (m) { return m.data === hoje; });
    const alertas = dados.produtos.filter(function (p) { return statusProduto(p) !== 'ok'; });
    const valorTotal = dados.produtos.reduce(function (s, p) { return s + (Number(p.preco) || 0) * Math.max(0, p.quantidade); }, 0);

    $('#kpiProdutos').textContent = num(dados.produtos.length);
    $('#kpiEntradas').textContent = num(movHoje.filter(function (m) { return m.tipo === 'entrada'; }).length);
    $('#kpiSaidas').textContent = num(movHoje.filter(function (m) { return m.tipo === 'saida'; }).length);
    $('#kpiBaixo').textContent = num(alertas.length);
    $('#kpiValor').textContent = moeda(valorTotal);

    // Alertas
    alertas.sort(function (a, b) { return a.quantidade - b.quantidade; });
    $('#listaAlertas').innerHTML = alertas.length ? alertas.slice(0, 8).map(function (p) {
      const st = statusProduto(p);
      return '<div class="item-lista">' +
        '<div class="bolinha ' + st + '">' + ICONES.alerta + '</div>' +
        '<div class="item-info"><strong>' + esc(p.nome) + '</strong><small>Mínimo: ' + num(p.minimo) + ' ' + esc(p.unidade) + ' · ' + esc(p.categoria) + '</small></div>' +
        '<span class="item-valor ' + (st === 'zerado' ? 'texto-saida' : '') + '">' + num(p.quantidade) + ' ' + esc(p.unidade) + '</span>' +
        '<button class="acao a-entrada" title="Dar entrada" data-rapido="entrada" data-id="' + p.id + '">' + ICONES.entrada + '</button>' +
        '</div>';
    }).join('') : '<div class="lista-vazia">✅ Nenhum produto com estoque baixo.</div>';

    // Últimas movimentações
    $('#listaUltimas').innerHTML = listaMovimentos(movimentosOrdenados().slice(0, 8), 'Nenhuma movimentação registrada ainda.');

    // Categorias
    const porCat = {};
    dados.produtos.forEach(function (p) { porCat[p.categoria] = (porCat[p.categoria] || 0) + 1; });
    const lista = Object.keys(porCat).map(function (c) { return { nome: c, qtd: porCat[c] }; }).sort(function (a, b) { return b.qtd - a.qtd; });
    const max = lista.length ? lista[0].qtd : 1;
    $('#graficoCategorias').innerHTML = lista.length ? lista.map(function (c) {
      return '<div class="barra-cat"><span class="barra-cat-nome">' + esc(c.nome) + '</span>' +
        '<div class="barra-cat-trilho"><div class="barra-cat-preenchimento" style="width:' + (c.qtd / max * 100) + '%"></div></div>' +
        '<span class="barra-cat-valor">' + c.qtd + (c.qtd === 1 ? ' produto' : ' produtos') + '</span></div>';
    }).join('') : '<div class="lista-vazia">Cadastre produtos para ver o resumo por categoria.</div>';
  }

  function movimentosOrdenados() {
    return dados.movimentos.slice().sort(function (a, b) {
      if (a.data !== b.data) return a.data < b.data ? 1 : -1;
      return (a.criadoEm || '') < (b.criadoEm || '') ? 1 : -1;
    });
  }

  function listaMovimentos(lista, textoVazio) {
    if (!lista.length) return '<div class="lista-vazia">' + textoVazio + '</div>';
    return lista.map(function (m) {
      const p = produtoPorId(m.produtoId);
      const nome = p ? p.nome : (m.produtoNome || 'Produto removido');
      const un = p ? p.unidade : (m.unidade || '');
      return '<div class="item-lista">' +
        '<div class="bolinha ' + m.tipo + '">' + ICONES[m.tipo] + '</div>' +
        '<div class="item-info"><strong>' + esc(nome) + '</strong><small>' + dataBR(m.data) + (horaBR(m.criadoEm) ? ' às ' + horaBR(m.criadoEm) : '') + (m.responsavel ? ' · ' + esc(m.responsavel) : '') + '</small></div>' +
        '<span class="item-valor texto-' + m.tipo + '">' + (m.tipo === 'entrada' ? '+' : '−') + num(m.quantidade) + ' ' + esc(un) + '</span>' +
        '</div>';
    }).join('');
  }

  /* ---------------- PRODUTOS ---------------- */
  function produtosFiltrados() {
    const busca = normalizar($('#buscaProduto').value);
    const cat = $('#filtroCategoria').value;
    const st = $('#filtroStatus').value;
    let lista = dados.produtos.filter(function (p) {
      if (cat && p.categoria !== cat) return false;
      const s = statusProduto(p);
      if (st === 'alerta' && s === 'ok') return false;
      if (st && st !== 'alerta' && s !== st) return false;
      if (busca) {
        const alvo = normalizar([p.nome, p.codigo, p.local, p.fornecedor, p.categoria, p.descricao].join(' '));
        if (alvo.indexOf(busca) === -1) return false;
      }
      return true;
    });
    const c = ordenacao.campo, dir = ordenacao.direcao === 'asc' ? 1 : -1;
    lista.sort(function (a, b) {
      const va = a[c], vb = b[c];
      if (typeof va === 'number' || typeof vb === 'number') return ((Number(va) || 0) - (Number(vb) || 0)) * dir;
      return String(va || '').localeCompare(String(vb || ''), 'pt-BR', { numeric: true }) * dir;
    });
    return lista;
  }

  function renderizarProdutos() {
    const lista = produtosFiltrados();
    $('#tabelaProdutos').innerHTML = lista.map(function (p) {
      const st = statusProduto(p);
      return '<tr>' +
        '<td class="codigo">' + esc(p.codigo || '—') + '</td>' +
        '<td class="nome-produto"><strong>' + esc(p.nome) + '</strong>' + (p.fornecedor || p.descricao ? '<small>' + esc(p.fornecedor || p.descricao) + '</small>' : '') + '</td>' +
        '<td><span class="selo selo-cat">' + esc(p.categoria) + '</span></td>' +
        '<td class="num"><span><span class="qtd-grande">' + num(p.quantidade) + '</span> ' + esc(p.unidade) + '</span></td>' +
        '<td class="num">' + num(p.minimo) + '</td>' +
        '<td>' + esc(p.local || '—') + '</td>' +
        '<td>' + SELOS[st] + '</td>' +
        '<td><div class="acoes">' +
          '<button class="acao a-entrada" title="Entrada" data-rapido="entrada" data-id="' + p.id + '">' + ICONES.entrada + '</button>' +
          '<button class="acao a-saida" title="Saída" data-rapido="saida" data-id="' + p.id + '">' + ICONES.saida + '</button>' +
          '<button class="acao" title="Editar" data-editar="' + p.id + '">' + ICONES.editar + '</button>' +
          '<button class="acao a-excluir" title="Excluir" data-excluir="' + p.id + '">' + ICONES.excluir + '</button>' +
        '</div></td>' +
      '</tr>';
    }).join('');
    rotularTabela('#tabelaProdutos');
    $('#produtosVazio').hidden = lista.length > 0;
    $('#resumoProdutos').textContent = lista.length + ' de ' + dados.produtos.length + ' produto(s) exibido(s).';

    $$('#tela-produtos th[data-ordenar]').forEach(function (th) {
      th.classList.remove('ordenado-asc', 'ordenado-desc');
      if (th.dataset.ordenar === ordenacao.campo) th.classList.add('ordenado-' + ordenacao.direcao);
    });
  }

  $$('#tela-produtos th[data-ordenar]').forEach(function (th) {
    th.addEventListener('click', function () {
      const c = th.dataset.ordenar;
      ordenacao = { campo: c, direcao: ordenacao.campo === c && ordenacao.direcao === 'asc' ? 'desc' : 'asc' };
      renderizarProdutos();
    });
  });
  ['#buscaProduto', '#filtroCategoria', '#filtroStatus'].forEach(function (s) {
    $(s).addEventListener('input', renderizarProdutos);
  });

  // Ações na tabela / listas
  document.addEventListener('click', function (e) {
    const r = e.target.closest('[data-rapido]');
    if (r) { abrirMovRapido(r.dataset.id, r.dataset.rapido); return; }
    const ed = e.target.closest('[data-editar]');
    if (ed) { abrirModalProduto(ed.dataset.editar); return; }
    const ex = e.target.closest('[data-excluir]');
    if (ex) { excluirProduto(ex.dataset.excluir); return; }
    const exm = e.target.closest('[data-excluir-mov]');
    if (exm) { excluirMovimento(exm.dataset.excluirMov); }
  });

  /* ----- Modal produto ----- */
  function proximoCodigo(categoria) {
    const prefixo = normalizar(categoria).replace(/[^a-z]/g, '').slice(0, 3).toUpperCase() || 'PRD';
    let n = 1;
    dados.produtos.forEach(function (p) {
      const m = String(p.codigo || '').match(new RegExp('^' + prefixo + '-(\\d+)$'));
      if (m) n = Math.max(n, Number(m[1]) + 1);
    });
    return prefixo + '-' + String(n).padStart(3, '0');
  }

  function abrirModalProduto(id) {
    const f = $('#formProduto');
    f.reset();
    preencherSelects();
    const p = id ? produtoPorId(id) : null;
    $('#tituloModalProduto').textContent = p ? 'Editar produto' : 'Novo produto';
    $('#prodId').value = p ? p.id : '';
    $('#campoQtdInicial').hidden = !!p;
    if (p) {
      $('#prodCodigo').value = p.codigo || '';
      $('#prodNome').value = p.nome;
      $('#prodCategoria').value = p.categoria;
      $('#prodUnidade').value = p.unidade;
      $('#prodMinimo').value = p.minimo;
      $('#prodPreco').value = p.preco || '';
      $('#prodLocal').value = p.local || '';
      $('#prodFornecedor').value = p.fornecedor || '';
      $('#prodDescricao').value = p.descricao || '';
    } else {
      $('#prodQuantidade').value = 0;
      $('#prodMinimo').value = 0;
    }
    $('#modalProduto').hidden = false;
    setTimeout(function () { $('#prodNome').focus(); }, 50);
  }

  $('#formProduto').addEventListener('submit', function (e) {
    e.preventDefault();
    const id = $('#prodId').value;
    const nome = $('#prodNome').value.trim();
    if (!nome) { avisar('Informe o nome do produto.', 'erro'); return; }
    const categoria = $('#prodCategoria').value;
    let codigo = $('#prodCodigo').value.trim().toUpperCase();
    if (!codigo) codigo = proximoCodigo(categoria);

    const repetido = dados.produtos.find(function (p) { return p.codigo === codigo && p.id !== id; });
    if (repetido) { avisar('Já existe um produto com o código ' + codigo + '.', 'erro'); return; }

    const agora = new Date().toISOString();
    const base = {
      codigo: codigo, nome: nome, categoria: categoria,
      unidade: $('#prodUnidade').value,
      minimo: Math.max(0, Number($('#prodMinimo').value) || 0),
      preco: Math.max(0, Number($('#prodPreco').value) || 0),
      local: $('#prodLocal').value.trim(),
      fornecedor: $('#prodFornecedor').value.trim(),
      descricao: $('#prodDescricao').value.trim(),
      atualizadoEm: agora
    };

    if (id) {
      Object.assign(produtoPorId(id), base);
      avisar('Produto atualizado com sucesso.');
    } else {
      const qtd = Math.max(0, Number($('#prodQuantidade').value) || 0);
      const novo = Object.assign({ id: gerarId(), quantidade: qtd, criadoEm: agora }, base);
      dados.produtos.push(novo);
      if (qtd > 0) {
        dados.movimentos.push({
          id: gerarId(), produtoId: novo.id, produtoNome: novo.nome, unidade: novo.unidade,
          tipo: 'entrada', quantidade: qtd, data: hojeISO(), responsavel: '',
          documento: '', obs: 'Estoque inicial (cadastro)', saldoApos: qtd, criadoEm: agora
        });
      }
      avisar('Produto cadastrado com sucesso.');
    }
    salvar();
    $('#modalProduto').hidden = true;
    renderizarTudo();
  });

  async function excluirProduto(id) {
    const p = produtoPorId(id);
    if (!p) return;
    const ok = await confirmar('Excluir produto', 'Deseja excluir "' + p.nome + '"? O histórico de movimentações dele será mantido.', 'Excluir');
    if (!ok) return;
    dados.produtos = dados.produtos.filter(function (x) { return x.id !== id; });
    salvar();
    renderizarTudo();
    avisar('Produto excluído.', 'info');
  }

  /* ---------------- MOVIMENTAÇÃO ---------------- */
  function registrarMovimento(produtoId, tipo, quantidade, data, responsavel, documento, obs) {
    const p = produtoPorId(produtoId);
    if (!p) { avisar('Selecione um produto.', 'erro'); return false; }
    quantidade = Number(quantidade);
    if (!(quantidade > 0)) { avisar('Informe uma quantidade maior que zero.', 'erro'); return false; }
    if (!data) { avisar('Informe a data.', 'erro'); return false; }
    if (tipo === 'saida' && quantidade > p.quantidade) {
      avisar('Saída maior que o estoque disponível (' + num(p.quantidade) + ' ' + p.unidade + ').', 'erro');
      return false;
    }
    p.quantidade = Math.round((p.quantidade + (tipo === 'entrada' ? quantidade : -quantidade)) * 1000) / 1000;
    p.atualizadoEm = new Date().toISOString();
    dados.movimentos.push({
      id: gerarId(), produtoId: p.id, produtoNome: p.nome, unidade: p.unidade,
      tipo: tipo, quantidade: quantidade, data: data,
      responsavel: (responsavel || '').trim(), documento: (documento || '').trim(), obs: (obs || '').trim(),
      saldoApos: p.quantidade, criadoEm: new Date().toISOString()
    });
    if (responsavel) { try { localStorage.setItem('estoque_responsavel', responsavel.trim()); } catch (e) {} }
    salvar();
    avisar((tipo === 'entrada' ? 'Entrada' : 'Saída') + ' de ' + num(quantidade) + ' ' + p.unidade + ' registrada — ' + p.nome);
    if (statusProduto(p) !== 'ok') setTimeout(function () { avisar('Atenção: "' + p.nome + '" está com estoque ' + (p.quantidade <= 0 ? 'zerado' : 'baixo') + '.', 'erro'); }, 400);
    return true;
  }

  function responsavelSalvo() { try { return localStorage.getItem('estoque_responsavel') || ''; } catch (e) { return ''; } }

  function tipoSelecionado() { return document.querySelector('input[name="tipo"]:checked').value; }

  function atualizarFormMovimento() {
    const tipo = tipoSelecionado();
    const botao = $('#botaoRegistrar');
    botao.textContent = tipo === 'entrada' ? 'Registrar entrada' : 'Registrar saída';
    botao.className = 'botao botao-grande ' + (tipo === 'entrada' ? 'botao-entrada' : 'botao-saida');
    $('#rotuloDocumento').textContent = tipo === 'entrada' ? 'Nota fiscal / Fornecedor' : 'Setor / Ordem de produção';
    $('#movDocumento').placeholder = tipo === 'entrada' ? 'Ex.: NF 1234' : 'Ex.: Costura – OP 58';

    const p = produtoPorId($('#movProduto').value);
    const info = $('#infoProduto');
    if (!p) { info.hidden = true; return; }
    const q = Number($('#movQuantidade').value) || 0;
    const depois = tipo === 'entrada' ? p.quantidade + q : p.quantidade - q;
    info.hidden = false;
    info.innerHTML = '<div><small>Estoque atual</small><span class="saldo">' + num(p.quantidade) + ' ' + esc(p.unidade) + '</span></div>' +
      '<div>' + SELOS[statusProduto(p)] + '</div>' +
      (q > 0 ? '<div class="previsao">Após ' + (tipo === 'entrada' ? 'entrada' : 'saída') + ': <b class="' + (depois < 0 ? 'texto-saida' : '') + '">' + num(depois) + ' ' + esc(p.unidade) + '</b></div>' : '');
  }

  $$('input[name="tipo"]').forEach(function (r) { r.addEventListener('change', atualizarFormMovimento); });
  $('#movProduto').addEventListener('change', atualizarFormMovimento);
  $('#movQuantidade').addEventListener('input', atualizarFormMovimento);

  $('#formMovimento').addEventListener('submit', function (e) {
    e.preventDefault();
    const ok = registrarMovimento($('#movProduto').value, tipoSelecionado(), $('#movQuantidade').value, $('#movData').value,
      $('#movResponsavel').value, $('#movDocumento').value, $('#movObs').value);
    if (ok) {
      $('#movQuantidade').value = '';
      $('#movDocumento').value = '';
      $('#movObs').value = '';
      renderizarTudo();
      $('#movQuantidade').focus();
    }
  });

  function renderizarMovimentar() {
    if (!$('#movData').value) $('#movData').value = hojeISO();
    if (!$('#movResponsavel').value) $('#movResponsavel').value = responsavelSalvo();
    const hoje = hojeISO();
    $('#listaHoje').innerHTML = listaMovimentos(movimentosOrdenados().filter(function (m) { return m.data === hoje; }), 'Nenhuma movimentação hoje.');
    atualizarFormMovimento();
  }

  /* ----- Movimento rápido (pelo botão da tabela) ----- */
  function abrirMovRapido(id, tipo) {
    const p = produtoPorId(id);
    if (!p) return;
    $('#formMovRapido').reset();
    $('#rapidoProdutoId').value = id;
    $('#rapidoTipo').value = tipo;
    $('#rapidoData').value = hojeISO();
    $('#rapidoResponsavel').value = responsavelSalvo();
    $('#tituloMovRapido').textContent = (tipo === 'entrada' ? 'Entrada' : 'Saída') + ' de material';
    $('#botaoRapido').className = 'botao ' + (tipo === 'entrada' ? 'botao-entrada' : 'botao-saida');
    $('#botaoRapido').textContent = tipo === 'entrada' ? 'Registrar entrada' : 'Registrar saída';
    $('#rapidoInfo').innerHTML = '<div><small>' + esc(p.codigo || '') + '</small><strong>' + esc(p.nome) + '</strong></div>' +
      '<div style="text-align:right"><small>Estoque atual</small><span class="saldo">' + num(p.quantidade) + ' ' + esc(p.unidade) + '</span></div>';
    $('#modalMovRapido').hidden = false;
    setTimeout(function () { $('#rapidoQuantidade').focus(); }, 50);
  }

  $('#formMovRapido').addEventListener('submit', function (e) {
    e.preventDefault();
    const ok = registrarMovimento($('#rapidoProdutoId').value, $('#rapidoTipo').value, $('#rapidoQuantidade').value,
      $('#rapidoData').value, $('#rapidoResponsavel').value, '', $('#rapidoObs').value);
    if (ok) { $('#modalMovRapido').hidden = true; renderizarTudo(); }
  });

  /* ---------------- HISTÓRICO ---------------- */
  function historicoFiltrado() {
    const busca = normalizar($('#buscaHistorico').value);
    const tipo = $('#filtroTipo').value;
    const de = $('#filtroDe').value, ate = $('#filtroAte').value;
    return movimentosOrdenados().filter(function (m) {
      if (tipo && m.tipo !== tipo) return false;
      if (de && m.data < de) return false;
      if (ate && m.data > ate) return false;
      if (busca) {
        const p = produtoPorId(m.produtoId);
        const alvo = normalizar([p ? p.nome : m.produtoNome, p ? p.codigo : '', m.responsavel, m.documento, m.obs].join(' '));
        if (alvo.indexOf(busca) === -1) return false;
      }
      return true;
    });
  }

  function renderizarHistorico() {
    const lista = historicoFiltrado();
    $('#tabelaHistorico').innerHTML = lista.map(function (m) {
      const p = produtoPorId(m.produtoId);
      const nome = p ? p.nome : (m.produtoNome || 'Produto removido') + ' (removido)';
      const un = p ? p.unidade : (m.unidade || '');
      const docObs = [m.documento, m.obs].filter(Boolean).join(' · ');
      return '<tr>' +
        '<td><span>' + dataBR(m.data) + '<br><small style="color:var(--texto-suave)">' + horaBR(m.criadoEm) + '</small></span></td>' +
        '<td><span class="selo selo-' + m.tipo + '">' + (m.tipo === 'entrada' ? 'Entrada' : 'Saída') + '</span></td>' +
        '<td class="nome-produto"><strong>' + esc(nome) + '</strong>' + (p && p.codigo ? '<small>' + esc(p.codigo) + '</small>' : '') + '</td>' +
        '<td class="num texto-' + m.tipo + '"><span><b>' + (m.tipo === 'entrada' ? '+' : '−') + num(m.quantidade) + '</b> ' + esc(un) + '</span></td>' +
        '<td class="num">' + (m.saldoApos != null ? num(m.saldoApos) + ' ' + esc(un) : '—') + '</td>' +
        '<td>' + esc(m.responsavel || '—') + '</td>' +
        '<td>' + esc(docObs || '—') + '</td>' +
        '<td><div class="acoes"><button class="acao a-excluir" title="Excluir e desfazer" data-excluir-mov="' + m.id + '">' + ICONES.excluir + '</button></div></td>' +
      '</tr>';
    }).join('');
    rotularTabela('#tabelaHistorico');
    $('#historicoVazio').hidden = lista.length > 0;

    const ent = lista.filter(function (m) { return m.tipo === 'entrada'; }).length;
    const sai = lista.length - ent;
    $('#resumoHistorico').innerHTML =
      '<span class="pilula">Registros: <b>' + lista.length + '</b></span>' +
      '<span class="pilula">Entradas: <b class="texto-entrada">' + ent + '</b></span>' +
      '<span class="pilula">Saídas: <b class="texto-saida">' + sai + '</b></span>';
  }
  ['#buscaHistorico', '#filtroTipo', '#filtroDe', '#filtroAte'].forEach(function (s) {
    $(s).addEventListener('input', renderizarHistorico);
  });

  async function excluirMovimento(id) {
    const m = dados.movimentos.find(function (x) { return x.id === id; });
    if (!m) return;
    const p = produtoPorId(m.produtoId);
    const texto = p
      ? 'Excluir esta ' + (m.tipo === 'entrada' ? 'entrada' : 'saída') + ' de ' + num(m.quantidade) + ' ' + p.unidade + '? O estoque de "' + p.nome + '" será ajustado automaticamente.'
      : 'Excluir este registro do histórico?';
    const ok = await confirmar('Excluir movimentação', texto, 'Excluir');
    if (!ok) return;
    if (p) {
      const novo = p.quantidade + (m.tipo === 'entrada' ? -m.quantidade : m.quantidade);
      if (novo < 0) { avisar('Não é possível excluir: o estoque ficaria negativo.', 'erro'); return; }
      p.quantidade = Math.round(novo * 1000) / 1000;
    }
    dados.movimentos = dados.movimentos.filter(function (x) { return x.id !== id; });
    salvar();
    renderizarTudo();
    avisar('Movimentação excluída e estoque ajustado.', 'info');
  }

  /* ---------------- Exportar planilha (CSV para Excel) ---------------- */
  function baixarArquivo(nome, conteudo, tipo) {
    const blob = new Blob([conteudo], { type: tipo });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = nome;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }
  function csv(linhas) {
    return '﻿' + linhas.map(function (l) {
      return l.map(function (v) { return '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"'; }).join(';');
    }).join('\r\n');
  }
  function numCsv(v) { return String(Number(v) || 0).replace('.', ','); }

  $('#exportarProdutosCsv').addEventListener('click', function () {
    const linhas = [['Código', 'Produto', 'Categoria', 'Quantidade', 'Unidade', 'Estoque mínimo', 'Custo unitário', 'Valor total', 'Local', 'Fornecedor', 'Status', 'Descrição']];
    produtosFiltrados().forEach(function (p) {
      const st = statusProduto(p);
      linhas.push([p.codigo, p.nome, p.categoria, numCsv(p.quantidade), p.unidade, numCsv(p.minimo), numCsv(p.preco), numCsv((p.preco || 0) * p.quantidade), p.local, p.fornecedor,
        st === 'ok' ? 'Em estoque' : st === 'baixo' ? 'Estoque baixo' : 'Zerado', p.descricao]);
    });
    baixarArquivo('estoque-produtos-' + hojeISO() + '.csv', csv(linhas), 'text/csv;charset=utf-8');
    avisar('Planilha de produtos gerada.');
  });

  $('#exportarHistoricoCsv').addEventListener('click', function () {
    const linhas = [['Data', 'Hora', 'Tipo', 'Código', 'Produto', 'Quantidade', 'Unidade', 'Saldo após', 'Responsável', 'Documento', 'Observação']];
    historicoFiltrado().forEach(function (m) {
      const p = produtoPorId(m.produtoId);
      linhas.push([dataBR(m.data), horaBR(m.criadoEm), m.tipo === 'entrada' ? 'Entrada' : 'Saída', p ? p.codigo : '', p ? p.nome : m.produtoNome,
        numCsv(m.quantidade), p ? p.unidade : m.unidade, m.saldoApos != null ? numCsv(m.saldoApos) : '', m.responsavel, m.documento, m.obs]);
    });
    baixarArquivo('estoque-historico-' + hojeISO() + '.csv', csv(linhas), 'text/csv;charset=utf-8');
    avisar('Planilha do histórico gerada.');
  });

  /* ---------------- Backup e ajustes ---------------- */
  $('#baixarBackup').addEventListener('click', function () {
    dados.ultimoBackup = new Date().toISOString();
    salvar();
    baixarArquivo('backup-estoque-botinas-' + hojeISO() + '.json', JSON.stringify(dados, null, 2), 'application/json');
    renderizarConfig();
    avisar('Backup baixado com sucesso.');
  });

  $('#restaurarBackup').addEventListener('change', function (e) {
    const arq = e.target.files[0];
    if (!arq) return;
    const leitor = new FileReader();
    leitor.onload = async function () {
      try {
        const d = JSON.parse(leitor.result);
        if (!Array.isArray(d.produtos) || !Array.isArray(d.movimentos)) throw new Error('formato');
        const ok = await confirmar('Restaurar backup', 'Isso vai substituir os dados atuais por ' + d.produtos.length + ' produto(s) e ' + d.movimentos.length + ' movimentação(ões) do arquivo. Continuar?', 'Restaurar');
        if (!ok) return;
        dados = Object.assign(dadosVazios(), d);
        salvar();
        renderizarTudo();
        avisar('Backup restaurado com sucesso.');
      } catch (err) {
        avisar('Arquivo de backup inválido.', 'erro');
      }
      e.target.value = '';
    };
    leitor.readAsText(arq);
  });

  $('#apagarTudo').addEventListener('click', async function () {
    const ok = await confirmar('Apagar todos os dados', 'Todos os produtos e o histórico serão apagados deste navegador. Essa ação não pode ser desfeita. Deseja continuar?', 'Apagar tudo');
    if (!ok) return;
    const d = dadosVazios();
    d.categorias = dados.categorias;
    d.unidades = dados.unidades;
    dados = d;
    salvar();
    renderizarTudo();
    avisar('Todos os dados foram apagados.', 'info');
  });

  function adicionarItemLista(lista, valor, nomeItem) {
    valor = valor.trim();
    if (!valor) return false;
    if (dados[lista].some(function (c) { return normalizar(c) === normalizar(valor); })) {
      avisar(nomeItem + ' já existe.', 'erro'); return false;
    }
    dados[lista].push(valor);
    salvar();
    renderizarTudo();
    avisar(nomeItem + ' "' + valor + '" adicionada.');
    return true;
  }

  $('#formCategoria').addEventListener('submit', function (e) {
    e.preventDefault();
    if (adicionarItemLista('categorias', $('#novaCategoria').value, 'Categoria')) $('#novaCategoria').value = '';
  });
  $('#formUnidade').addEventListener('submit', function (e) {
    e.preventDefault();
    if (adicionarItemLista('unidades', $('#novaUnidade').value, 'Unidade')) $('#novaUnidade').value = '';
  });

  document.addEventListener('click', async function (e) {
    const b = e.target.closest('[data-remover-cat], [data-remover-un]');
    if (!b) return;
    const ehCat = b.hasAttribute('data-remover-cat');
    const valor = ehCat ? b.dataset.removerCat : b.dataset.removerUn;
    const emUso = dados.produtos.some(function (p) { return ehCat ? p.categoria === valor : p.unidade === valor; });
    if (emUso) { avisar('Não é possível remover: há produtos usando "' + valor + '".', 'erro'); return; }
    const ok = await confirmar('Remover', 'Remover "' + valor + '"?', 'Remover');
    if (!ok) return;
    const lista = ehCat ? 'categorias' : 'unidades';
    dados[lista] = dados[lista].filter(function (x) { return x !== valor; });
    salvar();
    renderizarTudo();
  });

  function renderizarConfig() {
    $('#listaCategorias').innerHTML = dados.categorias.slice().sort(function (a, b) { return a.localeCompare(b, 'pt-BR'); }).map(function (c) {
      return '<span class="etiqueta">' + esc(c) + '<button title="Remover" data-remover-cat="' + esc(c) + '">×</button></span>';
    }).join('');
    $('#listaUnidades').innerHTML = dados.unidades.map(function (u) {
      return '<span class="etiqueta">' + esc(u) + '<button title="Remover" data-remover-un="' + esc(u) + '">×</button></span>';
    }).join('');
    $('#ultimoBackup').textContent = dados.ultimoBackup
      ? 'Último backup: ' + new Date(dados.ultimoBackup).toLocaleString('pt-BR')
      : 'Nenhum backup feito ainda.';
  }

  /* ---------------- Rodapé: aberto / fechado ---------------- */
  function atualizarStatusAberto() {
    const agora = new Date();
    const dia = agora.getDay(); // 0 = domingo, 6 = sábado
    const min = agora.getHours() * 60 + agora.getMinutes();
    const periodos = [[7 * 60 + 30, 10 * 60 + 30], [12 * 60 + 30, 17 * 60 + 30]];
    const aberto = dia >= 1 && dia <= 5 && periodos.some(function (p) { return min >= p[0] && min < p[1]; });
    const el = $('#statusAberto');
    el.className = 'status-aberto ' + (aberto ? 'aberto' : 'fechado');
    el.textContent = aberto ? 'Aberto agora' : 'Fechado agora';
    $$('#listaHorario li').forEach(function (li) { li.classList.toggle('hoje', Number(li.dataset.dia) === dia); });
  }

  /* ---------------- Renderização geral ---------------- */
  // Copia o título de cada coluna para as células (usado no layout de celular)
  function rotularTabela(tbodySel) {
    const tbody = $(tbodySel);
    const titulos = Array.prototype.map.call(tbody.closest('table').querySelectorAll('thead th'), function (th) { return th.textContent.trim(); });
    Array.prototype.forEach.call(tbody.rows, function (tr) {
      Array.prototype.forEach.call(tr.cells, function (td, i) { td.setAttribute('data-label', titulos[i] || ''); });
    });
  }

  function renderizarTudo() {
    preencherSelects();
    renderizarPainel();
    renderizarProdutos();
    renderizarMovimentar();
    renderizarHistorico();
    renderizarConfig();
  }

  // Inicialização
  const dataExtenso = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  $('#dataHoje').textContent = dataExtenso.charAt(0).toUpperCase() + dataExtenso.slice(1);
  $('#anoAtual').textContent = new Date().getFullYear();
  aplicarTema(document.documentElement.getAttribute('data-tema') === 'escuro' ? 'escuro' : 'claro');
  atualizarStatusAberto();
  setInterval(atualizarStatusAberto, 60000);
  salvar();
  renderizarTudo();

  // Sincroniza se o sistema estiver aberto em outra aba
  window.addEventListener('storage', function (e) {
    if (e.key === CHAVE_DADOS && e.newValue) {
      try { dados = Object.assign(dadosVazios(), JSON.parse(e.newValue)); renderizarTudo(); } catch (err) {}
    }
  });
})();
