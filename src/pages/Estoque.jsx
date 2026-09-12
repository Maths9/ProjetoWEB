import React, { useState } from 'react';
import {
  Package,
  CheckCircle,
  AlertTriangle,
  AlertOctagon,
  Search,
  Info,
  Layers
} from 'lucide-react';
import {
  PRODUTOS_INICIAIS,
  MOVIMENTACOES_INICIAIS,
  CATEGORIAS_ESTOQUE
} from '../data/estoque';
import { useAuth } from '../context/AuthContext';

export function Estoque() {
  const [produtos] = useState(PRODUTOS_INICIAIS);
  const [movimentacoes] = useState(MOVIMENTACOES_INICIAIS);
  const [busca, setBusca] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');

  const { isSecretaria } = useAuth();

  // KPIs
  const totalItens = produtos.length;
  const estoqueOk = produtos.filter((p) => p.status === 'ok').length;
  const estoqueAtencao = produtos.filter((p) => p.status === 'atencao').length;
  const estoqueCritico = produtos.filter((p) => p.status === 'critico').length;

  // Alertas
  const criticos = produtos.filter((p) => p.status === 'critico');
  const atencoes = produtos.filter((p) => p.status === 'atencao');

  // Filtragem
  const produtosFiltrados = produtos.filter((p) => {
    const matchBusca = !busca || p.nome.toLowerCase().includes(busca.toLowerCase());
    const matchCat = !categoriaFiltro || p.categoria === categoriaFiltro;
    return matchBusca && matchCat;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Banner de permissão Secretária */}
      {isSecretaria && (
        <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-100 flex items-center gap-3 text-xs text-blue-800 shadow-2xs">
          <Info size={18} className="text-blue-600 flex-shrink-0" />
          <span>
            <strong>Modo de Consulta:</strong> O perfil de <em>Secretária</em> possui acesso para visualização e consulta de insumos. Ações de cadastro ou movimentação são reservadas à Administradora.
          </span>
        </div>
      )}

      {/* Alertas Ativos */}
      <div className="space-y-2.5">
        {criticos.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-xs text-red-700 shadow-2xs">
            <AlertOctagon size={18} className="text-red-600 flex-shrink-0" />
            <span>
              <strong>Atenção Crítica:</strong> Existem {criticos.length} produtos abaixo do estoque mínimo ({criticos.map((c) => c.nome).join(', ')}). Reposição urgente recomendada.
            </span>
          </div>
        )}

        {atencoes.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3 text-xs text-amber-800 shadow-2xs">
            <AlertTriangle size={18} className="text-amber-600 flex-shrink-0" />
            <span>
              <strong>Alerta Preventivo:</strong> {atencoes.length} itens próximos da margem de reposição ({atencoes.map((a) => a.nome).join(', ')}).
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
            <p className="text-[11px] text-gray-400 mt-0.5">insumos monitorados</p>
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
            <p className="text-[11px] text-gray-400 mt-0.5">acima da cota mínima</p>
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
            <p className="text-[11px] text-gray-400 mt-0.5">próximo da reposição</p>
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
            <p className="text-[11px] text-gray-400 mt-0.5">abaixo do mínimo</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar insumo ou produto..."
              className="w-64 pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-rose-400 shadow-2xs"
            />
          </div>

          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white text-gray-600 focus:outline-none focus:border-rose-400 shadow-2xs"
          >
            <option value="">Todas as Categorias</option>
            {CATEGORIAS_ESTOQUE.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-gray-400 font-medium">
          Exibindo {produtosFiltrados.length} de {produtos.length} produtos
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider text-[11px] bg-gray-50/50">
                <th className="py-3 px-4 font-semibold">Produto</th>
                <th className="py-3 px-4 font-semibold">Categoria</th>
                <th className="py-3 px-4 font-semibold">Qtd Atual / Mínima</th>
                <th className="py-3 px-4 font-semibold">Nível do Estoque</th>
                <th className="py-3 px-4 font-semibold">Preço Unitário</th>
                <th className="py-3 px-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {produtosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    Nenhum produto corresponde aos filtros informados.
                  </td>
                </tr>
              ) : (
                produtosFiltrados.map((p) => {
                  const ratio = Math.min(Math.round((p.qtd / p.minimo) * 100), 100);
                  const isCrit = p.status === 'critico';
                  const isAtencao = p.status === 'atencao';

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
                    <tr key={p.id} className="hover:bg-rose-50/30 transition-colors">
                      <td className="py-3 px-4 font-semibold text-gray-800">{p.nome}</td>
                      <td className="py-3 px-4 text-gray-500">{p.categoria}</td>
                      <td className="py-3 px-4">
                        <span className={`font-bold ${isCrit ? 'text-red-600' : 'text-gray-800'}`}>
                          {p.qtd}
                        </span>
                        <span className="text-[11px] text-gray-400 font-normal"> / mín: {p.minimo}</span>
                      </td>
                      <td className="py-3 px-4 w-40">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${barColor}`}
                              style={{ width: `${ratio}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-gray-400 font-mono w-7 text-right">
                            {ratio}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-700">
                        R$ {Number(p.preco).toFixed(2).replace('.', ',')}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`badge ${badgeClass} capitalize`}>{p.status}</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Histórico de Movimentações */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Layers size={16} />
            </div>
            <div>
              <h2 className="text-gray-800 font-semibold text-sm">Últimas Movimentações</h2>
              <p className="text-gray-400 text-xs">Registro de auditoria de insumos</p>
            </div>
          </div>
          <span className="text-xs text-gray-400 font-medium">Últimos 5 registros</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3 font-semibold">Data</th>
                <th className="py-2.5 px-3 font-semibold">Produto</th>
                <th className="py-2.5 px-3 font-semibold">Tipo</th>
                <th className="py-2.5 px-3 font-semibold">Quantidade</th>
                <th className="py-2.5 px-3 font-semibold">Motivo / Destino</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {movimentacoes.map((m, idx) => {
                const isEntrada = m.tipo === 'Entrada';
                return (
                  <tr key={idx} className="hover:bg-gray-50/50">
                    <td className="py-2.5 px-3 font-mono text-[11px] text-gray-400">{m.data}</td>
                    <td className="py-2.5 px-3 font-medium text-gray-800">{m.produto}</td>
                    <td className="py-2.5 px-3">
                      <span className={`badge ${isEntrada ? 'badge-blue' : 'badge-pink'}`}>
                        {m.tipo}
                      </span>
                    </td>
                    <td className={`py-2.5 px-3 font-bold ${isEntrada ? 'text-blue-600' : 'text-rose-600'}`}>
                      {isEntrada ? '+' : '-'}{m.qtd}
                    </td>
                    <td className="py-2.5 px-3 text-gray-500 text-[11px]">{m.motivo}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
