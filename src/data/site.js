// Single source of truth for every fact the site shows about Saint Tropez Confeitaria.
// Each block names where it was checked. Anything not confirmed stays out of the page and
// lives in src/data/internal.js (reference only, never imported by the site).
// Used at build time (vite.config.js renders it into index.html) and at runtime (main.js).

export const checkedOn = '2026-10-13'

export const site = {
  name: 'Saint Tropez Confeitaria',
  shortName: 'Saint Tropez',
  // Instagram bio, checked 2026-10-13.
  tagline: 'Um novo conceito em confeitaria',

  // Google Business profile, checked 2026-10-13 (place id 0x95e8081e2e94cc): nº 221.
  // NOT definitively validated: the old proposal, the company registry, Waze and BaresSP
  // say nº 211. Shown as 221 until the house confirms; see internal.js.
  address: {
    validated: false,
    street: 'R. Piracema, 221',
    streetLong: 'Rua Piracema, 221',
    district: 'Santa Teresinha',
    city: 'São Paulo',
    state: 'SP',
    zip: '02460-040',
    region: 'Zona Norte de São Paulo',
  },
  geo: { lat: -23.4911958, lng: -46.6372651 },

  links: {
    instagram: 'https://www.instagram.com/sainttropezconfeitaria/',
    instagramHandle: '@sainttropezconfeitaria',
    // Opens the exact Google Business place (CID of the profile above).
    maps: 'https://maps.google.com/?cid=42194893093639372',
    directions:
      'https://www.google.com/maps/dir/?api=1&destination=Saint+Tropez+Confeitaria%2C+R.+Piracema%2C+221+-+Santa+Teresinha%2C+S%C3%A3o+Paulo+-+SP',
    waze: 'https://waze.com/ul?ll=-23.4911958%2C-46.6372651&navigate=yes',
    mapEmbed:
      'https://www.google.com/maps?q=Saint+Tropez+Confeitaria,+R.+Piracema,+221,+Santa+Teresinha,+S%C3%A3o+Paulo&z=16&output=embed',
    apx: 'https://apxweb.github.io/apex-web/',
  },

  // Google Business profile, checked 2026-10-13 and matching the survey sent by the user
  // on 2026-10-13. Index 0 = Sunday. The Instagram bio only says "6:00 às 22:00".
  hours: [
    { day: 'Domingo', short: 'Dom', open: 6, close: 22 },
    { day: 'Segunda', short: 'Seg', open: 6, close: 22 },
    { day: 'Terça', short: 'Ter', open: 6, close: 22 },
    { day: 'Quarta', short: 'Qua', open: 6, close: 22 },
    { day: 'Quinta', short: 'Qui', open: 6, close: 22 },
    { day: 'Sexta', short: 'Sex', open: 6, close: 23 },
    { day: 'Sábado', short: 'Sáb', open: 6, close: 23 },
  ],
  hoursSummary: 'Todos os dias a partir das 6h. Até 22h de domingo a quinta, até 23h na sexta e no sábado.',

  // Instagram bio, verbatim meaning, checked 2026-10-13.
  rules: ['Atendimento presencial', 'Não fazemos reservas', 'Não fazemos entregas'],

  // Google Business profile, checked 2026-10-13.
  rating: { value: '4,6', count: '6.342', source: 'Google', month: 'outubro de 2026' },

  // Instagram story highlights, checked 2026-10-13.
  // Os destaques do Instagram viram atalhos para o próprio site (href interno).
  // '#<id da prateleira>' abre a prateleira da vitrine; 'cardapio.html#<id>' abre a categoria.
  highlights: [
    { name: 'Clientes', href: '#salao' },
    { name: 'Adega', href: '#cafes-e-adega' },
    { name: 'Bolos e doces', href: '#bolos-e-doces' },
    { name: 'Cafés', href: 'cardapio.html#cafes' },
    { name: 'Ilha de frios', href: '#cafes-e-adega' },
    { name: 'Localização', href: '#visite' },
  ],
}

// Product photos: all published by the house on Instagram. Captions describe only what
// the photo shows; no product names, prices or recipes were confirmed.
export const vitrine = [
  {
    id: 'bolos-e-doces',
    menu: 'sobremesas', // seção correspondente em cardapio.html
    title: 'Bolos e doces',
    note: 'O nome é o mesmo do destaque da casa no Instagram.',
    items: [
      { img: 'bolo-camadas-frutas', caption: 'Bolo de camadas com frutas vermelhas', alt: 'Bolo alto de camadas vermelhas e creme, coberto de morangos, amoras e mirtilos com açúcar de confeiteiro' },
      { img: 'doces-finos', caption: 'Doces individuais', alt: 'Doces individuais servidos em pratos brancos: um pudim no pote, um doce em forma de rosa vermelha, um de pistache e um com frutas vermelhas' },
      { img: 'doce-urso', caption: 'Doce em forma de urso', alt: 'Doce redondo coberto de chocolate granulado, com orelhas, olhos e focinho de chocolate formando a cara de um urso, sobre base dourada' },
      { img: 'bolo-frutas-vermelhas', caption: 'Bolo com creme e frutas vermelhas', alt: 'Bolo coberto de creme branco com um anel de morangos, framboesas, amoras e mirtilos' },
      { img: 'torta-chocolate', caption: 'Torta com cobertura de chocolate', alt: 'Torta redonda com cobertura de chocolate e camada de creme sobre base dourada' },
      { img: 'doces-caramelizados', caption: 'Doces caramelizados com nozes', alt: 'Doces redondos com calda de caramelo brilhante e nozes no topo, lado a lado na vitrine' },
      { img: 'taca-frutas', caption: 'Taça de frutas', alt: 'Taça de vidro com frutas picadas, morangos e mamão, ao lado de um copo de bebida com espuma' },
      { img: 'fatia-bolo-chocolate', caption: 'Fatia de bolo com cobertura de chocolate', alt: 'Fatia retangular de bolo com camadas de chocolate e creme, cobertura de chocolate polvilhada de açúcar, sobre base dourada' },
    ],
  },
  {
    id: 'paes-e-folhados',
    menu: 'paes', // seção correspondente em cardapio.html
    title: 'Pães e folhados',
    note: 'Da vitrine de pães, com os croissants em primeiro plano.',
    items: [
      { img: 'croissants', caption: 'Croissants', alt: 'Croissants dourados e folhados, em close' },
      { img: 'folhado-creme', caption: 'Folhado com creme', alt: 'Folhado quadrado e dourado com um centro de creme amarelo, polvilhado de açúcar, sobre papel num prato turquesa' },
      { img: 'vitrine-paes', caption: 'Pães na vitrine', alt: 'Vitrine com pães rústicos de casca escura e pãezinhos dourados ao fundo' },
      { img: 'balcao-paes', caption: 'Pães, quiches e tortas no balcão', alt: 'Balcão de vidro com pães rústicos, baguetes, quiches e tortas sobre uma grade de madeira, com a base branca iluminada' },
      { img: 'folhados-coracao', caption: 'Folhados em forma de coração', alt: 'Folhados caramelizados em forma de coração, amontoados' },
      { img: 'croissants-vitrine', caption: 'Croissants na vitrine', alt: 'Croissants enfileirados na vitrine de vidro, com folhados ao lado' },
      { img: 'vitrine-folhados', caption: 'A vitrine de folhados', alt: 'Vitrine de vidro com fileiras de folhados e roscas pequenas' },
      { img: 'paes-dourados', caption: 'Pãezinhos dourados', alt: 'Pãezinhos de casca dourada e brilhante, lado a lado na vitrine' },
      { img: 'croissants-acucar', caption: 'Croissants com açúcar', alt: 'Croissants dourados polvilhados de açúcar, amontoados na vitrine' },
    ],
  },
  {
    id: 'salgados',
    menu: 'sanduiches', // seção correspondente em cardapio.html
    title: 'Salgados',
    note: 'Assados, tortinhas e sanduíches quentes.',
    items: [
      { img: 'salgado-tomate', caption: 'Salgado assado com tomate', alt: 'Salgados de massa assada, abertos, recheados com queijo e uma rodela de tomate com orégano' },
      { img: 'coxinhas', caption: 'Coxinhas', alt: 'Coxinhas douradas, em close' },
      { img: 'sanduiche-salmao', caption: 'Sanduíche de salmão', alt: 'Sanduíche cortado ao meio, com salmão, creme e folhas verdes, num prato turquesa' },
      { img: 'torrada-presunto', caption: 'Torrada com presunto cru e queijo', alt: 'Torrada com presunto cru, queijo branco cremoso e tomates-cereja, com folhas verdes ao lado' },
      { img: 'tortinhas-coloridas', caption: 'Tortinhas salgadas', alt: 'Tortinhas de massa com recheio colorido, lado a lado numa bandeja' },
      { img: 'sanduiche-quente', caption: 'Sanduíche quente', alt: 'Sanduíche de pão rústico com queijo derretido, tomate e folhas, num prato turquesa' },
      { img: 'tortinhas-cremosas', caption: 'Tortinhas de recheio cremoso', alt: 'Tortinhas de massa com recheio branco e cremoso, lado a lado' },
      { img: 'sanduiche-ciabatta', caption: 'Sanduíche com chips', alt: 'Sanduíche de pão rústico com legumes grelhados e queijo, servido com chips' },
      { img: 'quiche-tomate', caption: 'Quiche com tomate', alt: 'Quiche individual gratinada com pedaços de tomate, sobre papel com o logotipo da casa' },
      { img: 'pizza-presunto', caption: 'Pizza com presunto cru e folhas', alt: 'Pizza retangular em pedaços, coberta de presunto cru e folhas verdes, numa bandeja' },
    ],
  },
  {
    id: 'pratos-e-saladas',
    menu: 'pratos', // seção correspondente em cardapio.html
    title: 'Pratos e saladas',
    note: 'Pratos servidos no salão, nas louças azul-claras da casa.',
    items: [
      { img: 'pratos-balcao', caption: 'Os pratos no balcão da cozinha', alt: 'Fileira de pratos montados sobre o balcão laranja, com salmão, legumes, carnes e arroz, e a equipe da cozinha ao fundo' },
      { img: 'prato-salmao', caption: 'Salmão com arroz e legumes', alt: 'Posta de salmão com arroz integral, brócolis e pimentão assado, com molho amarelo' },
      { img: 'salmao-cogumelos', caption: 'Salmão com cogumelos e arroz cremoso', alt: 'Posta de salmão com cogumelos, brócolis e arroz cremoso com queijo ralado' },
      { img: 'pratos-saladas', caption: 'Saladas e molhos', alt: 'Vista de cima de pratos de salada e potinhos de molho verde e vermelho' },
      { img: 'crepe-gratinado', caption: 'Crepe gratinado', alt: 'Crepes cobertos de molho branco e queijo ralado, decorados com salsa e tomate' },
      { img: 'prato-peixe', caption: 'Peixe com purê e batata palha', alt: 'Filés de peixe com purê amarelo, batata palha e molho verde num prato claro' },
      { img: 'salada-salmao', caption: 'Salada com molho à parte', alt: 'Prato de salada de folhas roxas e verdes com um potinho de molho claro' },
      { img: 'prato-carne', caption: 'Carne ao molho com purê e legumes', alt: 'Carne ao molho escuro com purê, cenoura e legumes num prato branco' },
    ],
  },
  {
    id: 'cafes-e-adega',
    menu: 'cafes', // seção correspondente em cardapio.html
    title: 'Cafés e adega',
    note: 'Cafés, adega e ilha de frios, destaques da casa no Instagram.',
    items: [
      { img: 'cafe-espuma', caption: 'Café com espuma e cacau', alt: 'Xícara branca de café com espuma de leite e cacau polvilhado por cima' },
      { img: 'bebida-morango', caption: 'Bebida de morango', alt: 'Taça alta com bebida cremosa de morango, espuma branca e um morango na borda, numa mesa do salão' },
      { img: 'adega-maquinas', caption: 'A adega', alt: 'Balcão branco com duas máquinas de vinho, garrafas de xarope e frutas ao fundo' },
      { img: 'adega-parede', caption: 'As prateleiras de vinhos', alt: 'Parede de prateleiras de madeira e brancas cheias de garrafas de vinho, com uma pilha de caixas de vinho no centro' },
      { img: 'ilha-de-frios', caption: 'A ilha de frios', alt: 'Balcão de frios com fatiadores, presuntos e queijos na vitrine e, à frente, caixas de trufas e outros produtos em prateleiras brancas' },
      { img: 'adega-garrafas', caption: 'O corredor da adega', alt: 'Corredor de prateleiras brancas com garrafas de vinho e espumantes, e um adegueiro de madeira com garrafas deitadas ao fundo' },
    ],
  },
]

// Confirmed by the Instagram highlights, but with no photo on hand.
export const alsoInHouse = [] // a ilha de frios agora tem fotos na prateleira Cafés e adega

export const salao = {
  wide: { img: 'salao-panorama', alt: 'Salão da Saint Tropez visto de dentro: mesas brancas, cadeiras de palhinha e a cobertura de arcos de vidro iluminada' },
  // Galeria depois do arco: sem legendas; sizes acompanha a grade de .salao-frames.
  frames: [
    { img: 'salao-palmeiras', sizes: '(max-width: 760px) 100vw, 56vw', alt: 'Mesas e cadeiras brancas sob a cobertura de arcos de vidro, com palmeiras e prédios do lado de fora' },
    { img: 'salao-arcos', sizes: '(max-width: 760px) 50vw, 40vw', alt: 'Salão com piso de madeira, mesas brancas e arcos de vidro, no fim da tarde' },
    { img: 'carrinho-bolos', sizes: '(max-width: 760px) 50vw, 28vw', alt: 'Carrinho turquesa em forma de triciclo com prateleiras de bolos e doces dentro do salão' },
    { img: 'triciclo', sizes: '(max-width: 760px) 50vw, 28vw', alt: 'Frente de um triciclo turquesa com o logotipo da Saint Tropez, dentro do salão' },
    { img: 'balcao-vitrine', sizes: '(max-width: 760px) 50vw, 56vw', alt: 'Balcão de vitrine branco e comprido, cheio de pães e salgados, no meio do salão' },
    { img: 'salao-palmeira', sizes: '(max-width: 760px) 50vw, 40vw', alt: 'Salão claro com mesas brancas, cadeiras de palhinha e uma palmeira num vaso, com prateleiras ao fundo' },
  ],
}

export const facade = {
  day: { img: 'fachada-inteira', alt: 'O prédio da Saint Tropez inteiro: fachada branca em relevo com o selo e o letreiro, a marquise turquesa e palmeiras na frente' },
  sign: { img: 'fachada-letreiro', alt:'Fachada branca em relevo de pirâmides com o letreiro Saint Tropez confeitaria e a marquise turquesa, sob céu azul' },
  side: { img: 'fachada-relevo', alt: 'Canto da fachada em relevo branco com o logotipo e a marquise turquesa' },
  night: { img: 'fachada-noite-letreiro', alt: 'A fachada branca em relevo à noite, com o selo e o letreiro Saint Tropez confeitaria iluminados' },
}

// Curated, static: photos the house published. Not a live feed.
// A mesma fachada de dia e à noite: duas fotos da casa, comparadas num único quadro.
export const instagramDuo = {
  day: { img: 'fachada-relevo', alt: 'Canto da fachada em relevo branco com o logotipo e a marquise turquesa, de dia' },
  night: { img: 'fachada-noite', alt: 'Cobertura de arcos da entrada à noite, iluminada por baixo' },
}
