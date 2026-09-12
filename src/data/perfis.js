export const NEXA_PERFIS = {
  'Secretária': {
    modulos: ['agendamento', 'estoque'],
    agendamento: { criar: true, editar: true, cancelar: true },
    estoque: { criar: false, editar: false, excluir: false }, // Somente leitura
  },
  'Administradora': {
    modulos: ['dashboard', 'clientes', 'agendamento', 'financeiro', 'estoque', 'relatorios', 'usuarios', 'chatbot'],
    agendamento: { criar: true, editar: true, cancelar: true },
    estoque: { criar: true, editar: true, excluir: true },
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
