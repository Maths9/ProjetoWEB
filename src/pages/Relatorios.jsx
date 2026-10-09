import React, { useRef, useState, useEffect } from 'react';
import {
  Users,
  TrendingUp,
  Share2,
  FileText,
  Lock,
  Download,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const FMT_BRL = (valor) =>
  Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export function Relatorios() {
  const { isSecretaria } = useAuth();
  const reportRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const [dadosRelatorio, setDadosRelatorio] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/relatorios/resumo')
      .then((res) => res.json())
      .then((dados) => {
        setDadosRelatorio(dados);
        setCarregando(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar resumo de relatórios:', err);
        setCarregando(false);
      });
  }, []);

  const estatisticas = dadosRelatorio?.estatisticasProcedimentos || [];
  const novosClientesMes = dadosRelatorio?.novosClientesPorMes || [];

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth - 20, pdfHeight - 20);
      pdf.save('relatorio-clinica-nexa.pdf');
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      alert('Ocorreu um erro ao exportar o relatório.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCSV = () => {
    if (!estatisticas.length) return;

    const headers = ['Procedimento', 'Total Atendimentos', 'Tempo Medio (min)', 'Valor Total (R$)'];
    const rows = estatisticas.map((e) => [
      `"${e.nome}"`,
      e.totalAtendimentos,
      e.tempoMedioMin,
      Number(e.valorTotal || 0).toFixed(2)
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'relatorio-procedimentos.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-poppins">
      {/* Header com Ações */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-800">Relatórios de Atendimento & Performance</h2>
          <p className="text-xs text-gray-400 mt-0.5">Indicadores consolidados de procedimentos e histórico de atendimentos</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-2xs transition-all"
          >
            <FileText size={14} className="text-emerald-600" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className={`flex items-center gap-2 bg-[#c47a85] hover:bg-[#b5606e] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-all ${
              isExporting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Download size={14} />
            <span>{isExporting ? 'Gerando PDF...' : 'Exportar PDF'}</span>
          </button>
        </div>
      </div>

      {/* Conteúdo do Relatório a ser exportado */}
      <div ref={reportRef} className="space-y-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
        {/* KPIs de Resumo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Total de Atendimentos</span>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              {carregando ? '...' : dadosRelatorio?.totalAtendimentos ?? 0}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">sessões registradas</p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Faturamento em Sessões</span>
            <p className="text-2xl font-bold text-emerald-700 mt-1">
              {carregando ? '...' : FMT_BRL(dadosRelatorio?.faturamentoTotal)}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">valor total em atendimentos</p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Procedimentos Ativos</span>
            <p className="text-2xl font-bold text-purple-700 mt-1">
              {carregando ? '...' : estatisticas.length}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">protocolos no catálogo</p>
          </div>
        </div>

        {/* Tabela de Estatísticas por Procedimento */}
        <div className="border border-gray-100 rounded-2xl overflow-hidden">
          <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-[#b5606e]" />
              <h3 className="text-xs font-semibold text-gray-800">Desempenho por Procedimento</h3>
            </div>
            <span className="text-[11px] text-gray-400">Total acumulado</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider text-[10px] bg-white">
                  <th className="py-2.5 px-4 font-semibold">Procedimento</th>
                  <th className="py-2.5 px-4 font-semibold">Atendimentos</th>
                  <th className="py-2.5 px-4 font-semibold">Tempo Médio</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Faturamento Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {carregando ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-400">
                      Carregando dados estatísticos...
                    </td>
                  </tr>
                ) : estatisticas.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-400">
                      Nenhum procedimento registrado com atendimentos.
                    </td>
                  </tr>
                ) : (
                  estatisticas.map((r) => (
                    <tr key={r.nome} className="hover:bg-rose-50/20">
                      <td className="py-3 px-4 font-medium text-gray-800">{r.nome}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-gray-700">{r.totalAtendimentos}</span> sessões
                      </td>
                      <td className="py-3 px-4 text-gray-500">{r.tempoMedioMin} min</td>
                      <td className="py-3 px-4 font-bold text-emerald-700 text-right">
                        {FMT_BRL(r.valorTotal)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
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
