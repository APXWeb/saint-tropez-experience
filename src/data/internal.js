// REFERÊNCIA INTERNA. Nada deste arquivo aparece no site.
// Nenhum arquivo do projeto importa este módulo, então ele não entra no HTML nem no JS
// publicados. Quando um dado for confirmado com a casa, ele passa para site.js.
// Fontes: levantamento enviado pelo usuário em 13/10/2026 e pesquisa da mesma data.

export const updatedOn = '2026-10-13'

// Endereço: exibido como nº 221 (perfil do Google), mas ainda não validado.
export const address = {
  shown: 'Rua Piracema, 221, Santa Teresinha, São Paulo, SP, 02460-040',
  status: 'pendente de confirmação com a casa',
  divergence: [
    { number: '221', sources: ['Perfil da casa no Google (consultado em 13/10/2026)'] },
    { number: '211', sources: ['Site antigo da APX (APXWeb/saint-tropez-confeitaria)', 'Cadastro empresarial (CNPJ)', 'Waze', 'BaresSP'] },
  ],
}

// Horário: o site usa a grade do Google, que coincide com o levantamento.
export const hours = {
  shown: 'Seg a qui 6h às 22h; sex e sáb 6h às 23h; dom 6h às 22h',
  sources: ['Perfil da casa no Google', 'Levantamento de 13/10/2026'],
  note: 'A bio do Instagram diz apenas "6:00 às 22:00", sem a extensão de sexta e sábado.',
}

// Ano de abertura: não exibir sem confirmação.
export const openingYear = {
  candidates: [
    { year: 2020, source: 'Matéria que cita a inauguração' },
    { year: 2019, source: 'Constituição do CNPJ (a empresa pode ter aberto depois)' },
  ],
  display: false,
}

// Estacionamento: uma listagem indica estacionamento para clientes.
// Não afirmar que é gratuito nem que há manobrista.
export const parking = {
  claim: 'Estacionamento para clientes',
  sources: ['Listagem pública (Waze)'],
  unknown: ['gratuito ou pago', 'manobrista'],
  display: false,
}

// Cardápio histórico: nomes vistos em cardápios antigos enviados por usuários.
// Pode não refletir o que a casa vende hoje. Os preços desses cardápios são antigos
// e não foram registrados aqui; não exibir preços sem validação.
export const historicMenu = {
  source: 'Cardápios antigos enviados por usuários (levantamento de 13/10/2026)',
  current: false,
  showPrices: false,
  items: [
    'Café Expresso',
    'Café com Leite',
    'Café Monaco',
    'Pão com Manteiga',
    'Pão na Chapa',
    'Pão de Queijo',
    'Fatia de Bolo',
    'Croissant com Manteiga',
    'Torrada Brioche Saint Tropez',
    'Misto Quente',
    'Bauru',
    'Canoa Saint Tropez',
    'Canoa de Atum',
    'Canoa Mortadela',
    'Quiche e Salada',
    'Contra e Salada',
    'Crepe Salgado',
    'Crepe Doce',
    'Petit Gateau',
    'Banana Split',
    'Açaí na Tigela',
  ],
  // Possível correspondência com as fotos, a confirmar com a casa antes de renomear legendas.
  photoHints: {
    'salgado-tomate': 'O formato de barco lembra as "Canoas" do cardápio; a foto não diz qual.',
    croissants: 'Pode ser o "Croissant com Manteiga".',
  },
}

// Tudo o que precisa de resposta da casa antes de entrar no site.
export const pending = [
  'Número do endereço: 221 (Google) ou 211 (site antigo, CNPJ, Waze, BaresSP).',
  'Horário de sexta e sábado até 23h (Google) contra "6:00 às 22:00" (bio do Instagram).',
  'Ano de abertura: 2020 (matéria) ou 2019 (CNPJ).',
  'Estacionamento para clientes: existe? É gratuito? Há manobrista?',
  'Quais itens do cardápio histórico seguem à venda, com nomes oficiais e preços atuais.',
  'Telefone ou WhatsApp: a casa não divulga nenhum; o site não tem.',
]
