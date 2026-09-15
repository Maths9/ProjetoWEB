import React, { useState, useRef, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import {
  Bot,
  Send,
  RotateCcw,
  Sparkles,
  MessageSquare,
  Clock,
  Settings,
  CheckCheck,
  Smartphone,
  Check,
  Sliders,
  Zap,
  PhoneCall
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RESPOSTAS_AUTOMATICAS = [
  {
    gatilhos: ['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'inicio', 'início'],
    resposta: 'Olá! Seja muito bem-vinda à *Nexa Clínica Integrada*! ✨🌸\n\nSou a assistente virtual da clínica. Como posso te ajudar hoje?\n\n1️⃣ Agendar procedimento\n2️⃣ Ver tratamentos & valores\n3️⃣ Horário de funcionamento\n4️⃣ Localização da clínica\n5️⃣ Falar com a secretária'
  },
  {
    gatilhos: ['1', 'agendar', 'marcar', 'horario', 'horário', 'sessao', 'sessão'],
    resposta: 'Perfeito! 🗓️ Nossos horários mais procurados para esta semana são:\n\n• Quinta-feira (18/09): 09:30, 14:00 ou 16:30\n• Sexta-feira (19/09): 10:00, 15:00 ou 17:30\n\nQual procedimento você gostaria de realizar (ex: Limpeza de Pele, Drenagem ou Peeling)?'
  },
  {
    gatilhos: ['2', 'preco', 'preço', 'valor', 'valores', 'quanto custa', 'tabela', 'tratamento', 'procedimento'],
    resposta: 'Aqui está nossa tabela dos principais tratamentos estéticos: 💆‍♀️\n\n✨ *Drenagem Linfática*: R$ 180,00 (60 min)\n✨ *Limpeza de Pele Profunda*: R$ 150,00 (45 min)\n✨ *Peeling Químico*: R$ 220,00 (60 min)\n✨ *Radiofrequência Facial*: R$ 350,00 (60 min)\n✨ *Redução de Medidas*: R$ 280,00 (90 min)\n\nGostaria de garantir sua vaga?'
  },
  {
    gatilhos: ['3', 'funcionamento', 'horas', 'abre', 'fecha', 'atendimento'],
    resposta: '⏰ Nosso horário de atendimento é:\n\n• Segunda a Sexta: das 08h às 19h\n• Sábados: das 08h às 14h\n• Domingos e Feriados: Fechado\n\nPodemos marcar um horário para você?'
  },
  {
    gatilhos: ['4', 'local', 'onde', 'endereco', 'endereço', 'localizacao', 'localização', 'como chegar'],
    resposta: '📍 Estamos localizados na:\n*Av. Paulista, 1500 - Sala 402 - Bela Vista, São Paulo/SP* (Próximo ao Metrô Trianon-Masp).\n\nDispomos de estacionamento conveniado no local! 🚗'
  },
  {
    gatilhos: ['5', 'humano', 'atendente', 'secretaria', 'secretária', 'falar com alguém', 'duvida'],
    resposta: 'Entendido! Estou transferindo seu atendimento para a nossa secretária *Mariana Lima*. 👩‍💼\n\nEm instantes ela continuará a conversa com você por aqui. Por favor, aguarde um momento!'
  }
];

export function Chatbot() {
  const { isAdmin } = useAuth();
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  const [mensagens, setMensagens] = useState([
    {
      id: 1,
      remetente: 'bot',
      texto: 'Olá! Sou a assistente virtual da *Nexa Clínica Integrada*. Como posso ajudar você hoje?',
      hora: '09:00'
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [botAtivo, setBotAtivo] = useState(true);
  const [delayResposta, setDelayResposta] = useState(800);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens, isTyping]);

  const obterHoraAtual = () => {
    const d = new Date();
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const enviarMensagem = (textoEnvio) => {
    const texto = textoEnvio || inputMsg;
    if (!texto.trim()) return;

    const novaMsgUsuario = {
      id: Date.now(),
      remetente: 'usuario',
      texto: texto.trim(),
      hora: obterHoraAtual()
    };

    setMensagens((prev) => [...prev, novaMsgUsuario]);
    if (!textoEnvio) setInputMsg('');

    if (!botAtivo) return;

    setIsTyping(true);

    setTimeout(() => {
      const textoLower = texto.toLowerCase();
      let respostaEncontrada = null;

      for (const item of RESPOSTAS_AUTOMATICAS) {
        if (item.gatilhos.some((g) => textoLower.includes(g))) {
          respostaEncontrada = item.resposta;
          break;
        }
      }

      if (!respostaEncontrada) {
        respostaEncontrada =
          'Obrigada pela mensagem! 😊 Para essa solicitação específica, vou te direcionar para nossa secretária ou você pode escolher uma opção:\n\n• Digite *1* para Agendamentos\n• Digite *2* para Valores\n• Digite *3* para Horários';
      }

      setMensagens((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          remetente: 'bot',
          texto: respostaEncontrada,
          hora: obterHoraAtual()
        }
      ]);
      setIsTyping(false);
    }, delayResposta);
  };

  const reiniciarChat = () => {
    setMensagens([
      {
        id: Date.now(),
        remetente: 'bot',
        texto: 'Olá! Sou a assistente virtual da *Nexa Clínica Integrada*. Como posso ajudar você hoje?',
        hora: obterHoraAtual()
      }
    ]);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-poppins">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#c47a85] to-[#b5606e] rounded-3xl p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="bg-white/20 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-xs">
            Atendimento Automatizado & IA
          </span>
          <h1 className="text-xl font-bold mt-2">Simulador do Chatbot WhatsApp</h1>
          <p className="text-white/80 text-xs mt-0.5">
            Teste fluxos automáticos de triagem, agendamento e tabela de preços em tempo real.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={reiniciarChat}
            className="flex items-center gap-1.5 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            <RotateCcw size={14} /> Reiniciar Conversa
          </button>
        </div>
      </div>

      {/* Grid: Simulador WhatsApp & Configurações de Regras */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Simulador Phone WhatsApp (7 colunas) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[620px]">
          {/* WhatsApp Header */}
          <div className="bg-[#1f2c34] text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#c47a85] to-[#f5d5d8] flex items-center justify-center text-white font-bold text-sm">
                  <Bot size={20} className="text-[#2d1f22]" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#1f2c34] rounded-full" />
              </div>
              <div>
                <p className="font-semibold text-sm leading-tight flex items-center gap-1.5">
                  Nexa Clínica Oficial
                  <span className="bg-emerald-600/60 text-[9px] px-1.5 py-0.2 rounded font-normal">
                    Bot Ativo
                  </span>
                </p>
                <p className="text-emerald-400 text-[11px]">
                  {isTyping ? 'digitando resposta...' : 'online · Resposta Imediata'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Smartphone size={18} />
            </div>
          </div>

          {/* Chat Body (WhatsApp Background Pattern) */}
          <div
            className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#efeae2] bg-opacity-70"
            style={{
              backgroundImage: 'radial-gradient(#d1c7b8 0.75px, transparent 0.75px)',
              backgroundSize: '16px 16px'
            }}
          >
            <div className="text-center my-2">
              <span className="bg-[#ffffff]/80 text-[#54656f] text-[10px] px-2.5 py-1 rounded-md shadow-2xs">
                As mensagens são criptografadas e automatizadas pelo NexaBot
              </span>
            </div>

            {mensagens.map((msg) => {
              const isUser = msg.remetente === 'usuario';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs shadow-2xs whitespace-pre-line leading-relaxed ${
                      isUser
                        ? 'bg-[#d9fdd3] text-gray-900 rounded-tr-xs'
                        : 'bg-white text-gray-800 rounded-tl-xs'
                    }`}
                  >
                    {msg.texto}
                    <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-gray-400">
                      <span>{msg.hora}</span>
                      {isUser && <CheckCheck size={12} className="text-blue-500" />}
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-1.5 bg-white rounded-2xl px-3.5 py-2 w-fit shadow-2xs">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Quick Prompts */}
          <div className="bg-[#f0f2f5] px-3 py-2 border-t border-gray-200 flex gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
            {[
              'Quero agendar horário',
              'Quais os preços?',
              'Horário de funcionamento',
              'Qual o endereço?',
              'Falar com secretária'
            ].map((sugestao) => (
              <button
                key={sugestao}
                onClick={() => enviarMensagem(sugestao)}
                className="whitespace-nowrap px-2.5 py-1 bg-white hover:bg-rose-50 text-gray-700 hover:text-[#b5606e] rounded-full border border-gray-200 font-medium transition-colors"
              >
                {sugestao}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              enviarMensagem();
            }}
            className="bg-[#f0f2f5] p-3 flex items-center gap-2 border-t border-gray-200 flex-shrink-0"
          >
            <input
              type="text"
              placeholder="Digite uma mensagem como cliente..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              className="flex-1 bg-white border border-gray-200 rounded-full px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#c47a85]/40"
            />
            <button
              type="submit"
              disabled={!inputMsg.trim()}
              className="w-9 h-9 rounded-full bg-[#00a884] hover:bg-[#008f70] disabled:opacity-40 text-white flex items-center justify-center transition-all flex-shrink-0 shadow-xs"
            >
              <Send size={15} />
            </button>
          </form>
        </div>

        {/* Painel Lateral: Configurações do Bot & Regras (5 colunas) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card Status & Switches */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <Sliders size={18} className="text-[#b5606e]" />
              <h3 className="text-xs font-semibold text-gray-800">Parâmetros do Robô de Atendimento</h3>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-800">Ativação do Bot</p>
                <p className="text-[11px] text-gray-400">Responder clientes automaticamente</p>
              </div>
              <button
                onClick={() => setBotAtivo(!botAtivo)}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  botAtivo ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    botAtivo ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-gray-700">Tempo de Resposta (Delay)</span>
                <span className="text-[#b5606e] font-bold">{delayResposta} ms</span>
              </div>
              <input
                type="range"
                min="200"
                max="2500"
                step="100"
                value={delayResposta}
                onChange={(e) => setDelayResposta(Number(e.target.value))}
                className="w-full accent-[#c47a85]"
              />
              <p className="text-[10px] text-gray-400 mt-1">
                Simula o tempo de digitação humana para parecer natural ao paciente.
              </p>
            </div>
          </div>

          {/* Gatilhos e Respostas Pré-configuradas */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <Zap size={16} className="text-amber-500" />
              <h3 className="text-xs font-semibold text-gray-800">Gatilhos Ativos na Clínica</h3>
            </div>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {RESPOSTAS_AUTOMATICAS.map((r, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-gray-50/80 border border-gray-100 text-xs space-y-1.5"
                >
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Palavras-chave:</span>
                    {r.gatilhos.slice(0, 4).map((g) => (
                      <span
                        key={g}
                        className="bg-rose-50 text-[#b5606e] px-1.5 py-0.2 rounded text-[10px] font-semibold"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-gray-600 line-clamp-2 italic">
                    "{r.resposta.replace(/\*/g, '')}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
