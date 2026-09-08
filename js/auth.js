// ================================================================
// auth.js – Controle de Autenticação e Permissões
// Nexa Clínica Integrada
// ================================================================

const NEXA_PERFIS = {
  'Administradora': {
    modulos: ['dashboard','clientes','agendamento','financeiro','estoque','relatorios','usuarios','chatbot'],
    dashboard:   { financeiro: true,  estoque: true,  conversao: true  },
    clientes:    { criar: true,  editar: true,  excluir: true,  historico: true },
    agendamento: { criar: true,  editar: true,  cancelar: true },
    financeiro:  { visualizar: true, criar: true, editar: true, excluir: true, relatorios: true },
    estoque:     { criar: true,  editar: true,  excluir: true  },
    relatorios:  { financeiro: true, estoque: true, clientes: true, desempenho: true },
    usuarios:    { visualizar: true, criar: true, editar: true, excluir: true },
  },
  'Secretária': {
    modulos: ['dashboard','clientes','agendamento','estoque'],
    dashboard:   { financeiro: false, estoque: true,  conversao: false },
    clientes:    { criar: true,  editar: true,  excluir: false, historico: true },
    agendamento: { criar: true,  editar: true,  cancelar: true },
    financeiro:  { visualizar: false, criar: false, editar: false, excluir: false, relatorios: false },
    estoque:     { criar: false, editar: false, excluir: false },
    relatorios:  { financeiro: false, estoque: false, clientes: true, desempenho: false },
    usuarios:    { visualizar: false, criar: false, editar: false, excluir: false },
  }
};

// ---- Funções de acesso ao usuário --------------------------------

function nexaGetUser() {
  try { return JSON.parse(localStorage.getItem('usuario_logado')); } catch { return null; }
}

function nexaGetPerfil() {
  const u = nexaGetUser();
  if (!u) return null;
  return NEXA_PERFIS[u.perfil] || NEXA_PERFIS['Secretária'];
}

function nexaRequireLogin() {
  const u = nexaGetUser();
  if (!u) { window.location.href = 'login.html'; return null; }
  return u;
}

function nexaRequireModulo(modulo) {
  const u = nexaRequireLogin();
  if (!u) return false;
  const p = NEXA_PERFIS[u.perfil] || NEXA_PERFIS['Secretária'];
  if (!p.modulos.includes(modulo)) {
    window.location.href = 'acesso-negado.html';
    return false;
  }
  return true;
}

function nexaPode(modulo, acao) {
  const p = nexaGetPerfil();
  if (!p) return false;
  return !!(p[modulo] && p[modulo][acao]);
}

// ---- Inicialização de página ------------------------------------

function nexaInitPage(moduloAtivo) {
  if (!nexaRequireModulo(moduloAtivo)) return null;

  const u = nexaGetUser();
  const p = nexaGetPerfil();
  const nome    = u.nome   || 'Usuário';
  const perfil  = u.perfil || '';
  const inicial = nome.charAt(0).toUpperCase();

  // Preenche info do usuário
  _nexaSet('sidebarUserName', nome);
  _nexaSet('sidebarUserRole', perfil);
  _nexaSet('avatarInitial',   inicial);
  _nexaSet('topAvatar',       inicial);
  _nexaSet('topUserName',     nome);
  _nexaSet('topUserRole',     perfil);

  // Data atual
  const opts   = { weekday:'long', year:'numeric', month:'long', day:'numeric' };
  const dtStr  = new Date().toLocaleDateString('pt-BR', opts);
  const dtFmt  = dtStr.charAt(0).toUpperCase() + dtStr.slice(1);
  _nexaSet('dataAtual',  dtFmt);
  _nexaSet('dataAgenda', dtFmt);

  // Sidebar: oculta módulos sem permissão
  document.querySelectorAll('[data-modulo]').forEach(el => {
    const mod = el.getAttribute('data-modulo');
    if (!p.modulos.includes(mod)) el.style.display = 'none';
  });

  // Marca item ativo na sidebar
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const ativo = document.querySelector(`.nav-item[data-modulo="${moduloAtivo}"]`);
  if (ativo) ativo.classList.add('active');

  // Oculta elementos com data-perm sem permissão
  document.querySelectorAll('[data-perm]').forEach(el => {
    const [mod, acao] = el.getAttribute('data-perm').split('.');
    if (!nexaPode(mod, acao)) el.style.display = 'none';
  });

  // Badge de perfil
  const badge = document.getElementById('perfilBadge');
  if (badge) {
    badge.textContent = perfil;
    badge.style.cssText = perfil === 'Administradora'
      ? 'background:#fce7f3;color:#9d174d;padding:2px 10px;border-radius:20px;font-size:0.7rem;font-weight:600;'
      : 'background:#dbeafe;color:#1e40af;padding:2px 10px;border-radius:20px;font-size:0.7rem;font-weight:600;';
  }

  return { u, p };
}

function _nexaSet(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

// ---- Sidebar toggle & logout ------------------------------------

function toggleSidebar() {
  const s = document.getElementById('sidebar');
  const o = document.getElementById('overlay');
  if (!s) return;
  if (window.innerWidth < 768) {
    s.classList.toggle('open');
    if (o) o.classList.toggle('show');
  } else {
    s.classList.toggle('collapsed');
  }
}

function logout() {
  localStorage.removeItem('usuario_logado');
  window.location.href = 'login.html';
}

// ---- HTML da Sidebar (compartilhada) ----------------------------

function nexaSidebarHTML() {
  return `
  <div class="logo-wrap flex items-center gap-3 px-5 py-5 border-b border-white/10">
    <div class="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center"
         style="background:linear-gradient(135deg,#f5d5d8,#e8b4ba);">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C8 2 4 6 4 10c0 5 5 10 8 12 3-2 8-7 8-12 0-4-4-8-8-8z"
          fill="none" stroke="#b5606e" stroke-width="1.6"/>
        <path d="M12 2 Q14 8 12 14 Q10 8 12 2z" fill="#c47a85" opacity="0.8"/>
      </svg>
    </div>
    <div>
      <p class="sidebar-title text-white font-semibold text-sm leading-tight">Nexa Clínica</p>
      <p class="sidebar-subtitle text-white/40 text-xs">Integrada</p>
    </div>
  </div>

  <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
    <p class="nav-label text-white/30 text-xs font-semibold uppercase tracking-widest px-3 mb-2">Principal</p>

    <a href="dashboard.html" data-modulo="dashboard" class="nav-item">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
      <span class="nav-label">Dashboard</span>
    </a>

    <a href="clientes.html" data-modulo="clientes" class="nav-item">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/><path d="M21 21v-2a4 4 0 0 0-3-3.85"/>
      </svg>
      <span class="nav-label">Clientes</span>
    </a>

    <a href="agendamento.html" data-modulo="agendamento" class="nav-item">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
      <span class="nav-label">Agendamento</span>
    </a>

    <a href="financeiro.html" data-modulo="financeiro" class="nav-item">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
      <span class="nav-label">Financeiro</span>
    </a>

    <a href="estoque.html" data-modulo="estoque" class="nav-item">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
      <span class="nav-label">Estoque</span>
    </a>

    <a href="relatorios.html" data-modulo="relatorios" class="nav-item">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
      <span class="nav-label">Relatórios</span>
    </a>

    <div class="border-t border-white/10 my-3"></div>
    <p class="nav-label text-white/30 text-xs font-semibold uppercase tracking-widest px-3 mb-2">Sistema</p>

    <a href="usuarios.html" data-modulo="usuarios" class="nav-item">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
      </svg>
      <span class="nav-label">Usuários</span>
    </a>

    <a href="chatbot.html" data-modulo="chatbot" class="nav-item">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <span class="nav-label">Chatbot</span>
    </a>
  </nav>

  <div class="px-4 py-4 border-t border-white/10 flex items-center gap-3">
    <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
         style="background:#f5d5d8;color:#b5606e;" id="avatarInitial">C</div>
    <div class="overflow-hidden">
      <p class="user-name text-white text-xs font-semibold truncate" id="sidebarUserName">Usuário</p>
      <p class="user-role text-white/40 text-xs truncate" id="sidebarUserRole">Perfil</p>
    </div>
    <button onclick="logout()" class="nav-label ml-auto text-white/40 hover:text-rose-300 transition-colors" title="Sair">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
    </button>
  </div>`;
}

// Injeta sidebar dinamicamente se o elemento tiver id="sidebarContent"
document.addEventListener('DOMContentLoaded', () => {
  const sc = document.getElementById('sidebarContent');
  if (sc) sc.innerHTML = nexaSidebarHTML();
});
