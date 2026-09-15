import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  UserPlus,
  Target,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  Sparkles,
  ChevronRight,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  Bot,
  Percent
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AGENDAMENTOS_INICIAIS } from '../data/agendamentos';
import { PRODUTOS_INICIAIS } from '../data/estoque';

export function Dashboard() {
  const { user, isAdmin } = useAuth();

  const agendamentosHoje = AGENDAMENTOS_INICIAIS.filter(
    (a) => a.data === '2026-09-12'
  );

  const estoqueCritico = PRODUTOS_INICIAIS.filter((p) => p.status === 'critico');

  const procedimentosPopulares = [
    { nome: 'Drenagem Linfática', qtd: 48, pct: 40, cor: 'bg-[#c47a85]' },
    { nome: 'Limpeza de Pele Profunda', qtd: 32, pct: 28, cor: 'bg-[#b5606e]' },
    { nome: 'Radiofrequência Facial', qtd: 24, pct: 20, cor: 'bg-[#d89ba4]' },
    { nome: 'Redução de Medidas', qtd: 16, pct: 12, cor: 'bg-[#eec5cb]' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-poppins">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#c47a85] to-[#b5606e] rounded-3xl p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="bg-white/20 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-xs">
            {isAdmin ? 'Painel Executivo & Governança' : 'Recepção & Atendimento'}
          </span>
          <h1 className="text-xl font-bold mt-2">
            Olá, {user?.nome || (isAdmin ? 'Clarissa' : 'Mariana')}! ✨
          </h1>
          <p className="text-white/80 text-xs mt-0.5">
            {isAdmin
              ? 'Visão holística de faturamento, equipe e operações da clínica neste mês.'
              : `Você tem ${agendamentosHoje.length} atendimentos programados para hoje na clínica.`}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {isAdmin ? (
            <>
              <Link
                to="/financeiro"
                className="px-4 py-2 bg-white text-[#b5606e] hover:bg-rose-50 rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <DollarSign size={14} /> Ver Financeiro
              </Link>
              <Link
                to="/chatbot"
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Bot size={14} /> Chatbot IA
              </Link>
            </>
          ) : (
            <Link
              to="/agendamento"
              className="px-4 py-2 bg-white text-[#b5606e] hover:bg-rose-50 rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              Ver Agenda Completa
            </Link>
          )}
        </div>
      </div>

      {/* Admin-Only Financial Highlights */}
      {isAdmin && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-100 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-xs font-medium">Faturamento (Mês)</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <TrendingUp size={16} />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <p className="text-xl font-bold text-gray-800">R$ 12.840</p>
                <span className="text-emerald-600 text-[11px] font-semibold">+14%</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">meta: R$ 15.000</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-100 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-xs font-medium">Despesas Totais</span>
              <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
                <DollarSign size={16} />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <p className="text-xl font-bold text-gray-800">R$ 4.320</p>
                <span className="text-gray-400 text-[11px] font-semibold">-3%</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">custo operacional</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-100 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-xs font-medium">Lucro Líquido</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Sparkles size={16} />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <p className="text-xl font-bold text-blue-600">R$ 8.520</p>
                <span className="text-blue-600 text-[11px] font-semibold">66.3%</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">margem líquida</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-100 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-xs font-medium">Taxa Conversão</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <Percent size={16} />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <p className="text-xl font-bold text-purple-700">68.4%</p>
                <span className="text-emerald-600 text-[11px] font-semibold">+5.2%</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">leads → pacientes</p>
            </div>
          </div>
        </div>
      )}

      {/* Operational KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs font-medium">Total de Clientes</span>
            <div className="w-8 h-8 rounded-xl bg-pink-50 flex items-center justify-center text-rose-600">
              <Users size={16} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-gray-800">148</p>
              <span className="text-emerald-600 text-[11px] font-semibold flex items-center">
                +8%
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">pacientes na base</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs font-medium">Novos este Mês</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <UserPlus size={16} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-gray-800">12</p>
              <span className="text-blue-600 text-[11px] font-semibold">novos cadastros</span>
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">setembro 2026</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs font-medium">Potenciais Leads</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Target size={16} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-gray-800">34</p>
              <span className="text-amber-600 text-[11px] font-semibold">a contatar</span>
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">aguardando retorno</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs font-medium">Agendados Hoje</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <Calendar size={16} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-purple-700">{agendamentosHoje.length}</p>
              <span className="text-purple-600 text-[11px] font-semibold">atendimentos</span>
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">confirmados & fila</p>
          </div>
        </div>
      </div>

      {/* Grid: Agenda de Hoje + Destaques de Estoque & Procedimentos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Atendimentos de Hoje */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
            <div className="flex items-center gap-2">
              <Clock size={17} className="text-rose-600" />
              <h2 className="text-sm font-semibold text-gray-800">Próximos Atendimentos (Hoje)</h2>
            </div>
            <Link to="/agendamento" className="text-xs text-rose-600 hover:underline flex items-center gap-1 font-medium">
              Ver agenda <ChevronRight size={14} />
            </Link>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs text-gray-600">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3 font-semibold">Horário</th>
                  <th className="py-2.5 px-3 font-semibold">Cliente</th>
                  <th className="py-2.5 px-3 font-semibold">Procedimento</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {agendamentosHoje.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-400">
                      Nenhum atendimento restante hoje.
                    </td>
                  </tr>
                ) : (
                  agendamentosHoje.map((a) => {
                    const statusClass =
                      a.status === 'confirmado'
                        ? 'badge-green'
                        : a.status === 'aguardando'
                        ? 'badge-yellow'
                        : 'badge-red';
                    return (
                      <tr key={a.id} className="hover:bg-rose-50/20">
                        <td className="py-2.5 px-3 font-bold text-gray-800">{a.hora}</td>
                        <td className="py-2.5 px-3 font-medium text-gray-700">{a.cliente}</td>
                        <td className="py-2.5 px-3 text-gray-500">{a.proc}</td>
                        <td className="py-2.5 px-3">
                          <span className={`badge ${statusClass} capitalize`}>{a.status}</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Coluna Direita: Alertas & Procedimentos */}
        <div className="space-y-4">
          {/* Alerta de Estoque */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-500" />
                <h3 className="text-xs font-semibold text-gray-800">Atenção no Estoque</h3>
              </div>
              <Link to="/estoque" className="text-[11px] text-rose-600 hover:underline">
                Consultar →
              </Link>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Existem <strong>{estoqueCritico.length} produtos</strong> abaixo da cota mínima na sala de procedimentos.
            </p>
            <div className="space-y-2">
              {estoqueCritico.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-red-50/50 border border-red-100 text-xs"
                >
                  <span className="font-medium text-gray-800">{p.nome}</span>
                  <span className="font-bold text-red-600 text-[11px]">
                    {p.qtd} un. (mín: {p.minimo})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Procedimentos mais realizados */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs">
            <h3 className="text-xs font-semibold text-gray-800 mb-3">Tratamentos Mais Procurados</h3>
            <div className="space-y-3">
              {procedimentosPopulares.map((item) => (
                <div key={item.nome}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-700 font-medium">{item.nome}</span>
                    <span className="text-gray-400 font-semibold">{item.qtd} sessões</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div className={`h-full rounded-full ${item.cor}`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
