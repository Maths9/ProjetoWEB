import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Package,
  BarChart3,
  DollarSign,
  ShieldCheck,
  Bot,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function Sidebar({ collapsed, mobileOpen, onCloseMobile }) {
  const { user, logout, isAdmin, hasModule } = useAuth();
  const inicial = user?.nome ? user.nome.charAt(0).toUpperCase() : 'U';

  const baseNavItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/clientes', label: 'Clientes', icon: Users },
    { to: '/agendamento', label: 'Agendamento', icon: Calendar },
    { to: '/estoque', label: 'Estoque', icon: Package },
    { to: '/relatorios', label: 'Relatórios', icon: BarChart3 },
  ];

  const adminNavItems = [
    { to: '/financeiro', label: 'Financeiro', icon: DollarSign },
    { to: '/usuarios', label: 'Usuários & RBAC', icon: ShieldCheck },
    { to: '/chatbot', label: 'Chatbot IA', icon: Bot },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 flex flex-col bg-[#2d1f22] text-[#c8a5aa] transition-all duration-300 ${
          collapsed ? 'w-[70px]' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-[#f5d5d8] to-[#e8b4ba]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C8 2 4 6 4 10c0 5 5 10 8 12 3-2 8-7 8-12 0-4-4-8-8-8z"
                fill="none"
                stroke="#b5606e"
                strokeWidth="1.6"
              />
              <path d="M12 2 Q14 8 12 14 Q10 8 12 2z" fill="#c47a85" opacity="0.8" />
            </svg>
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-white font-semibold text-sm leading-tight">Nexa Clínica</p>
              <p className="text-white/40 text-xs">
                {isAdmin ? 'Gestão Administrativa' : 'Área da Secretária'}
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {!collapsed && (
            <p className="text-white/30 text-[11px] font-semibold uppercase tracking-widest px-3 mb-2">
              Principal
            </p>
          )}

          {baseNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#c47a85]/30 text-[#f5d5d8] font-semibold shadow-sm'
                      : 'hover:bg-white/5 text-[#c8a5aa] hover:text-[#f5d5d8]'
                  } ${collapsed ? 'justify-center' : ''}`
                }
                title={collapsed ? item.label : undefined}
              >
                <Icon size={18} className="flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}

          {/* Seção Exclusiva de Administração */}
          {isAdmin && (
            <>
              {!collapsed && (
                <p className="text-white/30 text-[11px] font-semibold uppercase tracking-widest px-3 pt-4 mb-2">
                  Administração
                </p>
              )}
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onCloseMobile}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-[#c47a85]/30 text-[#f5d5d8] font-semibold shadow-sm'
                          : 'hover:bg-white/5 text-[#c8a5aa] hover:text-[#f5d5d8]'
                      } ${collapsed ? 'justify-center' : ''}`
                    }
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon size={18} className="flex-shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </NavLink>
                );
              })}
            </>
          )}
        </nav>

        {/* User Card */}
        <div className="p-4 border-t border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#f5d5d8] text-[#b5606e] font-bold text-xs flex items-center justify-center flex-shrink-0">
            {inicial}
          </div>
          {!collapsed && (
            <div className="overflow-hidden flex-1">
              <p className="text-white text-xs font-semibold truncate">
                {user?.nome || 'Usuário'}
              </p>
              <p className="text-white/40 text-[11px] truncate">{user?.perfil || 'Perfil'}</p>
            </div>
          )}
          <button
            onClick={logout}
            className="text-white/40 hover:text-rose-300 transition-colors p-1"
            title="Sair do sistema"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>
    </>
  );
}
