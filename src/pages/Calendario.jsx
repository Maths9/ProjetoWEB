import React, { useState, useMemo, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Plus,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2
} from 'lucide-react';

const NOMES_DIA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const NOMES_MES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

function getNomeCliente(a) {
  if (!a.cliente) return 'Cliente';
  if (typeof a.cliente === 'object') return a.cliente.nome || 'Cliente';
  return a.cliente;
}

function getNomeProcedimento(a) {
  if (a.procedimento && typeof a.procedimento === 'object') return a.procedimento.nome || '';
  if (a.proc) return a.proc;
  return '';
}

function getHoraStr(a) {
  if (!a.hora) return '';
  return typeof a.hora === 'string' ? a.hora.slice(0, 5) : a.hora;
}

function getDataStr(a) {
  if (!a.data) return '';
  if (Array.isArray(a.data)) {
    const [y, m, d] = a.data;
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }
  return a.data;
}

const STATUS_STYLE = {
  CONFIRMADO: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
    text: 'text-emerald-800',
    badge: 'badge-green',
  },
  AGUARDANDO: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
    text: 'text-amber-800',
    badge: 'badge-yellow',
  },
  CANCELADO: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    dot: 'bg-red-400',
    text: 'text-red-800',
    badge: 'badge-red',
  },
  CONCLUIDO: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
    text: 'text-blue-800',
    badge: 'badge-blue',
  },
};

function getStatusStyle(status) {
  return STATUS_STYLE[(status || '').toUpperCase()] || STATUS_STYLE.CONFIRMADO;
}

// ─── MODAL DETALHES DO DIA ───────────────────────────────────────────────────
function DetalhesDia({
  dataStr,
  agendamentos,
  onFechar,
  onNovoAgendamento,
  onEditarAgendamento,
  onAtualizarStatus,
  onExcluirAgendamento,
}) {
  const itens = agendamentos
    .filter((a) => getDataStr(a) === dataStr)
    .sort((a, b) => getHoraStr(a).localeCompare(getHoraStr(b)));

  const [y, m, d] = dataStr.split('-').map(Number);
  const label = `${String(d).padStart(2, '0')} de ${NOMES_MES[m - 1]} de ${y}`;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150"
      onClick={onFechar}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 p-5 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <p className="text-xs text-gray-400 font-medium">
              {NOMES_DIA[new Date(dataStr + 'T12:00:00').getDay()]}
            </p>
            <h3 className="text-base font-bold text-gray-800">{label}</h3>
          </div>
          <button
            onClick={onFechar}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Botão Novo Agendamento para este dia (apenas para hoje ou datas futuras) */}
        {dataStr >= new Date().toISOString().split('T')[0] && onNovoAgendamento ? (
          <button
            onClick={() => {
              onFechar();
              onNovoAgendamento(dataStr);
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-[#c47a85] hover:bg-[#b5606e] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus size={15} />
            <span>Novo Agendamento para este dia</span>
          </button>
        ) : (
          <div className="text-center py-1.5 px-3 bg-gray-50 rounded-xl border border-gray-100 text-[11px] text-gray-400 font-medium">
            🔒 Data retroativa (apenas consulta ao histórico)
          </div>
        )}

        {/* Lista de Atendimentos */}
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {itens.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-6">
              Nenhum atendimento agendado para este dia.
            </p>
          ) : (
            itens.map((a) => {
              const s = getStatusStyle(a.status);
              return (
                <div
                  key={a.id}
                  className={`p-3 rounded-xl border ${s.bg} ${s.border} space-y-2`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className={`flex items-center gap-1.5 text-xs font-bold ${s.text}`}>
                        <Clock size={12} />
                        <span>{getHoraStr(a)}</span>
                        <span className="text-gray-300">·</span>
                        <User size={12} />
                        <span>{getNomeCliente(a)}</span>
                      </div>
                      <p className="text-xs text-gray-600 font-medium mt-0.5">
                        {getNomeProcedimento(a)} {a.duracaoMin ? `(${a.duracaoMin} min)` : ''}
                      </p>
                      {a.valor && (
                        <p className="text-[11px] text-gray-500 font-semibold">
                          R$ {Number(a.valor).toFixed(2).replace('.', ',')}
                        </p>
                      )}
                    </div>
                    <span className={`badge text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${s.badge || 'badge-gray'}`}>
                      {a.status}
                    </span>
                  </div>

                  {/* Ações rápidas */}
                  <div className="flex items-center justify-end gap-1 pt-1.5 border-t border-gray-200/60">
                    {a.status !== 'CONFIRMADO' && onAtualizarStatus && (
                      <button
                        onClick={() => onAtualizarStatus(a.id, 'CONFIRMADO')}
                        title="Confirmar Presença"
                        className="p-1 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg text-[11px]"
                      >
                        <CheckCircle size={14} />
                      </button>
                    )}
                    {a.status !== 'CONCLUIDO' && onAtualizarStatus && (
                      <button
                        onClick={() => onAtualizarStatus(a.id, 'CONCLUIDO')}
                        title="Concluir Atendimento"
                        className="px-2 py-0.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md text-[10px] font-semibold"
                      >
                        Concluir
                      </button>
                    )}
                    {onEditarAgendamento && (
                      <button
                        onClick={() => {
                          onFechar();
                          onEditarAgendamento(a);
                        }}
                        title="Editar Agendamento"
                        className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit2 size={14} />
                      </button>
                    )}
                    {a.status !== 'CANCELADO' && onAtualizarStatus && (
                      <button
                        onClick={() => onAtualizarStatus(a.id, 'CANCELADO')}
                        title="Cancelar Atendimento"
                        className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <XCircle size={14} />
                      </button>
                    )}
                    {onExcluirAgendamento && (
                      <button
                        onClick={() => {
                          if (confirm('Deseja excluir este agendamento?')) {
                            onExcluirAgendamento(a.id);
                          }
                        }}
                        title="Excluir Agendamento"
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function Calendario({
  agendamentos = [],
  onNovoAgendamento,
  onEditarAgendamento,
  onAtualizarStatus,
  onExcluirAgendamento,
}) {
  const hoje = new Date();
  const [mesAtual, setMesAtual] = useState(hoje.getMonth());
  const [anoAtual, setAnoAtual] = useState(hoje.getFullYear());
  const [diaDetalhado, setDiaDetalhado] = useState(null);
  const [internalAgendamentos, setInternalAgendamentos] = useState([]);

  // Auto-fetch como fallback caso agendamentos não seja injetado via prop
  useEffect(() => {
    if (!agendamentos || agendamentos.length === 0) {
      fetch('http://localhost:8080/api/v1/agendamentos')
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) setInternalAgendamentos(data);
        })
        .catch(console.error);
    }
  }, [agendamentos]);

  const listaEfetiva =
    agendamentos && agendamentos.length > 0 ? agendamentos : internalAgendamentos;

  const hojeISO = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;

  // Índice de agendamentos por data
  const agendamentosPorData = useMemo(() => {
    const mapa = {};
    listaEfetiva.forEach((a) => {
      const ds = getDataStr(a);
      if (!ds) return;
      if (!mapa[ds]) mapa[ds] = [];
      mapa[ds].push(a);
    });
    return mapa;
  }, [listaEfetiva]);

  const diasNoMes = new Date(anoAtual, mesAtual + 1, 0).getDate();
  const primeiroDia = new Date(anoAtual, mesAtual, 1).getDay();
  const totalCelulas = Math.ceil((primeiroDia + diasNoMes) / 7) * 7;

  const irMesAnterior = () => {
    if (mesAtual === 0) {
      setMesAtual(11);
      setAnoAtual((a) => a - 1);
    } else {
      setMesAtual((m) => m - 1);
    }
  };

  const irMesSeguinte = () => {
    if (mesAtual === 11) {
      setMesAtual(0);
      setAnoAtual((a) => a + 1);
    } else {
      setMesAtual((m) => m + 1);
    }
  };

  const irParaHoje = () => {
    setMesAtual(hoje.getMonth());
    setAnoAtual(hoje.getFullYear());
  };

  return (
    <div className="space-y-3 font-poppins">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={irMesAnterior}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            title="Mês anterior"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="font-bold text-gray-800 text-sm min-w-[160px] text-center">
            {NOMES_MES[mesAtual]} {anoAtual}
          </span>
          <button
            onClick={irMesSeguinte}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            title="Próximo mês"
          >
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={irParaHoje}
            className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
          >
            Hoje
          </button>
        </div>
      </div>

      {/* Nomes dos dias */}
      <div className="grid grid-cols-7 gap-1.5">
        {NOMES_DIA.map((d) => (
          <div key={d} className="text-center text-[11px] font-semibold text-gray-400 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Células dos dias */}
      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: totalCelulas }, (_, i) => {
          const diaNum = i - primeiroDia + 1;
          const valido = diaNum >= 1 && diaNum <= diasNoMes;

          if (!valido) {
            return <div key={i} className="h-24 rounded-xl" />;
          }

          const mes = String(mesAtual + 1).padStart(2, '0');
          const dia = String(diaNum).padStart(2, '0');
          const dataStr = `${anoAtual}-${mes}-${dia}`;
          const itens = agendamentosPorData[dataStr] || [];
          const isHoje = dataStr === hojeISO;
          const isPassado = dataStr < hojeISO;
          const temAgendamento = itens.length > 0;

          return (
            <div
              key={i}
              onClick={() => {
                if (temAgendamento) {
                  setDiaDetalhado(dataStr);
                } else if (!isPassado && onNovoAgendamento) {
                  onNovoAgendamento(dataStr);
                }
              }}
              className={[
                'h-24 p-2 rounded-xl border flex flex-col transition-all',
                isHoje
                  ? 'border-rose-400 bg-rose-50/60 ring-1 ring-rose-300 cursor-pointer group'
                  : temAgendamento
                    ? 'border-gray-200 bg-white hover:border-rose-300 hover:shadow-sm cursor-pointer group'
                    : isPassado
                      ? 'border-gray-100 bg-gray-50/30 opacity-60 cursor-default'
                      : 'border-gray-100 bg-gray-50/30 hover:border-rose-200 hover:bg-rose-50/20 cursor-pointer group',
              ].join(' ')}
            >
              {/* Header com número do dia e botão '+' apenas para datas atuais ou futuras */}
              <div className="flex items-center justify-between mb-1">
                <span
                  className={[
                    'text-xs font-bold leading-none px-1.5 py-0.5 rounded-md',
                    isHoje
                      ? 'bg-[#c47a85] text-white'
                      : temAgendamento
                        ? 'text-gray-800'
                        : isPassado
                          ? 'text-gray-300'
                          : 'text-gray-400 group-hover:text-gray-700',
                  ].join(' ')}
                >
                  {diaNum}
                </span>

                {!isPassado && onNovoAgendamento && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNovoAgendamento(dataStr);
                    }}
                    title={`Novo agendamento em ${diaNum}/${mesAtual + 1}`}
                    className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded-md bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-bold hover:bg-rose-200 transition-all"
                  >
                    +
                  </button>
                )}
              </div>

              {/* Previews dos agendamentos */}
              {temAgendamento ? (
                <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                  {itens.slice(0, 2).map((a) => {
                    const s = getStatusStyle(a.status);
                    return (
                      <div
                        key={a.id}
                        className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md ${s.bg} border ${s.border}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
                        <span className={`text-[10px] font-semibold truncate ${s.text}`}>
                          {getHoraStr(a)} {getNomeCliente(a).split(' ')[0]}
                        </span>
                      </div>
                    );
                  })}
                  {itens.length > 2 && (
                    <span className="text-[9px] font-semibold text-gray-500 pl-1">
                      +{itens.length - 2} mais
                    </span>
                  )}
                </div>
              ) : !isPassado ? (
                <div className="flex-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] text-rose-500 font-semibold">+ Agendar</span>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Legenda */}
      <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
        {Object.entries(STATUS_STYLE).map(([status, s]) => (
          <div key={status} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${s.dot}`} />
            <span className="text-[11px] text-gray-500 capitalize">{status.toLowerCase()}</span>
          </div>
        ))}
        <span className="text-[11px] text-gray-400 ml-auto">
          Clique no dia ou no <strong>+</strong> para agendar
        </span>
      </div>

      {/* Modal de Detalhes do Dia */}
      {diaDetalhado && (
        <DetalhesDia
          dataStr={diaDetalhado}
          agendamentos={listaEfetiva}
          onFechar={() => setDiaDetalhado(null)}
          onNovoAgendamento={onNovoAgendamento}
          onEditarAgendamento={onEditarAgendamento}
          onAtualizarStatus={onAtualizarStatus}
          onExcluirAgendamento={onExcluirAgendamento}
        />
      )}
    </div>
  );
}
