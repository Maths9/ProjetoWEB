import React from 'react';
import { Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function Topbar({ onToggleSidebar, pageTitle }) {
  const { user } = useAuth();
  const inicial = user?.nome ? user.nome.charAt(0).toUpperCase() : 'U';

  const dataAtual = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const dataFormatada = dataAtual.charAt(0).toUpperCase() + dataAtual.slice(1);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#f0e6e8] px-6 py-3.5 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          aria-label="Alternar menu lateral"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-gray-800 font-semibold text-base leading-tight">{pageTitle}</h1>
          <p className="text-gray-400 text-xs mt-0.5">{dataFormatada}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-gradient-to-br from-[#f5d5d8] to-[#e8b4ba] text-[#b5606e]">
            {inicial}
          </div>
          <div className="hidden sm:block text-left">
            <div className="flex items-center gap-2">
              <p className="text-gray-800 text-xs font-semibold">{user?.nome || 'Usuário'}</p>
              <span className="bg-blue-100 text-blue-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                {user?.perfil || 'Secretária'}
              </span>
            </div>
            <p className="text-gray-400 text-[11px]">{user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
