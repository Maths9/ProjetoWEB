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
  const [visualizacao, setVisualizacao] = useState('calendario');

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

  // Auxiliares de data e hora atuais (formato YYYY-MM-DD e HH:MM)
  const getHojeISO = () => {
    const agora = new Date();
    return `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}-${String(agora.getDate()).padStart(2, '0')}`;
  };

  const getAgoraTempo = () => {
    const agora = new Date();
    return `${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`;
  };

  const hojeISO = getHojeISO();
  const agoraTempo = getAgoraTempo();

  // Abrir modal novo
  const handleNovoAgendamento = (dataEspecifica) => {
    const hoje = getHojeISO();
    const dataAlvo = typeof dataEspecifica === 'string' ? dataEspecifica : dataSelecionada;

    if (dataAlvo < hoje) {
      alert(`⚠️ A data selecionada (${dataAlvo.split('-').reverse().join('/')}) já passou.\nPor favor, escolha a data de hoje (${hoje.split('-').reverse().join('/')}) ou uma data futura.`);
      return;
    }

    setAgendamentoEditando(null);
    const horaAtual = getAgoraTempo();
    const horaDefault = dataAlvo === hoje && horaAtual > '09:00' ? horaAtual : '09:00';

    setFormData({
      data: dataAlvo,
      hora: horaDefault,
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

    // --- Validação estrita de data/hora no passado ---
    if (!agendamentoEditando) {
      const hoje = getHojeISO();
      const horaAtual = getAgoraTempo();

      if (formData.data < hoje) {
        alert(`⚠️ Não é possível agendar em datas passadas (${formData.data.split('-').reverse().join('/')}).\nEscolha a data de hoje ou uma data futura.`);
        return;
      }

      if (formData.data === hoje && formData.hora < horaAtual) {
        alert(`⚠️ O horário selecionado (${formData.hora}) já passou hoje.\nO horário atual é ${horaAtual}.`);
        return;
      }
    }

    if (!formData.clienteId || !formData.procedimentoId) {
      alert('Selecione um cliente e um procedimento.');
      return;
    }

    try {
      const payload = {
        data: formData.data,
        hora: formData.hora,
        duracaoMin: Number(formData.duracaoMin),
        valor: Number(formData.valor),
        cliente: { id: Number(formData.clienteId) },
        procedimento: { id: Number(formData.procedimentoId) },
        status: 'CONFIRMADO',
      };

      let res;
      if (agendamentoEditando) {
        // PUT correto para editar
        res = await fetch(`http://localhost:8080/api/v1/agendamentos/${agendamentoEditando}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        // POST para criar novo
        res = await fetch('http://localhost:8080/api/v1/agendamentos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        alert(err?.message || 'Erro ao salvar agendamento. Tente novamente.');
        return;
      }

      setModalAberto(false);
      // Navega para a data do agendamento salvo para mostrar imediatamente no calendário
      setDataSelecionada(formData.data);
      await carregarAgendamentos();
    } catch (e) {
      console.error(e);
      alert('Erro de conexão com o servidor.');
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
            {['calendario', 'lista', 'semanal'].map((modo) => (
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

      {/* VIEW: CALENDARIO */}
      {visualizacao === 'calendario' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5">
          <Calendario
            agendamentos={agendamentos}
            onNovoAgendamento={handleNovoAgendamento}
            onEditarAgendamento={handleEditar}
            onAtualizarStatus={atualizarStatus}
            onExcluirAgendamento={handleExcluirAgendamento}
          />
        </div>
      )}

      {/* VIEW: SEMANAL */}
      {visualizacao === 'semanal' && (() => {
        // Calcula a semana que contém dataSelecionada (Domingo = 0)
        const baseDate = new Date(dataSelecionada + 'T12:00:00');
        const diaDaSemana = baseDate.getDay(); // 0=Dom..6=Sáb
        const inicioSemana = new Date(baseDate);
        inicioSemana.setDate(baseDate.getDate() - diaDaSemana); // vai para domingo

        const diasDaSemana = Array.from({ length: 7 }, (_, i) => {
          const d = new Date(inicioSemana);
          d.setDate(inicioSemana.getDate() + i);
          const dataStr = d.toISOString().split('T')[0];
          const nomesDia = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
          const label = `${nomesDia[i]} ${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`;
          return { label, data: dataStr };
        });

        return (
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
            <p className="text-xs font-semibold text-gray-500 mb-3">
              Semana de {diasDaSemana[0].label.split(' ')[1]} a {diasDaSemana[6].label.split(' ')[1]}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
              {diasDaSemana.map((dia) => {
                const itens = agendamentos.filter((a) => a.data === dia.data);
                const isToday = dia.data === dataSelecionada;
                return (
                  <div
                    key={dia.data}
                    onClick={() => { setDataSelecionada(dia.data); setVisualizacao('lista'); }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isToday ? 'border-rose-300 bg-rose-50/30' : 'border-gray-100 bg-gray-50/50 hover:border-rose-200'
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
                            <div className="font-bold text-gray-800">
                              {typeof it.hora === 'string' ? it.hora.slice(0,5) : it.hora} – {it.cliente?.nome || 'Cliente'}
                            </div>
                            <div className="text-gray-500 truncate">{it.procedimento?.nome || ''}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* VIEW: MENSAL */}
      {visualizacao === 'mensal' && (() => {
        const refDate = new Date(dataSelecionada + 'T12:00:00');
        const ano = refDate.getFullYear();
        const mes = refDate.getMonth(); // 0-indexed
        const nomeMes = refDate.toLocaleString('pt-BR', { month: 'long' });
        const diasNoMes = new Date(ano, mes + 1, 0).getDate();
        const primeiroDiaSemana = new Date(ano, mes, 1).getDay(); // 0=Dom
        const totalCelulas = primeiroDiaSemana + diasNoMes;
        const linhas = Math.ceil(totalCelulas / 7);
        const totalCom = linhas * 7;

        const irParaMesAnterior = () => {
          const d = new Date(ano, mes - 1, 1);
          setDataSelecionada(d.toISOString().split('T')[0]);
        };
        const irParaMesSeguinte = () => {
          const d = new Date(ano, mes + 1, 1);
          setDataSelecionada(d.toISOString().split('T')[0]);
        };

        return (
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
            {/* Cabeçalho do mês */}
            <div className="flex items-center justify-between mb-4">
              <button onClick={irParaMesAnterior} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 text-sm">‹</button>
              <span className="font-semibold text-gray-700 text-sm capitalize">
                {nomeMes} {ano}
              </span>
              <button onClick={irParaMesSeguinte} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 text-sm">›</button>
            </div>

            {/* Nomes dos dias */}
            <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-semibold text-gray-400 mb-2">
              {['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map(d => <div key={d}>{d}</div>)}
            </div>

            {/* Células do calendário */}
            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: totalCom }, (_, i) => {
                const diaNum = i - primeiroDiaSemana + 1;
                const valido = diaNum >= 1 && diaNum <= diasNoMes;
                if (!valido) return <div key={i} />;

                const diaFmt = String(diaNum).padStart(2, '0');
                const mesFmt = String(mes + 1).padStart(2, '0');
                const dataStr = `${ano}-${mesFmt}-${diaFmt}`;
                const ags = agendamentos.filter((a) => a.data === dataStr);
                const isSelected = dataStr === dataSelecionada;

                return (
                  <div
                    key={i}
                    onClick={() => { setDataSelecionada(dataStr); setVisualizacao('lista'); }}
                    className={`h-16 p-2 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                      isSelected ? 'border-rose-400 bg-rose-50/50' : 'border-gray-100 hover:border-rose-200 bg-gray-50/30'
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
        );
      })()}

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
                    min={agendamentoEditando ? undefined : hojeISO}
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
                    min={(!agendamentoEditando && formData.data === hojeISO) ? agoraTempo : undefined}
                    onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-rose-400"
                  />
                  {!agendamentoEditando && formData.data === hojeISO && (
                    <p className="text-[10px] text-amber-500 mt-0.5">Horários passados bloqueados</p>
                  )}
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
