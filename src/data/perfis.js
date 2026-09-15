export const NEXA_PERFIS = {
  'Secretária': {
    modulos: ['dashboard', 'clientes', 'agendamento', 'estoque', 'relatorios'],
    dashboard: { financeiro: false, estoque: true, conversao: false },
    clientes: { criar: true, editar: true, excluir: false, historico: true },
    agendamento: { criar: true, editar: true, cancelar: true },
    estoque: { criar: false, editar: false, excluir: false }, // Consulta / leitura apenas
    relatorios: { financeiro: false, estoque: false, clientes: true, desempenho: false },
  },
  'Administradora': {
    modulos: ['dashboard', 'clientes', 'agendamento', 'financeiro', 'estoque', 'relatorios', 'usuarios', 'chatbot'],
    dashboard: { financeiro: true, estoque: true, conversao: true },
    clientes: { criar: true, editar: true, excluir: true, historico: true },
    agendamento: { criar: true, editar: true, cancelar: true },
    financeiro: { visualizar: true, criar: true, editar: true, excluir: true, relatorios: true },
    estoque: { criar: true, editar: true, excluir: true },
    relatorios: { financeiro: true, estoque: true, clientes: true, desempenho: true },
    usuarios: { visualizar: true, criar: true, editar: true, excluir: true },
    chatbot: { visualizar: true },
  }
};

export const USUARIOS_SIMULADOS = [
  {
    email: 'secretaria@clinica.com.br',
    senha: '123456',
    perfil: 'Secretária',
    nome: 'Mariana Lima'
  },
  {
    email: 'admin@clinica.com.br',
    senha: '123456',
    perfil: 'Administradora',
    nome: 'Clarissa Melo'
  }
];
