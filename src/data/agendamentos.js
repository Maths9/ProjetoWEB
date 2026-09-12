export const PROCEDIMENTOS = [
  { nome: 'Drenagem Linfática', dur: 60, preco: 180 },
  { nome: 'Limpeza de Pele', dur: 45, preco: 150 },
  { nome: 'Redução de Medidas', dur: 90, preco: 220 },
  { nome: 'Peeling Químico', dur: 60, preco: 200 },
  { nome: 'Radiofrequência', dur: 60, preco: 250 },
  { nome: 'Tratamento Facial', dur: 45, preco: 160 },
  { nome: 'Massagem Modeladora', dur: 60, preco: 170 },
  { nome: 'Criolipólise', dur: 90, preco: 380 }
];

export const CLIENTES_NOMES = [
  'Ana Souza',
  'Beatriz Lima',
  'Carla Ferreira',
  'Diana Rocha',
  'Elaine Matos',
  'Flávia Costa',
  'Gabi Alves',
  'Helena Dias'
];

export const AGENDAMENTOS_INICIAIS = [
  { id: 1, data: '2026-09-12', hora: '08:30', cliente: 'Ana Souza', proc: 'Drenagem Linfática', duracao: 60, valor: 180, status: 'confirmado' },
  { id: 2, data: '2026-09-12', hora: '09:00', cliente: 'Beatriz Lima', proc: 'Limpeza de Pele', duracao: 45, valor: 150, status: 'confirmado' },
  { id: 3, data: '2026-09-12', hora: '10:00', cliente: 'Carla Ferreira', proc: 'Redução de Medidas', duracao: 90, valor: 220, status: 'aguardando' },
  { id: 4, data: '2026-09-12', hora: '11:30', cliente: 'Diana Rocha', proc: 'Peeling Químico', duracao: 60, valor: 200, status: 'confirmado' },
  { id: 5, data: '2026-09-12', hora: '13:00', cliente: 'Elaine Matos', proc: 'Radiofrequência', duracao: 60, valor: 250, status: 'cancelado' },
  { id: 6, data: '2026-09-12', hora: '14:30', cliente: 'Flávia Costa', proc: 'Drenagem Linfática', duracao: 60, valor: 180, status: 'aguardando' },
  { id: 7, data: '2026-09-12', hora: '16:00', cliente: 'Gabi Alves', proc: 'Tratamento Facial', duracao: 45, valor: 160, status: 'confirmado' },
  { id: 8, data: '2026-09-13', hora: '09:00', cliente: 'Helena Dias', proc: 'Drenagem Linfática', duracao: 60, valor: 180, status: 'confirmado' },
  { id: 9, data: '2026-09-13', hora: '10:30', cliente: 'Ana Souza', proc: 'Massagem Modeladora', duracao: 60, valor: 170, status: 'aguardando' },
  { id: 10, data: '2026-09-14', hora: '08:00', cliente: 'Beatriz Lima', proc: 'Limpeza de Pele', duracao: 45, valor: 150, status: 'confirmado' },
];
