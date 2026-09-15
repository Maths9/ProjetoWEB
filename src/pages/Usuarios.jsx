import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  ShieldCheck,
  UserCheck,
  UserPlus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  Lock,
  Mail,
  User,
  KeyRound,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { USUARIOS_SIMULADOS, NEXA_PERFIS } from '../data/perfis';

const PERMISSOES_MATRIZ = [
  { modulo: 'Dashboard', acao: 'Métricas Financeiras e Conversão', admin: true, secretaria: false },
  { modulo: 'Clientes', acao: 'Criar e Editar Pacientes', admin: true, secretaria: true },
  { modulo: 'Clientes', acao: 'Excluir Registros de Pacientes', admin: true, secretaria: false },
  { modulo: 'Agendamento', acao: 'Marcar, Reagendar e Cancelar', admin: true, secretaria: true },
  { modulo: 'Estoque', acao: 'Consultar Níveis e Alertas', admin: true, secretaria: true },
  { modulo: 'Estoque', acao: 'Cadastrar Produtos e Movimentações', admin: true, secretaria: false },
  { modulo: 'Financeiro', acao: 'Acesso a DRE, Receitas e Despesas', admin: true, secretaria: false },
  { modulo: 'Relatórios', acao: 'Desempenho Comercial e Financeiro', admin: true, secretaria: false },
  { modulo: 'Usuários & RBAC', acao: 'Gerenciar Acessos e Perfis', admin: true, secretaria: false },
  { modulo: 'Chatbot IA', acao: 'Simulador e Fluxos Automáticos', admin: true, secretaria: false },
];

export function Usuarios() {
  const { isAdmin, user: currentUser } = useAuth();
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  const [usuarios, setUsuarios] = useState([
    ...USUARIOS_SIMULADOS.map((u, i) => ({
      id: i + 1,
      ...u,
      status: 'ativo',
      cargo: u.perfil === 'Administradora' ? 'Diretora Clínica' : 'Recepcionista Pleno',
      ultimoAcesso: 'Hoje às 08:30'
    })),
    {
      id: 3,
      nome: 'Camila Esteticista',
      email: 'camila@clinica.com.br',
      perfil: 'Secretária',
      cargo: 'Esteticista & Operacional',
      status: 'ativo',
      ultimoAcesso: 'Ontem às 18:15'
    }
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    perfil: 'Secretária',
    cargo: '',
    status: 'ativo'
  });

  const abrirModalNovo = () => {
    setEditingUser(null);
    setFormData({
      nome: '',
      email: '',
      senha: '••••••',
      perfil: 'Secretária',
      cargo: '',
      status: 'ativo'
    });
    setModalOpen(true);
  };

  const abrirModalEditar = (u) => {
    setEditingUser(u);
    setFormData({
      nome: u.nome,
      email: u.email,
      senha: '••••••',
      perfil: u.perfil,
      cargo: u.cargo,
      status: u.status
    });
    setModalOpen(true);
  };

  const salvarUsuario = (e) => {
    e.preventDefault();
    if (!formData.nome || !formData.email) return;

    if (editingUser) {
      setUsuarios((prev) =>
        prev.map((u) => (u.id === editingUser.id ? { ...u, ...formData } : u))
      );
    } else {
      const novo = {
        id: Date.now(),
        ...formData,
        ultimoAcesso: 'Nunca acessou'
      };
      setUsuarios((prev) => [novo, ...prev]);
    }
    setModalOpen(false);
  };

  const alternarStatus = (id) => {
    setUsuarios((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          return { ...u, status: u.status === 'ativo' ? 'inativo' : 'ativo' };
        }
        return u;
      })
    );
  };

  const excluirUsuario = (id) => {
    if (confirm('Tem certeza que deseja desativar/remover o acesso deste usuário?')) {
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-poppins">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#c47a85] to-[#b5606e] rounded-3xl p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="bg-white/20 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-xs">
            Segurança & Controle de Acesso
          </span>
          <h1 className="text-xl font-bold mt-2">Gerenciamento de Usuários & RBAC</h1>
          <p className="text-white/80 text-xs mt-0.5">
            Defina perfis, controle permissões granulares e credenciais de acesso da equipe.
          </p>
        </div>
        <button
          onClick={abrirModalNovo}
          className="flex items-center gap-1.5 px-4 py-2 bg-white text-[#b5606e] hover:bg-rose-50 rounded-xl text-xs font-semibold shadow-xs transition-colors flex-shrink-0"
        >
          <UserPlus size={15} /> Novo Usuário
        </button>
      </div>

      {/* Grid: Lista de Usuários e Matriz RBAC */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabela de Usuários (2 colunas) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
            <div className="flex items-center gap-2">
              <UserCheck size={18} className="text-rose-600" />
              <h2 className="text-sm font-semibold text-gray-800">Membros da Equipe ({usuarios.length})</h2>
            </div>
            <span className="text-[11px] text-gray-400">
              Autenticação por Perfil (RBAC)
            </span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs text-gray-600">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3 font-semibold">Usuário</th>
                  <th className="py-2.5 px-3 font-semibold">Perfil</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 font-semibold">Último Acesso</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {usuarios.map((u) => {
                  const isAdminRole = u.perfil === 'Administradora';
                  const inicial = u.nome.charAt(0).toUpperCase();

                  return (
                    <tr key={u.id} className="hover:bg-rose-50/20">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                              isAdminRole
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            {inicial}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{u.nome}</p>
                            <p className="text-[11px] text-gray-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                            isAdminRole
                              ? 'bg-purple-50 text-purple-700 ring-1 ring-purple-200'
                              : 'bg-rose-50 text-[#b5606e] ring-1 ring-rose-200'
                          }`}
                        >
                          <Lock size={10} />
                          {u.perfil}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => alternarStatus(u.id)}
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full cursor-pointer transition-opacity hover:opacity-80 ${
                            u.status === 'ativo'
                              ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                          title="Clique para alternar status"
                        >
                          {u.status === 'ativo' ? '● Ativo' : '○ Inativo'}
                        </button>
                      </td>
                      <td className="py-3 px-3 text-gray-400 text-[11px]">
                        {u.ultimoAcesso}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => abrirModalEditar(u)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Editar Usuário"
                          >
                            <Edit2 size={13} />
                          </button>
                          {u.email !== currentUser?.email && (
                            <button
                              onClick={() => excluirUsuario(u.id)}
                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remover Acesso"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Matriz RBAC (1 coluna) */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <ShieldCheck size={18} className="text-purple-600" />
            <div>
              <h3 className="text-xs font-semibold text-gray-800">Matriz de Permissões RBAC</h3>
              <p className="text-[10px] text-gray-400">Direitos de acesso por perfil</p>
            </div>
          </div>

          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {PERMISSOES_MATRIZ.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-gray-50/70 border border-gray-100 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700">{item.modulo}</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                        item.admin ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-400'
                      }`}
                      title="Administradora"
                    >
                      ADM
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                        item.secretaria ? 'bg-rose-100 text-[#b5606e]' : 'bg-gray-200 text-gray-400'
                      }`}
                      title="Secretária"
                    >
                      SEC
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-gray-500">{item.acao}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Criar / Editar Usuário */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center">
                  <User size={16} className="text-[#b5606e]" />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm">
                  {editingUser ? 'Editar Usuário' : 'Novo Usuário da Clínica'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={salvarUsuario} className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Dra. Ana Paula"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c47a85]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">E-mail de Acesso *</label>
                <input
                  type="email"
                  required
                  placeholder="usuario@clinica.com.br"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c47a85]/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Perfil (RBAC) *</label>
                  <select
                    value={formData.perfil}
                    onChange={(e) => setFormData({ ...formData, perfil: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c47a85]/30"
                  >
                    <option value="Secretária">Secretária</option>
                    <option value="Administradora">Administradora</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Cargo / Função</label>
                  <input
                    type="text"
                    placeholder="Ex: Recepcionista"
                    value={formData.cargo}
                    onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c47a85]/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Status da Conta</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c47a85]/30"
                >
                  <option value="ativo">Ativo (Permitir Login)</option>
                  <option value="inativo">Inativo (Bloquear Acesso)</option>
                </select>
              </div>

              <div className="p-5 border-t border-gray-100 flex justify-end gap-2 -mx-5 -mb-5 mt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#c47a85] hover:bg-[#b5606e] text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  {editingUser ? 'Atualizar Usuário' : 'Criar Usuário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
