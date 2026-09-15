import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Plus,
  X,
  Check,
  Receipt,
  ShoppingCart,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  RECEITAS_INICIAIS,
  DESPESAS_INICIAIS,
  CATEGORIAS_DESPESA,
  FORMAS_PAGAMENTO,
} from '../data/financeiro';

const FMT_BRL = (v) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const MESES_BAR = [
  { mes: 'Abr', receita: 9200, despesa: 3800 },
  { mes: 'Mai', receita: 10500, despesa: 4100 },
  { mes: 'Jun', receita: 9800,  despesa: 3600 },
  { mes: 'Jul', receita: 11200, despesa: 4500 },
  { mes: 'Ago', receita: 11900, despesa: 4200 },
  { mes: 'Set', receita: 12840, despesa: 4320 },
];
const MAX_BAR = Math.max(...MESES_BAR.map((m) => m.receita));

const BADGE_STATUS = {
  recebido: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  pendente:  'bg-amber-50  text-amber-700  ring-1 ring-amber-200',
};

const emptyReceita = { data: '', cliente: '', proc: '', valor: '', forma: 'Pix', status: 'recebido' };
const emptyDespesa = { data: '', categoria: 'Materiais', desc: '', valor: '', forma: 'Pix' };

export function Financeiro() {
  const { isAdmin } = useAuth();
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  const [tab, setTab] = useState('receitas');
  const [receitas, setReceitas] = useState(RECEITAS_INICIAIS);
  const [despesas, setDespesas] = useState(DESPESAS_INICIAIS);

  // Modais
  const [modalReceita, setModalReceita] = useState(false);
  const [modalDespesa, setModalDespesa] = useState(false);
  const [formReceita, setFormReceita] = useState(emptyReceita);
  const [formDespesa, setFormDespesa] = useState(emptyDespesa);

  // KPIs
  const totalReceitas  = receitas.filter((r) => r.status === 'recebido').reduce((s, r) => s + r.valor, 0);
  const totalDespesas  = despesas.reduce((s, d) => s + d.valor, 0);
  const lucro          = totalReceitas - totalDespesas;
  const totalPendentes = receitas.filter((r) => r.status === 'pendente').reduce((s, r) => s + r.valor, 0);

  const pendentes = receitas.filter((r) => r.status === 'pendente');

  // Salvar receita
  const salvarReceita = () => {
    if (!formReceita.data || !formReceita.cliente || !formReceita.proc || !formReceita.valor) return;
    const nova = { ...formReceita, id: Date.now(), valor: parseFloat(formReceita.valor) };
    setReceitas((p) => [nova, ...p]);
    setModalReceita(false);
    setFormReceita(emptyReceita);
  };

  // Salvar despesa
  const salvarDespesa = () => {
    if (!formDespesa.data || !formDespesa.desc || !formDespesa.valor) return;
    const nova = { ...formDespesa, id: Date.now(), valor: parseFloat(formDespesa.valor) };
    setDespesas((p) => [nova, ...p]);
    setModalDespesa(false);
    setFormDespesa(emptyDespesa);
  };

  // Confirmar pendente
  const confirmarPendente = (id) => {
    setReceitas((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'recebido' } : r))
    );
  };

  // Excluir receita/despesa
  const excluirReceita = (id) => setReceitas((p) => p.filter((r) => r.id !== id));
  const excluirDespesa = (id) => setDespesas((p) => p.filter((d) => d.id !== id));

  const tabs = [
    { id: 'receitas', label: 'Receitas', count: receitas.filter(r=>r.status==='recebido').length, icon: TrendingUp },
    { id: 'despesas', label: 'Despesas', count: despesas.length, icon: TrendingDown },
    { id: 'pendentes', label: 'Pendentes', count: pendentes.length, icon: Clock },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-poppins">

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#c47a85] to-[#b5606e] rounded-3xl p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="bg-white/20 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-xs">
            Controle Financeiro · Admin
          </span>
          <h1 className="text-xl font-bold mt-2">Financeiro — Setembro 2026</h1>
          <p className="text-white/80 text-xs mt-0.5">
            DRE resumido · Receitas, despesas e pendências da clínica.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setModalReceita(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-white text-[#b5606e] hover:bg-rose-50 rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus size={14} /> Nova Receita
          </button>
          <button
            onClick={() => setModalDespesa(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            <Plus size={14} /> Nova Despesa
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Receitas Recebidas', value: FMT_BRL(totalReceitas),  icon: TrendingUp,   color: 'emerald', bg: 'bg-emerald-50',  txt: 'text-emerald-600' },
          { label: 'Despesas do Mês',    value: FMT_BRL(totalDespesas),   icon: TrendingDown, color: 'red',     bg: 'bg-red-50',     txt: 'text-red-500'    },
          { label: 'Lucro Operacional',  value: FMT_BRL(lucro),           icon: DollarSign,   color: 'blue',    bg: 'bg-blue-50',    txt: 'text-blue-600'   },
          { label: 'Pendentes',          value: FMT_BRL(totalPendentes),  icon: Clock,        color: 'amber',   bg: 'bg-amber-50',   txt: 'text-amber-600'  },
        ].map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-white p-4 rounded-2xl shadow-xs border border-gray-100 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-xs font-medium">{k.label}</span>
                <div className={`w-8 h-8 rounded-xl ${k.bg} flex items-center justify-center ${k.txt}`}>
                  <Icon size={16} />
                </div>
              </div>
              <p className="text-xl font-bold text-gray-800">{k.value}</p>
            </div>
          );
        })}
      </div>

      {/* DRE Bar Chart */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">DRE · Últimos 6 meses</h3>
        <div className="flex items-end gap-3 h-36">
          {MESES_BAR.map((m) => (
            <div key={m.mes} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex items-end gap-0.5" style={{ height: '100px' }}>
                <div
                  className="flex-1 bg-[#c47a85]/80 rounded-t-md"
                  style={{ height: `${(m.receita / MAX_BAR) * 100}%` }}
                  title={`Receita: ${FMT_BRL(m.receita)}`}
                />
                <div
                  className="flex-1 bg-red-300/70 rounded-t-md"
                  style={{ height: `${(m.despesa / MAX_BAR) * 100}%` }}
                  title={`Despesa: ${FMT_BRL(m.despesa)}`}
                />
              </div>
              <span className="text-[10px] text-gray-400 font-medium">{m.mes}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-2">
          <span className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <span className="w-3 h-3 rounded-sm bg-[#c47a85]/80 inline-block" /> Receita
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <span className="w-3 h-3 rounded-sm bg-red-300/70 inline-block" /> Despesa
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="flex border-b border-gray-100">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold transition-colors ${
                  tab === t.id
                    ? 'text-[#b5606e] border-b-2 border-[#c47a85] bg-rose-50/30'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon size={14} />
                {t.label}
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  tab === t.id ? 'bg-[#f5d5d8] text-[#b5606e]' : 'bg-gray-100 text-gray-500'
                }`}>
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Receitas */}
        {tab === 'receitas' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-gray-600 text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-400 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-4 font-semibold">Data</th>
                  <th className="py-2.5 px-4 font-semibold">Cliente</th>
                  <th className="py-2.5 px-4 font-semibold">Procedimento</th>
                  <th className="py-2.5 px-4 font-semibold">Forma</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Valor</th>
                  <th className="py-2.5 px-4 font-semibold">Status</th>
                  <th className="py-2.5 px-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {receitas.filter(r=>r.status==='recebido').map((r) => (
                  <tr key={r.id} className="hover:bg-rose-50/20">
                    <td className="py-2.5 px-4 font-medium text-gray-700">{r.data}</td>
                    <td className="py-2.5 px-4 font-medium text-gray-800">{r.cliente}</td>
                    <td className="py-2.5 px-4 text-gray-500">{r.proc}</td>
                    <td className="py-2.5 px-4 text-gray-500">{r.forma}</td>
                    <td className="py-2.5 px-4 font-bold text-emerald-700 text-right">{FMT_BRL(r.valor)}</td>
                    <td className="py-2.5 px-4">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${BADGE_STATUS[r.status]}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      <button onClick={() => excluirReceita(r.id)} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
                        <X size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Despesas */}
        {tab === 'despesas' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-gray-600 text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-400 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-4 font-semibold">Data</th>
                  <th className="py-2.5 px-4 font-semibold">Categoria</th>
                  <th className="py-2.5 px-4 font-semibold">Descrição</th>
                  <th className="py-2.5 px-4 font-semibold">Forma</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Valor</th>
                  <th className="py-2.5 px-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {despesas.map((d) => (
                  <tr key={d.id} className="hover:bg-rose-50/20">
                    <td className="py-2.5 px-4 font-medium text-gray-700">{d.data}</td>
                    <td className="py-2.5 px-4">
                      <span className="bg-gray-100 text-gray-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">{d.categoria}</span>
                    </td>
                    <td className="py-2.5 px-4 text-gray-500">{d.desc}</td>
                    <td className="py-2.5 px-4 text-gray-500">{d.forma}</td>
                    <td className="py-2.5 px-4 font-bold text-red-600 text-right">{FMT_BRL(d.valor)}</td>
                    <td className="py-2.5 px-4">
                      <button onClick={() => excluirDespesa(d.id)} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
                        <X size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pendentes */}
        {tab === 'pendentes' && (
          <div className="overflow-x-auto">
            {pendentes.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <Check size={32} className="mx-auto mb-2 text-emerald-400" />
                <p className="text-sm font-medium">Nenhum pagamento pendente</p>
              </div>
            ) : (
              <table className="w-full text-xs text-gray-600 text-left">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-400 uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-4 font-semibold">Data</th>
                    <th className="py-2.5 px-4 font-semibold">Cliente</th>
                    <th className="py-2.5 px-4 font-semibold">Procedimento</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Valor</th>
                    <th className="py-2.5 px-4 font-semibold">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {pendentes.map((r) => (
                    <tr key={r.id} className="hover:bg-amber-50/20">
                      <td className="py-2.5 px-4 font-medium text-gray-700">{r.data}</td>
                      <td className="py-2.5 px-4 font-medium text-gray-800">{r.cliente}</td>
                      <td className="py-2.5 px-4 text-gray-500">{r.proc}</td>
                      <td className="py-2.5 px-4 font-bold text-amber-700 text-right">{FMT_BRL(r.valor)}</td>
                      <td className="py-2.5 px-4">
                        <button
                          onClick={() => confirmarPendente(r.id)}
                          className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-[11px] font-semibold transition-colors"
                        >
                          <Check size={12} /> Recebido
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Modal Nova Receita */}
      {modalReceita && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Receipt size={16} className="text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm">Nova Receita</h3>
              </div>
              <button onClick={() => setModalReceita(false)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-3">
              {[
                { label: 'Data *', key: 'data', type: 'date' },
                { label: 'Cliente *', key: 'cliente', type: 'text', ph: 'Nome do cliente' },
                { label: 'Procedimento *', key: 'proc', type: 'text', ph: 'Ex: Drenagem Linfática' },
                { label: 'Valor (R$) *', key: 'valor', type: 'number', ph: '0,00' },
              ].map(({ label, key, type, ph }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
                  <input
                    type={type}
                    placeholder={ph}
                    value={formReceita[key]}
                    onChange={(e) => setFormReceita((p) => ({ ...p, [key]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c47a85]/30"
                  />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Forma de Pagamento</label>
                  <select
                    value={formReceita.forma}
                    onChange={(e) => setFormReceita((p) => ({ ...p, forma: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c47a85]/30"
                  >
                    {FORMAS_PAGAMENTO.map((f) => <option key={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
                  <select
                    value={formReceita.status}
                    onChange={(e) => setFormReceita((p) => ({ ...p, status: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c47a85]/30"
                  >
                    <option value="recebido">Recebido</option>
                    <option value="pendente">Pendente</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-gray-100 flex justify-end gap-2">
              <button onClick={() => setModalReceita(false)} className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors">
                Cancelar
              </button>
              <button onClick={salvarReceita} className="px-4 py-2 bg-[#c47a85] hover:bg-[#b5606e] text-white rounded-xl text-xs font-semibold transition-colors">
                Salvar Receita
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nova Despesa */}
      {modalDespesa && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center">
                  <ShoppingCart size={16} className="text-red-500" />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm">Nova Despesa</h3>
              </div>
              <button onClick={() => setModalDespesa(false)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-3">
              {[
                { label: 'Data *', key: 'data', type: 'date' },
                { label: 'Descrição *', key: 'desc', type: 'text', ph: 'Ex: Compra de materiais' },
                { label: 'Valor (R$) *', key: 'valor', type: 'number', ph: '0,00' },
              ].map(({ label, key, type, ph }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
                  <input
                    type={type}
                    placeholder={ph}
                    value={formDespesa[key]}
                    onChange={(e) => setFormDespesa((p) => ({ ...p, [key]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c47a85]/30"
                  />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Categoria</label>
                  <select
                    value={formDespesa.categoria}
                    onChange={(e) => setFormDespesa((p) => ({ ...p, categoria: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c47a85]/30"
                  >
                    {CATEGORIAS_DESPESA.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Forma de Pagamento</label>
                  <select
                    value={formDespesa.forma}
                    onChange={(e) => setFormDespesa((p) => ({ ...p, forma: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c47a85]/30"
                  >
                    {FORMAS_PAGAMENTO.map((f) => <option key={f}>{f}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-gray-100 flex justify-end gap-2">
              <button onClick={() => setModalDespesa(false)} className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors">
                Cancelar
              </button>
              <button onClick={salvarDespesa} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-semibold transition-colors">
                Salvar Despesa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
