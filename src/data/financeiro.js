// src/data/financeiro.js
// Dados financeiros simulados para o módulo Admin

export const RECEITAS_INICIAIS = [
  { id: 1,  data: '2026-09-01', cliente: 'Ana Souza',      proc: 'Drenagem Linfática',   valor: 180,  forma: 'Pix',        status: 'recebido' },
  { id: 2,  data: '2026-09-01', cliente: 'Beatriz Lima',   proc: 'Limpeza de Pele',       valor: 150,  forma: 'Cartão',     status: 'recebido' },
  { id: 3,  data: '2026-09-02', cliente: 'Diana Rocha',    proc: 'Peeling Químico',        valor: 220,  forma: 'Dinheiro',   status: 'recebido' },
  { id: 4,  data: '2026-09-03', cliente: 'Flávia Costa',   proc: 'Redução de Medidas',    valor: 280,  forma: 'Cartão',     status: 'recebido' },
  { id: 5,  data: '2026-09-04', cliente: 'Helena Dias',    proc: 'Drenagem Linfática',    valor: 180,  forma: 'Pix',        status: 'recebido' },
  { id: 6,  data: '2026-09-05', cliente: 'Ana Souza',      proc: 'Radiofrequência',        valor: 350,  forma: 'Cartão',     status: 'recebido' },
  { id: 7,  data: '2026-09-08', cliente: 'Beatriz Lima',   proc: 'Tratamento Facial',      valor: 190,  forma: 'Pix',        status: 'recebido' },
  { id: 8,  data: '2026-09-09', cliente: 'Gabi Alves',     proc: 'Limpeza de Pele',        valor: 150,  forma: 'Dinheiro',   status: 'recebido' },
  { id: 9,  data: '2026-09-10', cliente: 'Carla Ferreira', proc: 'Massagem Modeladora',   valor: 160,  forma: 'Pix',        status: 'recebido' },
  { id: 10, data: '2026-09-11', cliente: 'Diana Rocha',    proc: 'Criolipólise',           valor: 480,  forma: 'Cartão',     status: 'recebido' },
  { id: 11, data: '2026-09-12', cliente: 'Flávia Costa',   proc: 'Drenagem Linfática',    valor: 180,  forma: 'Pix',        status: 'recebido' },
  { id: 12, data: '2026-09-12', cliente: 'Helena Dias',    proc: 'Radiofrequência',        valor: 350,  forma: 'Cartão',     status: 'recebido' },
  { id: 13, data: '2026-09-15', cliente: 'Ana Souza',      proc: 'Peeling Químico',        valor: 220,  forma: 'Pix',        status: 'pendente' },
  { id: 14, data: '2026-09-16', cliente: 'Beatriz Lima',   proc: 'Redução de Medidas',    valor: 280,  forma: 'Cartão',     status: 'pendente' },
  { id: 15, data: '2026-09-17', cliente: 'Gabi Alves',     proc: 'Tratamento Facial',      valor: 190,  forma: 'Pix',        status: 'pendente' },
];

export const DESPESAS_INICIAIS = [
  { id: 1, data: '2026-09-01', categoria: 'Aluguel',        desc: 'Aluguel do espaço clínica',           valor: 1800, forma: 'Transferência' },
  { id: 2, data: '2026-09-02', categoria: 'Materiais',      desc: 'Compra de cremes e géis esfoliantes', valor: 420,  forma: 'Pix'           },
  { id: 3, data: '2026-09-03', categoria: 'Folha',          desc: 'Salário esteticista Camila',          valor: 1200, forma: 'Transferência' },
  { id: 4, data: '2026-09-05', categoria: 'Energia',        desc: 'Conta de energia elétrica',           valor: 280,  forma: 'Débito auto'   },
  { id: 5, data: '2026-09-08', categoria: 'Marketing',      desc: 'Impulsionamento Instagram',           valor: 150,  forma: 'Cartão'        },
  { id: 6, data: '2026-09-10', categoria: 'Equipamentos',   desc: 'Manutenção aparelho radiofrequência', valor: 380,  forma: 'Pix'           },
  { id: 7, data: '2026-09-12', categoria: 'Materiais',      desc: 'Reposição luvas e máscaras',          valor: 90,   forma: 'Dinheiro'      },
];

export const CATEGORIAS_DESPESA = [
  'Aluguel', 'Materiais', 'Folha', 'Energia', 'Marketing', 'Equipamentos', 'Outros'
];

export const FORMAS_PAGAMENTO = ['Pix', 'Cartão', 'Dinheiro', 'Transferência', 'Débito auto'];
