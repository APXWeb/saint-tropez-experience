// Build-time HTML for the parts of index.html that come from src/data/site.js.
// vite.config.js replaces each <!-- @name --> marker in index.html with these strings,
// so the shipped page is static HTML and every fact lives in one file.
import images from './data/images.json' with { type: 'json' }
import { site, vitrine, alsoInHouse, salao, facade, instagramDuo } from './data/site.js'
import { menu, menuCount, menuSource } from './data/cardapio.js'

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export function picture(name, { alt = '', sizes = '100vw', eager = false, cls = '' } = {}) {
  const meta = images[name]
  if (!meta) throw new Error(`Imagem desconhecida: ${name}`)
  const set = (ext) => meta.sizes.map((w) => `/img/${name}-${w}.${ext} ${w}w`).join(', ')
  const fallback = meta.sizes.find((w) => w >= 1000) ?? meta.sizes.at(-1)
  return (
    `<picture${cls ? ` class="${cls}"` : ''}>` +
    `<source type="image/avif" srcset="${set('avif')}" sizes="${sizes}">` +
    `<img src="/img/${name}-${fallback}.webp" srcset="${set('webp')}" sizes="${sizes}" ` +
    `width="${meta.w}" height="${meta.h}" alt="${esc(alt)}" ` +
    (eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"') +
    `></picture>`
  )
}

const icon = {
  arrow: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg>',
  pin: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.6"/></svg>',
  route: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="18" r="2.4"/><circle cx="18" cy="6" r="2.4"/><path d="M8.4 18H15a3.5 3.5 0 0 0 0-7H9a3.5 3.5 0 0 1 0-7h6.6"/></svg>',
  insta: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="0.9" class="dot"/></svg>',
  waze: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 15.5c-1-1.3-1.5-3-1.5-4.6C3 6.5 7 3 12 3s9 3.5 9 7.9-4 7.6-9 7.6h-2.2"/><circle cx="8" cy="19" r="1.8"/><circle cx="15.5" cy="19" r="1.8"/><path d="M9 9.5v.1M15 9.5v.1M9.5 13c1.4 1 3.6 1 5 0"/></svg>',
  search: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.8-4.8"/></svg>',
  close: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  back: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H6M11 6l-6 6 6 6"/></svg>',
  expand: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>',
}

// Authored line icons for the six Instagram highlights (the house uses turquoise covers).
const highlightIcon = {
  Clientes: '<path d="M9 11a3.2 3.2 0 1 0 0-6.4A3.2 3.2 0 0 0 9 11zM3.5 19.5c.6-3.3 2.8-5.5 5.5-5.5s4.9 2.2 5.5 5.5"/><path d="M15.5 5.2a3 3 0 0 1 0 5.6M17.5 14.3c1.6.8 2.7 2.7 3 5.2"/>',
  Adega: '<path d="M8 3h3v3.5c1.6.8 2.5 2.2 2.5 4V21h-8V10.5c0-1.8.9-3.2 2.5-4zM15.5 9h5c0 2.6-1 4.3-2.5 4.6V20M16 20h4"/>',
  'Bolos e doces': '<path d="M4 20h16M5 20v-6h14v6M5 14c1.5 1.4 3 1.4 4.6 0 1.6 1.4 3.2 1.4 4.8 0 1.6 1.4 3.1 1.4 4.6 0M7 14v-3.5h10V14M12 10.5V7.5M12 7.5c-1-.8-1-2.2 0-3.5 1 1.3 1 2.7 0 3.5z"/>',
  Cafés: '<path d="M4.5 10h12v4.5a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5zM16.5 11.5h1.3a2.3 2.3 0 0 1 0 4.6h-1.6M8.5 3.5c-.8 1 .8 2 0 3.5M12.5 3.5c-.8 1 .8 2 0 3.5"/>',
  'Ilha de frios': '<path d="M3.5 15.5 13 6l7.5 6v6.5h-17zM3.5 15.5h17M8 18.5v.1M12 13.5a1.4 1.4 0 1 0 0 .1M16.5 16.5a1 1 0 1 0 0 .1"/>',
  Localização: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.6"/>',
}

// One small line icon per vitrine shelf, drawn like the highlight icons below.
const shelfIcon = {
  'bolos-e-doces': '<path d="M4 20h16M5 20v-6h14v6M5 14c1.5 1.4 3 1.4 4.6 0 1.6 1.4 3.2 1.4 4.8 0 1.6 1.4 3.1 1.4 4.6 0M7 14v-3.5h10V14M12 10.5V7.5M12 7.5c-1-.8-1-2.2 0-3.5 1 1.3 1 2.7 0 3.5z"/>',
  'paes-e-folhados': '<path d="M2.500 15.500C3.500 9.500 7.500 5.500 12 5.500s8.500 4 9.500 10c-1.500 1.700-3.300 1.800-4.600.600-.800 1.700-3 2-4.100.500-1.100 1.500-3.300 1.200-4.100-.500-1.300 1.200-3.100 1.100-4.600-.600z"/><path d="M8 8.500l2 7M12 6v9.500M16 8.500l-2 7"/>',
  'salgados': '<path d="M12 3.500c-.900 0-1.400.600-1.700 1.600C8 8.200 4.500 10.200 4.500 14.500c0 3.800 3.300 6 7.500 6s7.500-2.200 7.500-6c0-4.300-3.500-6.300-5.800-9.400-.3-1-.8-1.600-1.700-1.600z"/><path d="M9 14.500h.01M12.500 12.500h.01M15.500 15.500h.01M11 17.500h.01"/>',
  'pratos-e-saladas': '<path d="M7 3v7M4.500 3v5a2.500 2.500 0 0 0 5 0V3M7 10.500V21M17 21V3c-2.300 1.200-3.500 3.800-3.500 7 0 2.200 1.200 3.300 3.500 3.700"/>',
  'cafes-e-adega': '<path d="M4.500 10h12v4.500a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5zM16.500 11.500h1.300a2.300 2.300 0 0 1 0 4.600h-1.600M8.500 3.500c-.8 1 .8 2 0 3.500M12.500 3.500c-.8 1 .8 2 0 3.500"/>',
}

const ext = 'target="_blank" rel="noopener"'

// The vitrine is one glass case: a plaque per shelf above it, and the chosen shelf
// laid out inside as a composed set of photos. Each shelf shows its first photos
// (data order = featured first); "ver todas" opens the lightbox with every photo.
const IN_CASE = 5

function vitrineHTML() {
  let index = 0
  const tabs = vitrine
    .map(
      (c, i) =>
        `<button class="plaque" type="button" role="tab" id="tab-${c.id}" aria-controls="${c.id}" aria-selected="${i === 0}"` +
        `${i === 0 ? '' : ' tabindex="-1"'} data-plaque="${i}"><span class="plaque-name">${esc(c.title)}</span>` +
        `<svg class="plaque-icon" viewBox="0 0 24 24" aria-hidden="true">${shelfIcon[c.id]}</svg></button>`,
    )
    .join('')
  const panels = vitrine
    .map((c, ci) => {
      const first = index
      index += c.items.length
      const shown = c.items.slice(0, IN_CASE)
      const pieces = shown
        .map(
          (it, i) =>
            `<figure class="piece piece--${i + 1}">` +
            `<button class="piece-open" type="button" data-index="${first + i}" aria-label="Ampliar foto: ${esc(it.caption)}">` +
            picture(it.img, { alt: it.alt, sizes: i === 0 ? '(max-width: 760px) 92vw, 34vw' : '(max-width: 760px) 46vw, 17vw' }) +
            `<span class="piece-glass" aria-hidden="true"></span>` +
            `</button><figcaption>${esc(it.caption)}</figcaption></figure>`,
        )
        .join('')
      return (
        `<div class="shelf" id="${c.id}" role="tabpanel" aria-labelledby="tab-${c.id}" data-shelf="${ci}"${ci === 0 ? '' : ' hidden'}>` +
        `<div class="case-glass case-glass--${shown.length}">${pieces}</div>` +
        `<div class="case-base">` +
        `<div class="case-label"><h3>${esc(c.title)}</h3><p>${esc(c.note)}</p></div>` +
        `<div class="case-actions">` +
        `<button class="case-more" type="button" data-index="${first}">${icon.expand}<span>Ver as ${c.items.length} fotos</span></button>` +
        (c.menu ? `<a class="case-menu" href="cardapio.html#${c.menu}"><span>Ver no cardápio</span>${icon.arrow}</a>` : '') +
        `</div></div></div>`
      )
    })
    .join('')
  const also = alsoInHouse.length
    ? `<p class="vitrine-also">E também: ${alsoInHouse.map(esc).join(', ').toLowerCase()}, com destaque próprio no <a href="${site.links.instagram}" ${ext}>Instagram da casa</a>.</p>`
    : `<p class="vitrine-also">Quer ver mais? Os destaques da casa estão no <a href="${site.links.instagram}" ${ext}>Instagram</a>.</p>`
  return { tabs, panels, also }
}

function salaoFrames() {
  return salao.frames
    .map(
      (f, i) =>
        `<figure class="frame frame--${i + 1}" data-reveal>${picture(f.img, { alt: f.alt, sizes: f.sizes, cls: 'frame-pic' })}</figure>`,
    )
    .join('')
}

function hoursRows() {
  // Monday first, the way people read a week in Brazil.
  const order = [1, 2, 3, 4, 5, 6, 0]
  return order
    .map((d) => {
      const h = site.hours[d]
      return `<tr data-day="${d}"><th scope="row">${h.day}</th><td>${h.open}h às ${h.close}h</td></tr>`
    })
    .join('')
}

function highlightsHTML() {
  return site.highlights
    .map(
      (h) =>
        `<li><a href="${h.href}" class="hl"><span class="hl-ring"><svg viewBox="0 0 24 24" aria-hidden="true">${highlightIcon[h.name]}</svg></span><span class="hl-name">${esc(h.name)}</span></a></li>`,
    )
    .join('')
}

// Instagram: the day and the night of the same façade, one arch to slide across.
// A range input sits over the whole frame, so dragging, touch and the keyboard all work.
function instaDuo() {
  const sizes = '(max-width: 960px) 92vw, 46vw'
  return (
    `<div class="duo" data-duo>` +
    `<div class="duo-frame">` +
    `<div class="duo-pic duo-day">${picture(instagramDuo.day.img, { alt: instagramDuo.day.alt, sizes })}</div>` +
    `<div class="duo-pic duo-night">${picture(instagramDuo.night.img, { alt: instagramDuo.night.alt, sizes })}</div>` +
    `<span class="duo-tag duo-tag--day" aria-hidden="true">De dia</span>` +
    `<span class="duo-tag duo-tag--night" aria-hidden="true">À noite</span>` +
    `<span class="duo-line" aria-hidden="true"></span>` +
    `<input class="duo-range" type="range" min="0" max="100" value="50" aria-label="Deslize para comparar a fachada de dia e à noite">` +
    `</div>` +
    `<div class="duo-copy">` +
    `<h3 class="duo-title">A mesma fachada, <em>de dia e à noite.</em></h3>` +
    `<p>De dia, o relevo branco e a marquise turquesa. À noite, a cobertura de arcos e o letreiro acesos. Arraste a linha para comparar.</p>` +
    `<a class="link-arrow" href="${site.links.instagram}" ${ext}>Ver mais fotos no Instagram ${icon.arrow}</a>` +
    `</div>` +
    `</div>`
  )
}

// Cardápio: the index on the home links into cardapio.html, which holds the whole board.
function menuIndexHTML() {
  return menu
    .map(
      (c) =>
        `<li><a href="cardapio.html#${c.id}"><span class="mi-name">${esc(c.title)}</span>` +
        `<span class="mi-tag">${esc(c.tag)}</span><span class="mi-count">${c.items.length}</span></a></li>`,
    )
    .join('')
}

const menuNavHTML = () => menu.map((c) => `<li><a href="#${c.id}">${esc(c.title)}</a></li>`).join('')

function menuItemHTML([no, name, price, desc]) {
  return (
    `<li class="carta-item" data-item>` +
    `<div class="carta-line"><span class="carta-no">${esc(no)}</span><h3 class="carta-name">${esc(name)}</h3>` +
    `<span class="carta-leader" aria-hidden="true"></span><span class="carta-price">R$ ${esc(price)}</span></div>` +
    (desc ? `<p class="carta-desc">${esc(desc)}</p>` : '') +
    `</li>`
  )
}

function menuBoardHTML() {
  return menu
    .map((c) => {
      const extras =
        (c.note ? `<p class="carta-note">${esc(c.note)}</p>` : '') +
        (c.suggestions
          ? `<div class="carta-ideas">` +
            c.suggestions
              .map(
                (g) =>
                  `<div class="carta-ideas-group"><h3>${esc(g.title)}</h3><ul>` +
                  g.items.map(([n, d]) => `<li><strong>${esc(n)}</strong> ${esc(d)}</li>`).join('') +
                  `</ul></div>`,
              )
              .join('') +
            (c.sauces ? `<p class="carta-sauces"><strong>Molhos</strong> ${c.sauces.map(esc).join(' · ')}</p>` : '') +
            `</div>`
          : '')
      return (
        `<section class="carta-cat" id="${c.id}" aria-labelledby="${c.id}-t" data-cat>` +
        `<header class="carta-head"><p class="carta-tag">${esc(c.tag)}</p><h2 class="carta-title" id="${c.id}-t">${esc(c.title)}</h2></header>` +
        `<ol class="carta-list" role="list">${c.items.map(menuItemHTML).join('')}</ol>` +
        extras +
        `</section>`
      )
    })
    .join('')
}

const jsonLd = () =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Bakery',
    name: site.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.streetLong,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.zip,
      addressCountry: 'BR',
    },
    geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
    sameAs: [site.links.instagram],
    openingHoursSpecification: site.hours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][site.hours.indexOf(h)]}`,
      opens: `${String(h.open).padStart(2, '0')}:00`,
      closes: `${String(h.close).padStart(2, '0')}:00`,
    })),
  })

export function blocks() {
  const v = vitrineHTML()
  const a = site.address
  return {
    'name': esc(site.name),
    'tagline': esc(site.tagline),
    'street': esc(a.street),
    'street-long': esc(a.streetLong),
    'district': esc(a.district),
    'city-line': `${esc(a.district)}, ${esc(a.city)}, ${a.state} · <span class="nowrap">${a.zip}</span>`,
    'region': esc(a.region),
    'hours-summary': esc(site.hoursSummary),
    'hours-rows': hoursRows(),
    'rules': site.rules.map((r) => `<li>${esc(r)}.</li>`).join(''),
    'rating': `${site.rating.value} no ${site.rating.source}, em ${site.rating.count} avaliações (${site.rating.month})`,
    'maps': site.links.maps,
    'directions': site.links.directions,
    'waze': site.links.waze,
    'map-embed': site.links.mapEmbed,
    'instagram': site.links.instagram,
    'ig-handle': site.links.instagramHandle,
    'apx': site.links.apx,
    'vitrine-tabs': v.tabs,
    'vitrine-panels': v.panels,
    'vitrine-also': v.also,
    'salao-wide': picture(salao.wide.img, { alt: salao.wide.alt, sizes: '100vw', cls: 'reveal-pic' }),
    'salao-frames': salaoFrames(),
    'hero-salao': picture('salao-vidro', { alt: 'Corredor do salão sob a cobertura de arcos de vidro, com mesas brancas e cadeiras de palhinha dos dois lados', sizes: '(max-width: 760px) 70vw, 34vw', eager: true }),
    'hero-square': picture(facade.sign.img, { alt: facade.sign.alt, sizes: '(max-width: 760px) 44vw, 18vw', eager: true }),
    'facade-day': picture(facade.day.img, { alt: facade.day.alt, sizes: '(max-width: 760px) 92vw, 38vw' }),
    'facade-night': picture(facade.night.img, { alt: facade.night.alt, sizes: '(max-width: 760px) 92vw, 42vw' }),
    'highlights': highlightsHTML(),
    'insta-duo': instaDuo(),
    'json-ld': jsonLd(),
    'menu-index': menuIndexHTML(),
    'menu-nav': menuNavHTML(),
    'menu-board': menuBoardHTML(),
    'menu-count': String(menuCount),
    'menu-cats': String(menu.length),
    'menu-note': esc(menuSource.note),
    'i-arrow': icon.arrow,
    'i-pin': icon.pin,
    'i-route': icon.route,
    'i-insta': icon.insta,
    'i-waze': icon.waze,
    'i-search': icon.search,
    'i-close': icon.close,
    'i-back': icon.back,
    'year': String(new Date().getFullYear()),
  }
}
