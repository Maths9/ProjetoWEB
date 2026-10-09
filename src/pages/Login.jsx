import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, CheckCircle, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showToast, setShowToast] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !senha) {
      setErrorMsg('Por favor, preencha o e-mail e a senha.');
      return;
    }

    const res = await login(email, senha);
    if (res.success) {
      setShowToast(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 700);
    } else {
      setErrorMsg(res.error || 'E-mail ou senha incorretos. Tente novamente.');
    }
  };

  const preencherSecretaria = () => {
    setEmail('mariana@clinica.com.br');
    setSenha('secretaria123');
    setErrorMsg('');
  };

  const preencherAdmin = () => {
    setEmail('clarissa@clinica.com.br');
    setSenha('admin123');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#f8e8e8] via-[#f2d9d9] to-[#f9ecec] relative overflow-hidden font-poppins">
      {/* Decorative blurred shapes */}
      <div className="absolute left-[5%] top-[15%] w-24 h-[60%] bg-white/40 rounded-2xl blur-xl pointer-events-none" />
      <div className="absolute right-[8%] top-[20%] w-32 h-[50%] bg-[#dcc3c3]/40 rounded-2xl blur-xl pointer-events-none" />
      <div className="absolute right-[12%] bottom-[10%] w-20 h-[30%] bg-[#a0b996]/30 rounded-full blur-xl pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-[0_20px_60px_rgba(150,80,90,0.12)] border border-white/60 relative z-10">
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-[#f5d5d8] to-[#e8b4ba] shadow-sm">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C8 2 4 6 4 10c0 5 5 10 8 12 3-2 8-7 8-12 0-4-4-8-8-8z"
                fill="none"
                stroke="#b5606e"
                strokeWidth="1.6"
              />
              <path d="M12 2 Q14 8 12 14 Q10 8 12 2z" fill="#c47a85" opacity="0.6" />
            </svg>
          </div>
          <div>
            <p className="text-gray-800 font-semibold text-sm leading-tight">Nexa Clínica</p>
            <p className="text-gray-500 text-xs">Gestão Integrada & Estética</p>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-1">Bem-vinda de volta</h1>
        <p className="text-gray-400 text-xs mb-6">Acesse o sistema com suas credenciais de atendimento ou gestão.</p>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              E-mail de Acesso
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@clinica.com.br"
                className="w-full pl-10 pr-4 py-2.5 text-xs text-gray-700 border border-gray-200 rounded-xl focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-11 py-2.5 text-xs text-gray-700 border border-gray-200 rounded-xl focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Quick login for demonstration */}
          <div className="bg-pink-50/70 border border-pink-100 rounded-2xl p-3 text-xs space-y-2">
            <p className="font-semibold text-gray-700 text-[11px] uppercase tracking-wider">⚡ Acesso Rápido para Demonstração:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={preencherSecretaria}
                className="py-2 px-2.5 bg-white border border-rose-200 hover:border-rose-400 rounded-xl font-medium text-[#b5606e] hover:bg-rose-50/50 transition-colors text-left flex items-center gap-1.5 text-[11px] shadow-2xs"
              >
                <UserCheck size={14} className="flex-shrink-0" />
                <span className="truncate">Secretária (Mariana)</span>
              </button>
              <button
                type="button"
                onClick={preencherAdmin}
                className="py-2 px-2.5 bg-white border border-purple-200 hover:border-purple-400 rounded-xl font-medium text-purple-700 hover:bg-purple-50/50 transition-colors text-left flex items-center gap-1.5 text-[11px] shadow-2xs"
              >
                <ShieldCheck size={14} className="flex-shrink-0" />
                <span className="truncate">Admin (Clarissa)</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-[#c47a85] to-[#b5606e] hover:from-[#b5606e] hover:to-[#9f3a4a] text-white font-semibold rounded-xl text-xs shadow-md shadow-rose-200 transition-all active:scale-[0.99]"
          >
            Entrar no Sistema
          </button>
        </form>

        <div className="mt-6 text-center text-[11px] text-gray-400">
          Nexa Clínica Integrada © 2026 • Gestão Simplificada
        </div>
      </div>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-white border-l-4 border-[#c47a85] rounded-xl p-4 shadow-xl flex items-center gap-3 z-50 animate-bounce">
          <CheckCircle className="text-emerald-500" size={20} />
          <div>
            <p className="font-semibold text-xs text-gray-800">Login realizado!</p>
            <p className="text-[11px] text-gray-400">Acessando a clínica...</p>
          </div>
        </div>
      )}
    </div>
  );
}
