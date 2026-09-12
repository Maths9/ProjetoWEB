export const CATEGORIAS_ESTOQUE = [
  'Produto Corporal',
  'Produto Facial',
  'Peeling',
  'Descartável',
  'Equipamento'
];

export const PRODUTOS_INICIAIS = [
  { id: 1, nome: 'Gel Redutor', categoria: 'Produto Corporal', qtd: 3, minimo: 10, preco: 48.90, status: 'critico' },
  { id: 2, nome: 'Ácido Glicólico 30%', categoria: 'Peeling', qtd: 1, minimo: 5, preco: 89.90, status: 'critico' },
  { id: 3, nome: 'Máscara Facial Hidratante', categoria: 'Produto Facial', qtd: 7, minimo: 15, preco: 35.00, status: 'atencao' },
  { id: 4, nome: 'Creme Firmador Corporal', categoria: 'Produto Corporal', qtd: 12, minimo: 8, preco: 65.00, status: 'ok' },
  { id: 5, nome: 'Sérum Vitamina C', categoria: 'Produto Facial', qtd: 5, minimo: 6, preco: 110.00, status: 'atencao' },
  { id: 6, nome: 'Luvas Descartáveis (cx)', categoria: 'Descartável', qtd: 20, minimo: 5, preco: 18.00, status: 'ok' },
  { id: 7, nome: 'Maca Descartável (rolo)', categoria: 'Descartável', qtd: 3, minimo: 8, preco: 25.00, status: 'critico' },
  { id: 8, nome: 'Óleo de Massagem', categoria: 'Produto Corporal', qtd: 15, minimo: 6, preco: 42.00, status: 'ok' },
];

export const MOVIMENTACOES_INICIAIS = [
  { data: '10/09/2026', produto: 'Gel Redutor', tipo: 'Saída', qtd: 2, motivo: 'Uso em atendimento' },
  { data: '09/09/2026', produto: 'Maca Descartável', tipo: 'Saída', qtd: 5, motivo: 'Uso semanal recepção' },
  { data: '08/09/2026', produto: 'Luvas Descartáveis', tipo: 'Entrada', qtd: 10, motivo: 'Reposição fornecedor' },
  { data: '07/09/2026', produto: 'Creme Firmador', tipo: 'Entrada', qtd: 5, motivo: 'Compra reposição' },
  { data: '06/09/2026', produto: 'Ácido Glicólico 30%', tipo: 'Saída', qtd: 2, motivo: 'Uso em atendimento facial' },
];
