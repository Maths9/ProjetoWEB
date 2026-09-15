import React, { useState } from 'react';
import {
  Search,
  Plus,
  Eye,
  Edit2,
  X,
  Phone,
  Mail,
  UserCheck,
  Calendar,
  Sparkles
} from 'lucide-react';
import { CLIENTES_INICIAIS, HISTORICO_CLIENTES } from '../data/clientes';
import { useAuth } from '../context/AuthContext';

export function Clientes() {
  const [clientes, setClientes] = useState(CLIENTES_INICIAIS);
  const [abaAtiva, setAbaAtiva] = useState('todos'); // 'todos' | 'ativo' | 'potencial' | 'inativo'
  const [busca, setBusca] = useState('');

  // Modal Novo/Editar
  const [modalClienteAberto, setModalClienteAberto] = useState(false);
  const [clienteEditando, setClienteEditando] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    tel: '',
    email: '',
    tipo: 'ativo',
    obs: '',
  });

  // Modal Histórico
  const [modalHistoricoAberto, setModalHistoricoAberto] = useState(false);
  const [clienteSelecionadoHistorico, setClienteSelecionadoHistorico] = useState(null);

  const { can } = useAuth();
  const podeCriar = can('clientes', 'criar');
  const podeEditar = can('clientes', 'editar');
  const podeHistorico = can('clientes', 'historico');

  // Filtros
  const clientesFiltrados = clientes.filter((c) => {
    const matchAba = abaAtiva === 'todos' || c.tipo === abaAtiva;
    const q = busca.toLowerCase();
    const matchBusca =
      !q ||
      c.nome.toLowerCase().includes(q) ||
      c.tel.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q);
    return matchAba && matchBusca;
  });

  // Contagens
  const countTodos = clientes.length;
  const countAtivos = clientes.filter((c) => c.tipo === 'ativo').length;
  const countPotenciais = clientes.filter((c) => c.tipo === 'potencial').length;
  const countInativos = clientes.filter((c) => c.tipo === 'inativo').length;

  // Abrir modal novo
  const handleNovoCliente = () => {
    setClienteEditando(null);
    setFormData({
      nome: '',
      tel: '',
      email: '',
      tipo: 'ativo',
      obs: '',
    });
    setModalClienteAberto(true);
  };

  // Abrir modal edição
  const handleEditar = (c) => {
    setClienteEditando(c.id);
    setFormData({
      nome: c.nome,
      tel: c.tel,
      email: c.email,
      tipo: c.tipo,
      obs: c.obs || '',
    });
    setModalClienteAberto(true);
  };

  // Salvar cliente
  const handleSalvarCliente = (e) => {
    e.preventDefault();
    if (clienteEditando) {
      setClientes((prev) =>
        prev.map((c) =>
          c.id === clienteEditando ? { ...c, ...formData } : c
        )
      );
    } else {
      const novoId = clientes.length ? Math.max(...clientes.map((c) => c.id)) + 1 : 1;
      setClientes((prev) => [
        {
          id: novoId,
          ...formData,
          ultimaVisita: '-',
          ultimoProc: '-',
        },
        ...prev,
      ]);
    }
    setModalClienteAberto(false);
  };

  // Abrir modal histórico
  const handleVerHistorico = (c) => {
    setClienteSelecionadoHistorico(c);
    setModalHistoricoAberto(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-poppins">
      {/* Header com Tabs e Busca */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tabs de Filtro */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-gray-100 shadow-2xs flex-wrap">
          {[
            { id: 'todos', label: 'Todos', count: countTodos },
            { id: 'ativo', label: 'Ativos', count: countAtivos },
            { id: 'potencial', label: 'Potenciais', count: countPotenciais },
            { id: 'inativo', label: 'Inativos', count: countInativos },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setAbaAtiva(tab.id)}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                abaAtiva === tab.id
                  ? 'bg-[#c47a85] text-white font-semibold shadow-2xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {tab.label} <span className="opacity-80 text-[10px]">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Busca e Botão Novo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome, tel, e-mail..."
              className="w-64 md:w-80 pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-rose-400 shadow-2xs"
            />
          </div>

          {podeCriar && (
            <button
              onClick={handleNovoCliente}
              className="flex items-center gap-1.5 bg-[#c47a85] hover:bg-[#b5606e] text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all flex-shrink-0"
            >
              <Plus size={15} strokeWidth={2.5} />
              <span>Novo Cliente</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabela de Clientes */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider text-[11px] bg-gray-50/50">
                <th className="py-3 px-4 font-semibold">Cliente</th>
                <th className="py-3 px-4 font-semibold">Telefone</th>
                <th className="py-3 px-4 font-semibold">E-mail</th>
                <th className="py-3 px-4 font-semibold">Status / Tipo</th>
                <th className="py-3 px-4 font-semibold">Última Visita</th>
                <th className="py-3 px-4 font-semibold">Último Procedimento</th>
                <th className="py-3 px-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {clientesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    Nenhum cliente localizado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                clientesFiltrados.map((c) => {
                  const badgeClass =
                    c.tipo === 'ativo'
                      ? 'badge-green'
                      : c.tipo === 'potencial'
                      ? 'badge-yellow'
                      : 'badge-gray';

                  return (
                    <tr key={c.id} className="hover:bg-rose-50/20 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-rose-100 text-[#b5606e] flex items-center justify-center font-bold text-xs flex-shrink-0">
                            {c.nome.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{c.nome}</p>
                            {c.obs && (
                              <p className="text-[10px] text-gray-400 truncate max-w-xs">{c.obs}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-gray-600 text-[11px]">{c.tel}</td>
                      <td className="py-3 px-4 text-gray-500">{c.email}</td>
                      <td className="py-3 px-4">
                        <span className={`badge ${badgeClass} capitalize`}>{c.tipo}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-500">{c.ultimaVisita}</td>
                      <td className="py-3 px-4 text-gray-700 font-medium">{c.ultimoProc}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {podeHistorico && (
                            <button
                              onClick={() => handleVerHistorico(c)}
                              title="Ver Histórico de Atendimentos"
                              className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                              <Eye size={15} />
                            </button>
                          )}
                          {podeEditar && (
                            <button
                              onClick={() => handleEditar(c)}
                              title="Editar Cadastro"
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit2 size={15} />
                            </button>
                          )}
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

      {/* MODAL: NOVO / EDITAR CLIENTE */}
      {modalClienteAberto && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800 text-sm">
                {clienteEditando ? 'Editar Cadastro de Cliente' : 'Novo Cadastro de Cliente'}
              </h3>
              <button
                onClick={() => setModalClienteAberto(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSalvarCliente} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Maria dos Santos"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Telefone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={formData.tel}
                    onChange={(e) => setFormData({ ...formData, tel: e.target.value })}
                    placeholder="(11) 98765-4321"
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-rose-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Tipo de Cliente</label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-rose-400 bg-white"
                  >
                    <option value="ativo">Cliente Ativo</option>
                    <option value="potencial">Potencial (Lead)</option>
                    <option value="inativo">Inativo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">E-mail</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="cliente@email.com"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Observações e Preferências</label>
                <textarea
                  rows={3}
                  value={formData.obs}
                  onChange={(e) => setFormData({ ...formData, obs: e.target.value })}
                  placeholder="Alergias, preferências de horário, tratamentos anteriores..."
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalClienteAberto(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-500 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#c47a85] hover:bg-[#b5606e] rounded-xl shadow-xs transition-colors"
                >
                  Salvar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: HISTÓRICO DE ATENDIMENTOS */}
      {modalHistoricoAberto && clienteSelecionadoHistorico && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">
                  Histórico – {clienteSelecionadoHistorico.nome}
                </h3>
                <p className="text-[11px] text-gray-400">Atendimentos anteriores e observações</p>
              </div>
              <button
                onClick={() => setModalHistoricoAberto(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 max-h-80 overflow-y-auto space-y-2.5">
              {HISTORICO_CLIENTES[clienteSelecionadoHistorico.id]?.length ? (
                HISTORICO_CLIENTES[clienteSelecionadoHistorico.id].map((h, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-800">{h.proc}</span>
                      <span className="font-semibold text-rose-600">{h.valor}</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-400 text-[11px]">
                      <span>Data: {h.data}</span>
                      {h.obs && <span className="italic text-gray-500">{h.obs}</span>}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-gray-400 text-xs">
                  Nenhum histórico registrado para este cliente até o momento.
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100 text-right">
              <button
                onClick={() => setModalHistoricoAberto(false)}
                className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
