export const CLIENTES_INICIAIS = [
  {
    id: 1,
    nome: 'Ana Souza',
    tel: '(11) 98765-4321',
    email: 'ana@email.com',
    tipo: 'ativo',
    ultimaVisita: '05/09/2026',
    ultimoProc: 'Drenagem Linfática',
    obs: 'Prefere horário matinal'
  },
  {
    id: 2,
    nome: 'Beatriz Lima',
    tel: '(11) 91234-5678',
    email: 'bea@email.com',
    tipo: 'ativo',
    ultimaVisita: '03/09/2026',
    ultimoProc: 'Limpeza de Pele',
    obs: 'Pele sensível'
  },
  {
    id: 3,
    nome: 'Carla Ferreira',
    tel: '(11) 94444-3333',
    email: 'carla@email.com',
    tipo: 'potencial',
    ultimaVisita: '-',
    ultimoProc: '-',
    obs: 'Veio pelo Instagram'
  },
  {
    id: 4,
    nome: 'Diana Rocha',
    tel: '(11) 93333-2222',
    email: 'diana@email.com',
    tipo: 'ativo',
    ultimaVisita: '28/08/2026',
    ultimoProc: 'Peeling Químico',
    obs: 'Tratamento anti-idade'
  },
  {
    id: 5,
    nome: 'Elaine Matos',
    tel: '(11) 92222-1111',
    email: 'elaine@email.com',
    tipo: 'inativo',
    ultimaVisita: '10/07/2026',
    ultimoProc: 'Radiofrequência',
    obs: 'Parou tratamento no inverno'
  },
  {
    id: 6,
    nome: 'Flávia Costa',
    tel: '(11) 95555-6666',
    email: 'flavia@email.com',
    tipo: 'ativo',
    ultimaVisita: '06/09/2026',
    ultimoProc: 'Redução de Medidas',
    obs: 'Pacote 10 sessões'
  },
  {
    id: 7,
    nome: 'Gabi Alves',
    tel: '(11) 96666-7777',
    email: 'gabi@email.com',
    tipo: 'potencial',
    ultimaVisita: '-',
    ultimoProc: '-',
    obs: 'Indicação da Ana Souza'
  },
  {
    id: 8,
    nome: 'Helena Dias',
    tel: '(11) 97777-8888',
    email: 'helena@email.com',
    tipo: 'ativo',
    ultimaVisita: '01/09/2026',
    ultimoProc: 'Drenagem Linfática',
    obs: 'Gestante - protocolo adaptado'
  },
];

export const HISTORICO_CLIENTES = {
  1: [
    { data: '05/09/2026', proc: 'Drenagem Linfática', valor: 'R$ 180,00', obs: 'Sessão 8 de 10' },
    { data: '22/08/2026', proc: 'Drenagem Linfática', valor: 'R$ 180,00', obs: 'Sessão 7 de 10' },
    { data: '08/08/2026', proc: 'Redução de Medidas', valor: 'R$ 220,00', obs: 'Primeira sessão nova metodologia' },
  ],
  2: [
    { data: '03/09/2026', proc: 'Limpeza de Pele', valor: 'R$ 150,00', obs: 'Pele reagiu muito bem' },
    { data: '03/08/2026', proc: 'Limpeza de Pele', valor: 'R$ 150,00', obs: 'Extração completa' },
  ],
  4: [
    { data: '28/08/2026', proc: 'Peeling Químico', valor: 'R$ 200,00', obs: 'Retorno agendado' },
  ],
  6: [
    { data: '06/09/2026', proc: 'Redução de Medidas', valor: 'R$ 220,00', obs: 'Resultado excelente' },
  ],
  8: [
    { data: '01/09/2026', proc: 'Drenagem Linfática', valor: 'R$ 180,00', obs: 'Protocolo gestante suave' },
  ]
};
