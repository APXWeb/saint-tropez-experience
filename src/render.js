// Build-time HTML for the parts of index.html that come from src/data/site.js.
// vite.config.js replaces each <!-- @name --> marker in index.html with these strings,
// so the shipped page is static HTML and every fact lives in one file.
import images from './data/images.json' with { type: 'json' }
import { site, vitrine, alsoInHouse, salao, facade, instagramPicks } from './data/site.js'

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

const ext = 'target="_blank" rel="noopener"'

function vitrineHTML() {
  let index = 0
  const nav = vitrine
    .map(
      (c, i) =>
        `<li><a class="shelf-tab" href="#${c.id}" data-shelf="${i}"><span>${esc(c.title)}</span><span class="shelf-count">${c.items.length}</span></a></li>`,
    )
    .join('')
  const shelves = vitrine
    .map((c, ci) => {
      const items = c.items
        .map((it, i) => {
          const n = index++
          return (
            `<figure class="piece piece--${(i % 5) + 1}">` +
            `<button class="piece-open" type="button" data-index="${n}" aria-label="Ampliar foto: ${esc(it.caption)}">` +
            picture(it.img, { alt: it.alt, sizes: '(max-width: 760px) 78vw, 30vw' }) +
            `<span class="piece-glass" aria-hidden="true"></span>` +
            `<span class="piece-zoom" aria-hidden="true">${icon.expand}</span>` +
            `</button><figcaption>${esc(it.caption)}</figcaption></figure>`
          )
        })
        .join('')
      return (
        `<section class="shelf" id="${c.id}" aria-labelledby="${c.id}-t" data-shelf="${ci}">` +
        `<header class="shelf-head"><h3 id="${c.id}-t">${esc(c.title)}</h3><p>${esc(c.note)}</p></header>` +
        `<div class="shelf-pieces">${items}</div></section>`
      )
    })
    .join('')
  const also =
    `<aside class="shelf shelf--also" aria-labelledby="also-t"><header class="shelf-head">` +
    `<h3 id="also-t">E também</h3><p>Sem fotos aqui, mas com destaque próprio no Instagram da casa.</p></header>` +
    `<ul class="also-list">${alsoInHouse.map((a) => `<li>${esc(a)}</li>`).join('')}</ul>` +
    `<a class="link-arrow" href="${site.links.instagram}" ${ext}>Ver os destaques no Instagram ${icon.arrow}</a></aside>`
  return { nav, shelves: shelves + also }
}

function salaoFrames() {
  return salao.frames
    .map(
      (f, i) =>
        `<figure class="frame frame--${i + 1}" data-reveal>${picture(f.img, { alt: f.alt, sizes: '(max-width: 760px) 92vw, 40vw', cls: 'frame-pic' })}<figcaption>${esc(f.caption)}</figcaption></figure>`,
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
        `<li><a href="${site.links.instagram}" ${ext} class="hl"><span class="hl-ring"><svg viewBox="0 0 24 24" aria-hidden="true">${highlightIcon[h]}</svg></span><span class="hl-name">${esc(h)}</span></a></li>`,
    )
    .join('')
}

function instaStrip() {
  return instagramPicks
    .map(
      (name, i) =>
        `<li class="ig ig--${i + 1}"><a href="${site.links.instagram}" ${ext} aria-label="Abrir o Instagram da Saint Tropez">${picture(name, { alt: '', sizes: '(max-width: 760px) 45vw, 20vw' })}</a></li>`,
    )
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
    'city-line': `${esc(a.district)}, ${esc(a.city)}, ${a.state} · ${a.zip}`,
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
    'booking-whatsapp': esc(site.booking.whatsappLabel),
    'vitrine-nav': v.nav,
    'vitrine-shelves': v.shelves,
    'salao-wide': picture(salao.wide.img, { alt: salao.wide.alt, sizes: '100vw', cls: 'reveal-pic' }),
    'salao-frames': salaoFrames(),
    'hero-salao': picture('salao-vidro', { alt: 'Corredor do salão sob a cobertura de arcos de vidro, com mesas brancas e cadeiras de palhinha dos dois lados', sizes: '(max-width: 760px) 70vw, 34vw', eager: true }),
    'hero-cake': picture('bolo-camadas-frutas', { alt: 'Bolo de camadas vermelhas coberto de frutas vermelhas', sizes: '(max-width: 760px) 44vw, 18vw', eager: true }),
    'facade-day': picture(facade.day.img, { alt: facade.day.alt, sizes: '(max-width: 760px) 92vw, 38vw' }),
    'facade-night': picture(facade.night.img, { alt: facade.night.alt, sizes: '(max-width: 760px) 92vw, 42vw' }),
    'highlights': highlightsHTML(),
    'insta-strip': instaStrip(),
    'json-ld': jsonLd(),
    'i-arrow': icon.arrow,
    'i-pin': icon.pin,
    'i-route': icon.route,
    'i-insta': icon.insta,
    'i-waze': icon.waze,
    'year': String(new Date().getFullYear()),
  }
}
