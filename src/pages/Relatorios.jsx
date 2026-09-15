import React from 'react';
import {
  Users,
  TrendingUp,
  Share2,
  FileText,
  Lock,
  Download
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Relatorios() {
  const { isSecretaria } = useAuth();

  const retencaoProcedimentos = [
    { proc: 'Drenagem Linfática', atendimentos: 48, tempoMedio: '60 min', retorno: '88%' },
    { proc: 'Limpeza de Pele Profunda', atendimentos: 35, tempoMedio: '45 min', retorno: '72%' },
    { proc: 'Radiofrequência', atendimentos: 28, tempoMedio: '60 min', retorno: '81%' },
    { proc: 'Redução de Medidas', atendimentos: 24, tempoMedio: '90 min', retorno: '79%' },
  ];

  const canaisAquisicao = [
    { canal: 'Instagram / Redes Sociais', pct: 45, cor: 'bg-[#c47a85]' },
    { canal: 'Indicação de Pacientes', pct: 30, cor: 'bg-[#b5606e]' },
    { canal: 'Google / Pesquisa Local', pct: 18, cor: 'bg-[#d89ba4]' },
    { canal: 'Passantes / Fachada', pct: 7, cor: 'bg-[#eec5cb]' },
  ];

  const mesesEvolucao = [
    { mes: 'Abr', novos: 8, altura: '50%' },
    { mes: 'Mai', novos: 12, altura: '75%' },
    { mes: 'Jun', novos: 15, altura: '95%' },
    { mes: 'Jul', novos: 9, altura: '58%' },
    { mes: 'Ago', novos: 14, altura: '88%' },
    { mes: 'Set', novos: 12, altura: '75%' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-poppins">
      {/* Header com Ação */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-800">Relatório de Atendimentos & Clientes</h2>
          <p className="text-xs text-gray-400 mt-0.5">Indicadores de aquisição e recorrência na clínica</p>
        </div>

        <button
          onClick={() => alert('Exportando relatório operacional em PDF...')}
          className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs font-semibold shadow-2xs transition-all"
        >
          <Download size={15} />
          <span>Exportar Relatório (PDF)</span>
        </button>
      </div>

      {/* Grid: Gráfico de Evolução + Origem dos Clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Novos Clientes Cadastrados */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-rose-600" />
              <h3 className="text-xs font-semibold text-gray-800">Novos Clientes Cadastrados (2026)</h3>
            </div>
            <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full">
              Mês a Mês
            </span>
          </div>

          <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2 border-b border-gray-100">
            {mesesEvolucao.map((item) => (
              <div key={item.mes} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[10px] font-bold text-gray-600">{item.novos}</span>
                <div
                  className="w-full max-w-[32px] bg-[#c47a85] rounded-t-lg transition-all hover:opacity-85"
                  style={{ height: item.altura }}
                />
                <span className="text-[11px] text-gray-400 font-medium">{item.mes}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Canais de Aquisição */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Share2 size={16} className="text-purple-600" />
              <h3 className="text-xs font-semibold text-gray-800">Origem dos Contatos & Agendamentos</h3>
            </div>
            <span className="text-[10px] text-gray-400 font-medium">Canais Ativos</span>
          </div>

          <div className="space-y-3.5 my-auto">
            {canaisAquisicao.map((canal) => (
              <div key={canal.canal}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-700 font-medium">{canal.canal}</span>
                  <span className="text-gray-800 font-bold">{canal.pct}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div className={`h-full rounded-full ${canal.cor}`} style={{ width: `${canal.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabela de Retenção */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <Users size={16} className="text-[#b5606e]" />
          <h3 className="text-xs font-semibold text-gray-800">Retenção & Frequência por Procedimento</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider text-[11px] bg-gray-50/50">
                <th className="py-2.5 px-3 font-semibold">Procedimento</th>
                <th className="py-2.5 px-3 font-semibold">Total Atendimentos</th>
                <th className="py-2.5 px-3 font-semibold">Tempo Médio</th>
                <th className="py-2.5 px-3 font-semibold">Taxa de Retorno</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {retencaoProcedimentos.map((r) => (
                <tr key={r.proc} className="hover:bg-rose-50/20">
                  <td className="py-2.5 px-3 font-medium text-gray-800">{r.proc}</td>
                  <td className="py-2.5 px-3">{r.atendimentos} sessões</td>
                  <td className="py-2.5 px-3 text-gray-500">{r.tempoMedio}</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-600">{r.retorno}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Aviso de Relatórios Restritos */}
      {isSecretaria && (
        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/70 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2.5">
            <Lock size={16} className="text-gray-400" />
            <span>
              Relatórios financeiros avançados (DRE e receitas) e auditoria contábil são de acesso exclusivo da <strong>Administradora</strong>.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
