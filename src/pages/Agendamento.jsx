import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  ChevronLeft,
  ChevronRight,
  Edit2,
  X,
  User,
  Sparkles,
  Trash2
} from 'lucide-react';
import Calendario from './Calendario';

export function Agendamento() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [clientesDisponiveis, setClientesDisponiveis] = useState([]);
  const [procedimentosDisponiveis, setProcedimentosDisponiveis] = useState([]);
  const [dataSelecionada, setDataSelecionada] = useState(new Date().toISOString().split('T')[0]);
  const [visualizacao, setVisualizacao] = useState('lista');

  // Modal State
  const [modalAberto, setModalAberto] = useState(false);
  const [agendamentoEditando, setAgendamentoEditando] = useState(null);
  const [formData, setFormData] = useState({
    data: new Date().toISOString().split('T')[0],
    hora: '09:00',
    clienteId: '',
    procedimentoId: '',
    duracaoMin: 60,
    valor: 180,
  });

  // Carregar dados da API
  useEffect(() => {
    carregarAgendamentos();
    carregarClientes();
    carregarProcedimentos();
  }, []);

  const carregarAgendamentos = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/v1/agendamentos');
      if (res.ok) setAgendamentos(await res.json());
    } catch (e) { console.error(e); }
  };

  const carregarClientes = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/v1/clientes');
      if (res.ok) setClientesDisponiveis(await res.json());
    } catch (e) { console.error(e); }
  };

  const carregarProcedimentos = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/v1/procedimentos');
      if (res.ok) setProcedimentosDisponiveis(await res.json());
    } catch (e) { console.error(e); }
  };

  // KPIs calculados com base no dia selecionado
  const agendamentosDoDia = agendamentos.filter((a) => a.data === dataSelecionada);
  const totalDia = agendamentosDoDia.length;
  const confirmadosDia = agendamentosDoDia.filter((a) => a.status === 'CONFIRMADO').length;
  const aguardandoDia = agendamentosDoDia.filter((a) => a.status === 'AGUARDANDO').length;
  const canceladosDia = agendamentosDoDia.filter((a) => a.status === 'CANCELADO').length;

  // Navegação de datas
  const mudarData = (dias) => {
    const d = new Date(dataSelecionada + 'T12:00:00');
    d.setDate(d.getDate() + dias);
    setDataSelecionada(d.toISOString().split('T')[0]);
  };

  const irParaHoje = () => {
    setDataSelecionada(new Date().toISOString().split('T')[0]);
  };

  // Ações de status
  const atualizarStatus = async (id, novoStatus) => {
    try {
      await fetch(`http://localhost:8080/api/v1/agendamentos/${id}/status?status=${novoStatus}`, { method: 'PATCH' });
      carregarAgendamentos();
    } catch (e) { console.error(e); }
  };

  // Abrir modal novo
  const handleNovoAgendamento = () => {
    setAgendamentoEditando(null);
    setFormData({
      data: dataSelecionada,
      hora: '09:00',
      clienteId: clientesDisponiveis[0]?.id || '',
      procedimentoId: procedimentosDisponiveis[0]?.id || '',
      duracaoMin: procedimentosDisponiveis[0]?.duracaoMin || 60,
      valor: procedimentosDisponiveis[0]?.valor || 180,
    });
    setModalAberto(true);
  };

  // Abrir modal edição
  const handleEditar = (agendamento) => {
    setAgendamentoEditando(agendamento.id);
    setFormData({
      data: agendamento.data,
      hora: agendamento.hora,
      clienteId: agendamento.cliente?.id || agendamento.clienteId,
      procedimentoId: agendamento.procedimento?.id || agendamento.procedimentoId,
      duracaoMin: agendamento.duracaoMin,
      valor: agendamento.valor,
    });
    setModalAberto(true);
  };

  const handleExcluirAgendamento = async (id) => {
    if (!confirm('Deseja realmente excluir este agendamento criado por engano?')) return;
    try {
      const res = await fetch(`http://localhost:8080/api/v1/agendamentos/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        carregarAgendamentos();
      } else {
        alert('Não foi possível excluir o agendamento.');
      }
    } catch (e) {
      console.error('Erro ao excluir agendamento:', e);
    }
  };

  // Procedimento change
  const handleProcedimentoChange = (id) => {
    const p = procedimentosDisponiveis.find((item) => item.id.toString() === id.toString());
    setFormData((prev) => ({
      ...prev,
      procedimentoId: id,
      duracaoMin: p ? p.duracaoMin : prev.duracaoMin,
      valor: p ? p.valor : prev.valor,
    }));
  };

  // Salvar agendamento
  const handleSalvar = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        cliente: { id: formData.clienteId },
        procedimento: { id: formData.procedimentoId }
      };

      if (agendamentoEditando) {
        // Mocking PUT since AgendamentoController might not have PUT. Usually we POST to save/update
        await fetch(`http://localhost:8080/api/v1/agendamentos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: agendamentoEditando, ...payload })
        });
      } else {
        await fetch('http://localhost:8080/api/v1/agendamentos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, status: 'CONFIRMADO' })
        });
      }
      setModalAberto(false);
      carregarAgendamentos();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs font-medium">Total do Dia</span>
            <div className="w-8 h-8 rounded-xl bg-pink-50 flex items-center justify-center text-rose-600">
              <CalendarIcon size={16} />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{totalDia}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">agendamentos marcados</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs font-medium">Confirmados</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle size={16} />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-600">{confirmadosDia}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">atendimentos certos</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs font-medium">Aguardando</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock size={16} />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-amber-600">{aguardandoDia}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">pendente confirmação</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs font-medium">Cancelados</span>
            <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
              <XCircle size={16} />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-500">{canceladosDia}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">desmarcados</p>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Date navigation */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-100 shadow-2xs">
          <button
            onClick={() => mudarData(-1)}
            className="p-1 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-50"
            title="Dia anterior"
          >
            <ChevronLeft size={16} />
          </button>
          <input
            type="date"
            value={dataSelecionada}
            onChange={(e) => setDataSelecionada(e.target.value)}
            className="text-xs font-semibold text-gray-700 bg-transparent border-0 focus:outline-none cursor-pointer"
          />
          <button
            onClick={() => mudarData(1)}
            className="p-1 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-50"
            title="Próximo dia"
          >
            <ChevronRight size={16} />
          </button>
          <button
            onClick={irParaHoje}
            className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 border-l border-gray-100 pl-2 ml-1"
          >
            Hoje
          </button>
        </div>

        {/* View Switcher & Action */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white p-1 rounded-xl border border-gray-100 shadow-2xs">
            {['lista', 'semanal', 'calendario', 'mensal'].map((modo) => (
              <button
                key={modo}
                onClick={() => setVisualizacao(modo)}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all capitalize ${
                  visualizacao === modo
                    ? 'bg-[#c47a85] text-white font-semibold shadow-2xs'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {modo}
              </button>
            ))}
          </div>

          <button
            onClick={handleNovoAgendamento}
            className="flex items-center gap-1.5 bg-[#c47a85] hover:bg-[#b5606e] text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>Novo Agendamento</span>
          </button>
        </div>
      </div>

      {/* VIEW: LISTA */}
      {visualizacao === 'lista' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider text-[11px] bg-gray-50/50">
                  <th className="py-3 px-4 font-semibold">Horário</th>
                  <th className="py-3 px-4 font-semibold">Cliente</th>
                  <th className="py-3 px-4 font-semibold">Procedimento</th>
                  <th className="py-3 px-4 font-semibold">Duração</th>
                  <th className="py-3 px-4 font-semibold">Valor</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Ações Rápidas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {agendamentosDoDia.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-400">
                      Nenhum agendamento encontrado para esta data.
                    </td>
                  </tr>
                ) : (
                  agendamentosDoDia
                    .sort((a, b) => a.hora.localeCompare(b.hora))
                    .map((item) => {
                      const badgeClasses = {
                        confirmado: 'badge-green',
                        aguardando: 'badge-yellow',
                        cancelado: 'badge-red',
                      };
                      return (
                        <tr key={item.id} className="hover:bg-rose-50/30 transition-colors">
                          <td className="py-3 px-4 font-bold text-gray-800">{item.hora}</td>
                          <td className="py-3 px-4 font-medium text-gray-800">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-[10px]">
                                {item.cliente?.nome?.charAt(0) || '?'}
                              </div>
                              <span>{item.cliente?.nome}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{item.procedimento?.nome}</td>
                          <td className="py-3 px-4 text-gray-400">{item.duracaoMin} min</td>
                          <td className="py-3 px-4 font-semibold text-gray-700">
                            R$ {Number(item.valor).toFixed(2).replace('.', ',')}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`badge ${badgeClasses[item.status] || 'badge-gray'} capitalize`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {item.status !== 'CONFIRMADO' && (
                                <button
                                  onClick={() => atualizarStatus(item.id, 'CONFIRMADO')}
                                  title="Confirmar Presença"
                                  className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                >
                                  <CheckCircle size={15} />
                                </button>
                              )}
                              <button
                                onClick={() => handleEditar(item)}
                                title="Editar Agendamento"
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Edit2 size={15} />
                              </button>
                              {item.status !== 'CANCELADO' && (
                                <button
                                  onClick={() => atualizarStatus(item.id, 'CANCELADO')}
                                  title="Cancelar Atendimento"
                                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <XCircle size={15} />
                                </button>
                              )}
                              <button
                                onClick={() => handleExcluirAgendamento(item.id)}
                                title="Excluir Agendamento (Criado por engano)"
                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 size={15} />
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
      )}

      {/* VIEW: CALENDARIO - combined list and calendar */}
      {visualizacao === 'calendario' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="p-4">
            {/* List view (same as lista) */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider text-[11px] bg-gray-50/50">
                    <th className="py-3 px-4 font-semibold">Horário</th>
                    <th className="py-3 px-4 font-semibold">Cliente</th>
                    <th className="py-3 px-4 font-semibold">Procedimento</th>
                    <th className="py-3 px-4 font-semibold">Duração</th>
                    <th className="py-3 px-4 font-semibold">Valor</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Ações Rápidas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {agendamentosDoDia.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-gray-400">
                        Nenhum agendamento encontrado para esta data.
                      </td>
                    </tr>
                  ) : (
                    agendamentosDoDia
                      .sort((a, b) => a.hora.localeCompare(b.hora))
                      .map((item) => {
                        const badgeClasses = {
                          confirmado: 'badge-green',
                          aguardando: 'badge-yellow',
                          cancelado: 'badge-red',
                        };
                        return (
                          <tr key={item.id} className="hover:bg-rose-50/30 transition-colors">
                            <td className="py-3 px-4 font-bold text-gray-800">{item.hora}</td>
                            <td className="py-3 px-4 font-medium text-gray-800">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-[10px]">
                                  {item.cliente?.nome?.charAt(0) || '?'}
                                </div>
                                <span>{item.cliente?.nome}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-600">{item.procedimento?.nome}</td>
                            <td className="py-3 px-4 text-gray-400">{item.duracaoMin} min</td>
                            <td className="py-3 px-4 font-semibold text-gray-700">
                              R$ {Number(item.valor).toFixed(2).replace('.', ',')}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`badge ${badgeClasses[item.status] || 'badge-gray'} capitalize`}>{item.status}</span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {item.status !== 'CONFIRMADO' && (
                                  <button
                                    onClick={() => atualizarStatus(item.id, 'CONFIRMADO')}
                                    title="Confirmar Presença"
                                    className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                  >
                                    <CheckCircle size={15} />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleEditar(item)}
                                  title="Editar Agendamento"
                                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                  <Edit2 size={15} />
                                </button>
                                {item.status !== 'CANCELADO' && (
                                  <button
                                    onClick={() => atualizarStatus(item.id, 'CANCELADO')}
                                    title="Cancelar Atendimento"
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  >
                                    <XCircle size={15} />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleExcluirAgendamento(item.id)}
                                  title="Excluir Agendamento (Criado por engano)"
                                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 size={15} />
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
            {/* Calendar below */}
            <div className="mt-6">
              <Calendario agendamentos={agendamentos} setAgendamentos={setAgendamentos} />
            </div>
          </div>
        </div>
      )}

      {/* VIEW: SEMANAL */}


      {/* VIEW: SEMANAL */}
      {visualizacao === 'semanal' && (
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {[
              { label: 'Seg 07/09', data: '2026-09-07' },
              { label: 'Ter 08/09', data: '2026-09-08' },
              { label: 'Qua 09/09', data: '2026-09-09' },
              { label: 'Qui 10/09', data: '2026-09-10' },
              { label: 'Sex 11/09', data: '2026-09-11' },
              { label: 'Sáb 12/09', data: '2026-09-12' },
              { label: 'Dom 13/09', data: '2026-09-13' },
            ].map((dia) => {
              const itens = agendamentos.filter((a) => a.data === dia.data);
              const isToday = dia.data === dataSelecionada;
              return (
                <div
                  key={dia.data}
                  className={`p-3 rounded-xl border transition-all ${
                    isToday ? 'border-rose-300 bg-rose-50/30' : 'border-gray-100 bg-gray-50/50'
                  }`}
                >
                  <p className={`font-semibold text-xs mb-2.5 ${isToday ? 'text-rose-600' : 'text-gray-600'}`}>
                    {dia.label}
                  </p>
                  <div className="space-y-2">
                    {itens.length === 0 ? (
                      <p className="text-[10px] text-gray-300 italic">Sem atendimentos</p>
                    ) : (
                      itens.map((it) => (
                        <div
                          key={it.id}
                          className="p-2 rounded-lg bg-white border border-rose-100 text-[11px] shadow-2xs"
                        >
                          <div className="font-bold text-gray-800">{it.hora} - {it.cliente?.nome}</div>
                          <div className="text-gray-500 truncate">{it.procedimento?.nome}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: MENSAL */}
      {visualizacao === 'mensal' && (
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <div className="text-center font-semibold text-gray-700 text-sm mb-4">Setembro 2026</div>
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-gray-400 mb-2">
            <div>Dom</div><div>Seg</div><div>Ter</div><div>Qua</div><div>Qui</div><div>Sex</div><div>Sáb</div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 30 }, (_, i) => {
              const diaNum = i + 1;
              const diaFmt = (diaNum < 10 ? '0' : '') + diaNum;
              const dataStr = `2026-09-${diaFmt}`;
              const ags = agendamentos.filter((a) => a.data === dataStr);
              const isSelected = dataStr === dataSelecionada;
              return (
                <div
                  key={diaNum}
                  onClick={() => {
                    setDataSelecionada(dataStr);
                    setVisualizacao('lista');
                  }}
                  className={`h-16 p-2 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                    isSelected ? 'border-rose-400 bg-rose-50/50' : 'border-gray-100 hover:border-gray-300 bg-gray-50/30'
                  }`}
                >
                  <span className={`text-xs font-semibold ${isSelected ? 'text-rose-600' : 'text-gray-700'}`}>
                    {diaNum}
                  </span>
                  {ags.length > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      <span className="text-[10px] font-bold text-rose-600">{ags.length} atend.</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL: NOVO / EDITAR */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800 text-sm">
                {agendamentoEditando ? 'Editar Agendamento' : 'Novo Agendamento'}
              </h3>
              <button
                onClick={() => setModalAberto(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSalvar} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Data *</label>
                  <input
                    type="date"
                    required
                    value={formData.data}
                    onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-rose-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Horário *</label>
                  <input
                    type="time"
                    required
                    value={formData.hora}
                    onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-rose-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Cliente *</label>
                <select
                  required
                  value={formData.clienteId}
                  onChange={(e) => setFormData({ ...formData, clienteId: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-rose-400 bg-white"
                >
                  <option value="">Selecione o cliente...</option>
                  {clientesDisponiveis.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Procedimento *</label>
                <select
                  required
                  value={formData.procedimentoId}
                  onChange={(e) => handleProcedimentoChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-rose-400 bg-white"
                >
                  <option value="">Selecione o procedimento...</option>
                  {procedimentosDisponiveis.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Duração (min)</label>
                  <input
                    type="number"
                    value={formData.duracaoMin}
                    onChange={(e) => setFormData({ ...formData, duracaoMin: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-rose-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Valor Estimado (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.valor}
                    onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-rose-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-500 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#c47a85] hover:bg-[#b5606e] rounded-xl shadow-xs transition-colors"
                >
                  {agendamentoEditando ? 'Salvar Alterações' : 'Confirmar Agendamento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
