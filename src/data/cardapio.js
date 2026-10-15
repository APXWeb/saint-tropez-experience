// O cardápio exibido em cardapio.html e no índice da home.
//
// Fonte: vídeo enviado pelo usuário em 14/10/2026, gravando a página
// restaurantguru.com.br/Saint-Tropez-Confeitaria-Sao-Paulo/menu ("menu enviado por
// usuários", cerca de um ano antes). Ela reúne fotos do cardápio impresso de crepes e de
// sanduíches e capturas de celular do cardápio digital da casa (confeitariasainttropez.com.br,
// fora do ar em 14/10/2026). Onde as fontes se sobrepõem, os preços coincidem.
// O usuário aprovou exibir os preços em 14/10/2026; a página avisa que podem ter mudado.
//
// Lacunas conhecidas: as capturas são trechos, então podem faltar itens (o 116 dos salgados
// aparece cortado; os cafés pulam números). Os preços do 52 e do 115 estavam parcialmente
// cobertos no vídeo. O cardápio original repete os números 129 e 140.
// Grafias corrigidas: "Tijela" para Tigela, "Crú" para Cru, "Claricot" para Clericot.
//
// Cada item: [número, nome, preço em reais, descrição opcional].

export const menuSource = {
  label: 'Cardápio digital e impresso da casa, conforme publicado em 2025',
  note: 'Preços conforme o último cardápio publicado pela casa. Podem ter mudado: confirme no balcão.',
}

export const menu = [
  {
    id: 'cafes',
    title: 'Cafés',
    tag: 'Do expresso ao chocolate',
    items: [
      ['17', 'Café Expresso', '9,90'],
      ['18', 'Café com Leite', '9,90'],
      ['19', 'Média Expressa', '10,90'],
      ['20', 'Café com Chantilly', '13,50'],
      ['21', 'Café Duplo', '14,90'],
      ['22', 'Chocolate Quente (pequeno)', '9,90'],
      ['23', 'Chocolate Quente (grande)', '13,90'],
      ['24', 'Chocolate Gelado (300 ml)', '14,50'],
      ['25', 'Cappuccino Quente (pequeno)', '9,90'],
      ['27', 'Cappuccino com Chantilly', '19,50'],
      ['30', 'Café Monaco', '20,90', 'Café curto, chocolate italiano e espuma de leite.'],
      ['35', 'Chocolate Italiano', '19,90'],
      ['129', 'Cappuccino Frozen', '16,90'],
      ['137', 'Café com Chantilly (grande)', '19,90'],
      ['156', 'Cappuccino Vegano', '18,90'],
      ['157', 'Média Descafeinada', '13,90'],
    ],
  },
  {
    id: 'paes',
    title: 'Pães e croissants',
    tag: 'Na chapa, com manteiga',
    items: [
      ['41', 'Croissant com Manteiga', '14,90'],
      ['42', 'Pão com Manteiga', '4,90'],
      ['43', 'Pão com Manteiga na Chapa', '5,90'],
      ['44', 'Pão de Queijo', '7,90'],
      ['45', 'Fatia de Bolo', '7,50'],
      ['46', 'Pão com Nutella', '19,90'],
      ['47', 'Lanche Croissant', '29,90', 'Mussarela, presunto e manjericão.'],
      ['48', 'Torrada Brioche Saint Tropez', '17,90'],
      ['50', 'Pão na Chapa com Requeijão', '12,90', 'Francês, bisnaga, baguete parmesão, gergelim ou integral.'],
      ['51', 'Pães Especiais com Manteiga na Chapa', '9,90', 'Bisnaga, baguete simples, parmesão, gergelim ou integral.'],
      ['52', 'Pães Especiais com Requeijão na Chapa', '13,90', 'Bisnaga, baguete simples, parmesão, gergelim ou integral.'],
      ['115', 'Salgados Simples', '12,90'],
      ['141', 'Croissant com 2 Ovos Mexidos', '25,90'],
      ['142', 'Croissant com Manteiga e Mel', '18,90'],
      ['163', 'Croissant com Queijo Branco', '32,90'],
    ],
  },
  {
    id: 'ovos',
    title: 'Ovos e omeletes',
    tag: 'Mexidos ou em omelete',
    items: [
      ['40', 'Pão com 2 Ovos Mexidos', '16,90'],
      ['55', 'Ovos Mexidos', '17,90'],
      ['56', 'Omelete com 3 Ovos', '26,90'],
      ['57', 'Omelete Queijo Brie', '37,90'],
      ['58', 'Omelete Presunto e Queijo', '35,90'],
      ['59', 'Omelete de Peito de Peru e Queijo Branco', '36,90'],
      ['60', 'Omelete Presunto Cru', '45,90'],
      ['143', 'Tapioca com 2 Ovos Mexidos', '29,90'],
    ],
  },
  {
    id: 'toasts',
    title: 'Toasts',
    tag: 'No pão tostado',
    items: [
      ['63', 'Toast de Pasta de Avocado e Ovo', '39,90'],
      ['64', 'Toast de Presunto Cru', '39,90', 'Rúcula, queijo branco e cottage.'],
      ['66', 'Toast Caprese', '34,90', 'Tomate cereja, mussarela de búfala e manjericão.'],
    ],
  },
  {
    id: 'canoas',
    title: 'Canoas',
    tag: 'O pão em barco',
    items: [
      ['49', 'Canoa Cottage', '20,90'],
      ['61', 'Canoa Saint Tropez', '20,90', 'Ovo mexido, mussarela de búfala e tomate.'],
      ['86', 'Canoa Mortadela Quente com Requeijão', '24,90'],
      ['88', 'Canoa Carne Louca', '24,90'],
      ['112', 'Canoa Mortadela', '24,90', 'Mortadela, mostarda e mel na canoa.'],
      ['161', 'Canoa de Atum', '22,90', 'Requeijão e atum, servida fria.'],
    ],
  },
  {
    id: 'sanduiches',
    title: 'Sanduíches',
    tag: 'Clássicos e da casa',
    note: 'Ao trocar o pão, o valor da troca é somado ao lanche.',
    items: [
      ['89', 'Filé de Frango', '32,90', 'Com queijo ou vinagrete.'],
      ['90', 'Americano', '29,90'],
      ['91', 'Bauru', '22,90'],
      ['92', 'Misto Quente', '21,90'],
      ['93', 'Churrasco', '39,90', 'Com queijo, salada ou vinagrete.'],
      ['94', 'Filé Mignon', '44,90', 'Com queijo, salada ou vinagrete.'],
      ['95', 'Mortadela', '24,90', 'Com queijo, salada ou vinagrete.'],
      ['96', 'Peito de Peru', '33,90', 'Com queijo branco.'],
      ['98', 'Queijo Branco', '29,90', 'Com tomate, orégano e alface.'],
      ['99', 'Queijo Prato Quente', '23,90'],
      ['100', 'Salame com Queijo e Vinagrete', '34,90'],
      ['101', 'X-Burguer', '31,90'],
      ['102', 'X-Salada', '32,90'],
      ['103', 'X-Burguer com Ovo', '35,90'],
      ['104', 'Berinjela e Abobrinha Grelhada', '34,90', 'Mussarela de búfala, tomate seco, rúcula e molho de mostarda no pão ciabatta.'],
      ['105', 'Lanche Croissant Gorgonzola', '34,90', 'Gorgonzola, presunto e mussarela.'],
      ['106', 'Rosbife ao Vinagrete', '42,90', 'Rosbife com queijo, alface e tomate.'],
      ['107', 'Salmão ao Pesto', '55,90', 'Salmão cru, cream cheese e rúcula.'],
      ['108', 'Salpicão de Frango', '33,90', 'Salpicão de frango com rúcula.'],
      ['154', 'Troca do pão: baguete multigrãos, ciabatta ou português', '9,90'],
      ['155', 'Troca do pão: croissant', '10,90'],
    ],
  },
  {
    id: 'beirutes',
    title: 'Beirutes',
    tag: 'No pão sírio',
    items: [
      ['110', 'Beirute de Rosbife', '64,90', 'Rosbife, queijo, presunto, molho, vinagrete, alface, tomate e maionese.'],
      ['111', 'Beirute de Filé Mignon', '66,90', 'Filé mignon, presunto, queijo prato, bacon, alface, tomate e maionese.'],
    ],
  },
  {
    id: 'pratos',
    title: 'Pratos',
    tag: 'Para o almoço',
    items: [
      ['62', 'Contra e Salada', '35,90', 'Contrafilé grelhado, salada e batata chips.'],
      ['82', 'Massa e Hambúrguer', '35,90', 'Massa e molho à escolha, hambúrguer bovino e fatias multigrãos.'],
      ['84', 'Quiche e Salada', '34,90', 'Quiche (consulte os sabores do dia), salada e antepasto de berinjela.'],
      ['162', 'Filé Mignon', '43,90', 'Purê de mandioquinha, filé mignon, batata chips e rúcula.'],
    ],
  },
  {
    id: 'crepes',
    title: 'Crepes e tapiocas',
    tag: 'Monte o seu',
    items: [
      ['67', 'Crepe Salgado', '36,90', 'Com 3 ingredientes e opção de molho.'],
      ['68', 'Crepe Doce', '39,90', 'Com 2 ingredientes e 1 bola de sorvete: creme, morango ou chocolate.'],
    ],
    // Sugestões do cardápio impresso de crepes e tapiocas (sem preço próprio).
    suggestions: [
      {
        title: 'Sugestões salgadas',
        items: [
          ['Marguerita', 'Mussarela, tomate e manjericão'],
          ['Caprese', 'Mussarela de búfala, tomate e manjericão'],
          ['Três Queijos', 'Mussarela, gorgonzola e requeijão cremoso'],
          ['Pizza', 'Mussarela, tomate e orégano'],
          ['Gorgonzola', 'Mussarela, gorgonzola e cebola caramelizada'],
          ['Ricota', 'Ricota, azeitona e requeijão cremoso'],
          ['Búfala', 'Mussarela de búfala, tomate seco e rúcula'],
          ['Atum', 'Atum com requeijão cremoso'],
          ['Frango', 'Frango com requeijão cremoso'],
          ['Calabresa', 'Calabresa com queijo'],
          ['Presunto', 'Presunto e queijo'],
          ['Peito de Peru', 'Peito de peru com queijo'],
          ['Mix de Cogumelos', 'Cogumelos com abobrinha e requeijão'],
          ['Vegetariano', 'Berinjela, abobrinha e tomate seco'],
          ['Portuguesa', 'Mussarela, presunto e milho ou palmito'],
          ['Bacon', 'Mussarela, cream cheese e bacon crocante'],
          ['Carne', 'Carne moída com castanhas e tomate'],
        ],
      },
      {
        title: 'Sugestões doces',
        items: [
          ['Banoffe', 'Doce de leite, banana, chantilly e canela'],
          ['Nutella®', 'Nutella e morangos'],
          ['Romeu e Julieta', 'Queijo branco e goiabada'],
        ],
      },
    ],
    sauces: ['4 Queijos', 'Ao Sugo', 'Rosé', 'Branco', 'Bolonhesa'],
  },
  {
    id: 'sobremesas',
    title: 'Sobremesas e gelados',
    tag: 'Para fechar',
    items: [
      ['124', 'Açaí na Tigela', '34,90', 'Com 2 acompanhamentos.'],
      ['125', 'Milk Shake', '29,90', 'Creme, chocolate ou morango.'],
      ['126', 'Taça de Sorvete com 2 Bolas', '18,90', 'Morango, creme ou chocolate.'],
      ['127', 'Salada de Frutas com Frozen', '15,90'],
      ['129', 'Frozen Batido com 2 Frutas', '24,90'],
      ['130', 'Choco Creme', '28,90', 'Chocolate italiano com sorvete de creme.'],
      ['131', 'Cappuccino Ice', '29,90', 'Sorvete de creme, café, canela e chocolate.'],
      ['140', 'Bolo de Banana com Doce de Leite Quente', '16,90'],
      ['140', 'Bolo de Cenoura com Calda de Chocolate Quente', '16,90'],
      ['151', 'Iogurte Natural com Fruta e Granola', '21,90'],
      ['152', 'Petit Gâteau', '31,90'],
      ['160', 'Banana Split', '39,90', 'Banana, 3 bolas de sorvete (creme, morango e chocolate), chantilly, castanha de caju, cereja e caldas de morango e chocolate.'],
    ],
  },
  {
    id: 'sucos',
    title: 'Sucos',
    tag: 'No copo ou na jarra',
    items: [
      ['71', 'Suco Simples (300 ml)', '16,90'],
      ['72', 'Suco Mix, até 3 frutas (300 ml)', '19,90'],
      ['73', 'Suco Especial (300 ml)', '21,90', 'Açaí ou limonada suíça.'],
      ['74', 'Suco Simples (jarra de 500 ml)', '23,90'],
      ['75', 'Suco Mix, até 3 frutas (jarra de 500 ml)', '24,90'],
      ['76', 'Suco Especial (jarra de 500 ml)', '31,90', 'Açaí ou limonada suíça.'],
      ['77', 'Suco Detox (300 ml)', '19,90', 'Abacaxi, couve, limão, laranja e gengibre.'],
      ['78', 'Suco Detox (jarra de 500 ml)', '28,90', 'Abacaxi, couve, limão, laranja e gengibre.'],
    ],
  },
  {
    id: 'bebidas',
    title: 'Bebidas',
    tag: 'Águas, latas e jarras',
    items: [
      ['79', 'Sangria (500 ml)', '69,90', 'Vinho tinto, laranja, maçã e abacaxi.'],
      ['80', 'Clericot (500 ml)', '69,90', 'Vinho branco, laranja, maçã, abacaxi e morango.'],
      ['132', 'Água Mineral', '7,90'],
      ['133', 'Água Mineral com Gás', '7,90'],
      ['134', 'Refrigerante (lata)', '9,90'],
      ['135', 'Chá ou Suco (lata)', '9,90'],
    ],
  },
  {
    id: 'adicionais',
    title: 'Adicionais',
    tag: 'Para acompanhar',
    items: [
      ['147', 'Leite Condensado', '4,90'],
      ['148', 'Leite em Pó', '4,90'],
      ['153', 'Granola', '4,90'],
      ['158', 'Porção de Batata Chips', '5,90'],
      ['159', 'Porção de Fruta', '5,90'],
    ],
  },
]

export const menuCount = menu.reduce((n, c) => n + c.items.length, 0)
