import React, { useState, useEffect } from 'react';
import {
  Package,
  CheckCircle,
  AlertTriangle,
  AlertOctagon,
  Search,
  Plus,
  Edit2,
  Trash2,
  Layers,
  ArrowDownRight,
  ArrowUpRight,
  Sliders,
  X,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FMT_BRL = (valor) =>
  Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export function Estoque() {
  const { user, isAdmin, isSecretaria } = useAuth();

  const [produtos, setProdutos] = useState([]);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');

  // Modais
  const [modalProdutoAberto, setModalProdutoAberto] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [formProduto, setFormProduto] = useState({
    nome: '',
    quantidade: 0,
    estoqueMinimo: 5,
    precoCusto: 0
  });

  const [modalMovimentacaoAberto, setModalMovimentacaoAberto] = useState(false);
  const [produtoSelecionadoMov, setProdutoSelecionadoMov] = useState(null);
  const [formMov, setFormMov] = useState({
    tipo: 'ENTRADA', // 'ENTRADA' | 'SAIDA' | 'AJUSTE'
    quantidade: 1,
    novaQuantidade: 0,
    motivo: 'Uso em atendimento'
  });

  // Carregar produtos e movimentações da API
  const carregarDados = async () => {
    setCarregando(true);
    try {
      const [resProd, resMov] = await Promise.all([
        fetch('http://localhost:8080/api/v1/estoque/produtos').then((r) => r.json()),
        fetch('http://localhost:8080/api/v1/estoque/movimentacoes').then((r) => r.json())
      ]);
      setProdutos(Array.isArray(resProd) ? resProd : []);
      setMovimentacoes(Array.isArray(resMov) ? resMov.reverse() : []);
    } catch (err) {
      console.error('Erro ao carregar dados do estoque:', err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  // Classificação de status
  const getStatus = (p) => {
    const qtd = p.quantidade ?? 0;
    const min = p.estoqueMinimo ?? 0;
    if (qtd <= min) return 'critico';
    if (qtd <= min * 1.5) return 'atencao';
    return 'ok';
  };

  // KPIs
  const totalItens = produtos.length;
  const estoqueOk = produtos.filter((p) => getStatus(p) === 'ok').length;
  const estoqueAtencao = produtos.filter((p) => getStatus(p) === 'atencao').length;
  const estoqueCritico = produtos.filter((p) => getStatus(p) === 'critico').length;
  const criticos = produtos.filter((p) => getStatus(p) === 'critico');
  const atencoes = produtos.filter((p) => getStatus(p) === 'atencao');

  // Filtro de busca
  const produtosFiltrados = produtos.filter((p) =>
    !busca || p.nome?.toLowerCase().includes(busca.toLowerCase())
  );

  // Handlers: Produto (Novo / Editar)
  const abrirNovoProduto = () => {
    setProdutoEditando(null);
    setFormProduto({
      nome: '',
      quantidade: 0,
      estoqueMinimo: 5,
      precoCusto: 0
    });
    setModalProdutoAberto(true);
  };

  const abrirEditarProduto = (p) => {
    setProdutoEditando(p);
    setFormProduto({
      nome: p.nome || '',
      quantidade: p.quantidade ?? 0,
      estoqueMinimo: p.estoqueMinimo ?? 5,
      precoCusto: p.precoCusto ?? 0
    });
    setModalProdutoAberto(true);
  };

  const salvarProduto = async (e) => {
    e.preventDefault();
    if (!formProduto.nome) return;

    try {
      if (produtoEditando) {
        await fetch(`http://localhost:8080/api/v1/estoque/produtos/${produtoEditando.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nome: formProduto.nome,
            quantidade: Number(formProduto.quantidade),
            estoqueMinimo: Number(formProduto.estoqueMinimo),
            precoCusto: Number(formProduto.precoCusto)
          })
        });
      } else {
        await fetch('http://localhost:8080/api/v1/estoque/produtos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nome: formProduto.nome,
            quantidade: Number(formProduto.quantidade),
            estoqueMinimo: Number(formProduto.estoqueMinimo),
            precoCusto: Number(formProduto.precoCusto)
          })
        });
      }
      setModalProdutoAberto(false);
      carregarDados();
    } catch (err) {
      console.error('Erro ao salvar produto:', err);
    }
  };

  const excluirProduto = async (p) => {
    if (!confirm(`Deseja realmente excluir o insumo "${p.nome}" do estoque?`)) return;
    try {
      const res = await fetch(`http://localhost:8080/api/v1/estoque/produtos/${p.id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        carregarDados();
      } else {
        alert('Não foi possível excluir o produto.');
      }
    } catch (err) {
      console.error('Erro ao excluir produto:', err);
    }
  };

  // Handlers: Movimentação / Ajuste de Quantidade
  const abrirAjustarEstoque = (p) => {
    setProdutoSelecionadoMov(p);
    setFormMov({
      tipo: 'SAIDA',
      quantidade: 1,
      novaQuantidade: p.quantidade ?? 0,
      motivo: 'Uso em procedimento'
    });
    setModalMovimentacaoAberto(true);
  };

  const formatarDataHora = (dt) => {
    if (!dt) return '-';
    if (typeof dt === 'string') {
      const d = new Date(dt);
      return isNaN(d.getTime()) ? dt : d.toLocaleString('pt-BR');
    }
    if (Array.isArray(dt)) {
      const [ano, mes, dia, hora, min] = dt;
      return `${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}/${ano} ${String(hora || 0).padStart(2, '0')}:${String(min || 0).padStart(2, '0')}`;
    }
    return '-';
  };

  const salvarAjusteEstoque = async (e) => {
    e.preventDefault();
    if (!produtoSelecionadoMov) return;

    try {
      if (formMov.tipo === 'AJUSTE') {
        const novaQtd = Number(formMov.novaQuantidade);
        const qtdAtual = produtoSelecionadoMov.quantidade ?? 0;
        const diff = novaQtd - qtdAtual;

        if (diff === 0) {
          alert('A nova quantidade informada é idêntica à quantidade atual.');
          setModalMovimentacaoAberto(false);
          return;
        }

        const tipoLog = diff > 0 ? 'ENTRADA' : 'SAIDA';
        const qtdAjuste = Math.abs(diff);
        const motivoLog = formMov.motivo?.trim() || 'Ajuste de inventário (Balanço)';

        const res = await fetch(
          `http://localhost:8080/api/v1/estoque/produtos/${produtoSelecionadoMov.id}/movimentacao?tipo=${tipoLog}&quantidade=${qtdAjuste}&obs=${encodeURIComponent(motivoLog)}`,
          { method: 'POST' }
        );

        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          alert(errData?.message || 'Erro ao registrar ajuste de inventário.');
          return;
        }
      } else {
        // Entrada ou Saída com validação
        const qtd = Number(formMov.quantidade);
        if (qtd <= 0) {
          alert('Informe uma quantidade válida maior que zero.');
          return;
        }

        const res = await fetch(
          `http://localhost:8080/api/v1/estoque/produtos/${produtoSelecionadoMov.id}/movimentacao?tipo=${formMov.tipo}&quantidade=${qtd}&obs=${encodeURIComponent(formMov.motivo)}`,
          { method: 'POST' }
        );

        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          alert(errData?.message || 'Erro ao movimentar estoque (verifique se há saldo suficiente).');
          return;
        }
      }

      setModalMovimentacaoAberto(false);
      await carregarDados();
    } catch (err) {
      console.error('Erro ao ajustar quantidade:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-poppins">
      {/* Header Banner com Ação de Novo Produto */}
      <div className="bg-gradient-to-r from-[#c47a85] to-[#b5606e] rounded-3xl p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="bg-white/20 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-xs">
            Inventário & Sala de Procedimentos
          </span>
          <h1 className="text-xl font-bold mt-2">Controle de Estoque & Insumos</h1>
          <p className="text-white/80 text-xs mt-0.5">
            Acompanhe cotas mínimas, registre entradas, baixas de atendimento e ajuste quantidades.
          </p>
        </div>

        <button
          onClick={abrirNovoProduto}
          className="flex items-center gap-1.5 px-4 py-2 bg-white text-[#b5606e] hover:bg-rose-50 rounded-xl text-xs font-semibold shadow-xs transition-colors flex-shrink-0"
        >
          <Plus size={15} /> Cadastrar Insumo
        </button>
      </div>

      {/* Alertas Ativos */}
      <div className="space-y-2.5">
        {criticos.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-xs text-red-700 shadow-2xs">
            <AlertOctagon size={18} className="text-red-600 flex-shrink-0" />
            <span>
              <strong>Atenção Crítica:</strong> Existem {criticos.length} produto(s) abaixo ou na cota mínima ({criticos.map((c) => c.nome).join(', ')}). Reposição recomendada.
            </span>
          </div>
        )}

        {atencoes.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3 text-xs text-amber-800 shadow-2xs">
            <AlertTriangle size={18} className="text-amber-600 flex-shrink-0" />
            <span>
              <strong>Alerta Preventivo:</strong> {atencoes.length} item(ns) próximo(s) da cota de reposição ({atencoes.map((a) => a.nome).join(', ')}).
            </span>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs font-medium">Total de Produtos</span>
            <div className="w-8 h-8 rounded-xl bg-pink-50 flex items-center justify-center text-rose-600">
              <Package size={16} />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{totalItens}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">insumos cadastrados</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs font-medium">Estoque Regular</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle size={16} />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-600">{estoqueOk}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">nível seguro de estoque</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs font-medium">Em Atenção</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-amber-600">{estoqueAtencao}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">próximo da cota mínima</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs font-medium">Crítico / Urgente</span>
            <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
              <AlertOctagon size={16} />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-500">{estoqueCritico}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">abaixo da cota mínima</p>
          </div>
        </div>
      </div>

      {/* Busca e Barra de Ações */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar insumo ou produto por nome..."
            className="w-72 sm:w-80 pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-rose-400 shadow-2xs"
          />
        </div>

        <button
          onClick={carregarDados}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 self-end sm:self-auto transition-colors"
          title="Recarregar dados"
        >
          <RefreshCw size={13} className={carregando ? 'animate-spin' : ''} />
          Atualizar Dados
        </button>
      </div>

      {/* Tabela de Produtos com Ações de Ajuste de Quantidade */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider text-[11px] bg-gray-50/50">
                <th className="py-3 px-4 font-semibold">Produto / Insumo</th>
                <th className="py-3 px-4 font-semibold">Qtd Atual</th>
                <th className="py-3 px-4 font-semibold">Cota Mínima</th>
                <th className="py-3 px-4 font-semibold">Nível do Estoque</th>
                <th className="py-3 px-4 font-semibold">Preço de Custo</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Ajuste & Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {carregando ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    Carregando estoque do banco de dados...
                  </td>
                </tr>
              ) : produtosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    Nenhum produto cadastrado ou localizado com o termo buscado.
                  </td>
                </tr>
              ) : (
                produtosFiltrados.map((p) => {
                  const qtd = p.quantidade ?? 0;
                  const min = p.estoqueMinimo ?? 0;
                  const ratio = min > 0 ? Math.min(Math.round((qtd / min) * 100), 100) : 100;
                  const status = getStatus(p);

                  const isCrit = status === 'critico';
                  const isAtencao = status === 'atencao';

                  const badgeClass = isCrit
                    ? 'badge-red'
                    : isAtencao
                    ? 'badge-yellow'
                    : 'badge-green';

                  const barColor = isCrit
                    ? 'bg-red-500'
                    : isAtencao
                    ? 'bg-amber-500'
                    : 'bg-emerald-500';

                  return (
                    <tr key={p.id} className="hover:bg-rose-50/20 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-gray-800 text-xs block">{p.nome}</span>
                        <span className="text-[10px] text-gray-400">ID #{p.id}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-sm">
                        <span className={isCrit ? 'text-red-600' : 'text-gray-800'}>{qtd}</span> un.
                      </td>
                      <td className="py-3.5 px-4 font-mono text-gray-500">
                        {min} un.
                      </td>
                      <td className="py-3.5 px-4 w-44">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${barColor}`}
                              style={{ width: `${ratio}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-gray-400 font-mono w-8 text-right">
                            {ratio}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-gray-700">
                        {p.precoCusto ? FMT_BRL(p.precoCusto) : '-'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`badge ${badgeClass} uppercase text-[10px]`}>{status}</span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Botão de Ajustar Quantidade (Permitido para Secretária e Admin) */}
                          <button
                            onClick={() => abrirAjustarEstoque(p)}
                            title="Ajustar Quantidade / Registrar Movimentação"
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-[#b5606e] rounded-lg text-xs font-semibold transition-colors shadow-2xs"
                          >
                            <Sliders size={13} />
                            <span>Ajustar</span>
                          </button>

                          <button
                            onClick={() => abrirEditarProduto(p)}
                            title="Editar Insumo"
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>

                          <button
                            onClick={() => excluirProduto(p)}
                            title="Excluir Produto"
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Histórico Real de Movimentações */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Layers size={16} />
            </div>
            <div>
              <h2 className="text-gray-800 font-semibold text-sm">Registro de Auditoria de Movimentações</h2>
              <p className="text-gray-400 text-xs">Entradas, saídas e ajustes de quantidade no estoque</p>
            </div>
          </div>
          <span className="text-xs text-gray-400 font-medium">{movimentacoes.length} registros</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3 font-semibold">Data / Hora</th>
                <th className="py-2.5 px-3 font-semibold">Produto</th>
                <th className="py-2.5 px-3 font-semibold">Tipo</th>
                <th className="py-2.5 px-3 font-semibold">Quantidade</th>
                <th className="py-2.5 px-3 font-semibold">Motivo / Observação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {movimentacoes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400 text-xs">
                    Nenhuma movimentação registrada até o momento.
                  </td>
                </tr>
              ) : (
                movimentacoes.slice(0, 10).map((m) => {
                  const isEntrada = m.tipo === 'ENTRADA';
                  return (
                    <tr key={m.id} className="hover:bg-gray-50/50">
                      <td className="py-2.5 px-3 font-mono text-[11px] text-gray-500">
                        {formatarDataHora(m.createdAt)}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-gray-800">
                        {m.produto?.nome || 'Insumo'}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`badge ${isEntrada ? 'badge-blue' : 'badge-pink'} text-[10px]`}>
                          {m.tipo}
                        </span>
                      </td>
                      <td className={`py-2.5 px-3 font-mono font-bold ${isEntrada ? 'text-blue-600' : 'text-rose-600'}`}>
                        {isEntrada ? '+' : '-'}{m.quantidade} un.
                      </td>
                      <td className="py-2.5 px-3 text-gray-500 text-[11px]">
                        {m.observacoes || '-'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: AJUSTAR QUANTIDADE / MOVIMENTAÇÃO */}
      {modalMovimentacaoAberto && produtoSelecionadoMov && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">
                  Ajustar Quantidade em Estoque
                </h3>
                <p className="text-[11px] text-gray-400">
                  {produtoSelecionadoMov.nome} (Atual: <strong>{produtoSelecionadoMov.quantidade} un.</strong>)
                </p>
              </div>
              <button
                onClick={() => setModalMovimentacaoAberto(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={salvarAjusteEstoque} className="mt-4 space-y-4">
              {/* Seleção de Tipo de Operação */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Tipo de Operação
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormMov({ ...formMov, tipo: 'SAIDA', motivo: 'Uso em procedimento' })}
                    className={`py-2 px-2 text-xs font-semibold rounded-xl border flex items-center justify-center gap-1 transition-all ${
                      formMov.tipo === 'SAIDA'
                        ? 'border-rose-400 bg-rose-50 text-rose-700 shadow-2xs'
                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <ArrowDownRight size={14} /> Dar Baixa (Saída)
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormMov({ ...formMov, tipo: 'ENTRADA', motivo: 'Reposição de estoque' })}
                    className={`py-2 px-2 text-xs font-semibold rounded-xl border flex items-center justify-center gap-1 transition-all ${
                      formMov.tipo === 'ENTRADA'
                        ? 'border-blue-400 bg-blue-50 text-blue-700 shadow-2xs'
                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <ArrowUpRight size={14} /> Repor (Entrada)
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormMov({ ...formMov, tipo: 'AJUSTE', motivo: 'Acerto de inventário' })}
                    className={`py-2 px-2 text-xs font-semibold rounded-xl border flex items-center justify-center gap-1 transition-all ${
                      formMov.tipo === 'AJUSTE'
                        ? 'border-purple-400 bg-purple-50 text-purple-700 shadow-2xs'
                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <Sliders size={14} /> Definir Saldo
                  </button>
                </div>
              </div>

              {/* Campos dinâmicos dependendo da operação */}
              {formMov.tipo === 'AJUSTE' ? (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Novo Saldo Total em Estoque *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formMov.novaQuantidade}
                    onChange={(e) => setFormMov({ ...formMov, novaQuantidade: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-rose-400 font-mono font-bold text-gray-800"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    Substitui o saldo atual ({produtoSelecionadoMov.quantidade} un.) pelo valor exato digitado.
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Quantidade a {formMov.tipo === 'ENTRADA' ? 'Adicionar' : 'Retirar'} *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formMov.quantidade}
                    onChange={(e) => setFormMov({ ...formMov, quantidade: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-rose-400 font-mono font-bold text-gray-800"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    Novo saldo resultante:{' '}
                    <strong>
                      {formMov.tipo === 'ENTRADA'
                        ? Number(produtoSelecionadoMov.quantidade ?? 0) + Number(formMov.quantidade || 0)
                        : Math.max(0, Number(produtoSelecionadoMov.quantidade ?? 0) - Number(formMov.quantidade || 0))}{' '}
                      un.
                    </strong>
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Motivo / Observação
                </label>
                <input
                  type="text"
                  value={formMov.motivo}
                  onChange={(e) => setFormMov({ ...formMov, motivo: e.target.value })}
                  placeholder="Ex: Atendimento cliente Ana Souza, compra fornecedor..."
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalMovimentacaoAberto(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-500 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#c47a85] hover:bg-[#b5606e] rounded-xl shadow-xs transition-colors"
                >
                  Confirmar Ajuste
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CADASTRAR OU EDITAR PRODUTO */}
      {modalProdutoAberto && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800 text-sm">
                {produtoEditando ? 'Editar Insumo do Estoque' : 'Cadastrar Novo Insumo'}
              </h3>
              <button
                onClick={() => setModalProdutoAberto(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={salvarProduto} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Nome do Insumo / Produto *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Gel Redutor, Luvas Descartáveis..."
                  value={formProduto.nome}
                  onChange={(e) => setFormProduto({ ...formProduto, nome: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Quantidade em Estoque *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formProduto.quantidade}
                    onChange={(e) => setFormProduto({ ...formProduto, quantidade: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-rose-400 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Estoque Mínimo (Alerta) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formProduto.estoqueMinimo}
                    onChange={(e) => setFormProduto({ ...formProduto, estoqueMinimo: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-rose-400 font-mono font-bold text-amber-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Preço de Custo Unitário (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  value={formProduto.precoCusto}
                  onChange={(e) => setFormProduto({ ...formProduto, precoCusto: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-rose-400 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalProdutoAberto(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-500 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#c47a85] hover:bg-[#b5606e] rounded-xl shadow-xs transition-colors"
                >
                  {produtoEditando ? 'Atualizar Insumo' : 'Salvar Insumo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
