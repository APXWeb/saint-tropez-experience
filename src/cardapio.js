import '@fontsource-variable/figtree'
import './styles/main.css'
import './styles/cardapio.css'

import Lenis from 'lenis'
import { initStatus } from './js/status.js'
import { initMenu } from './js/menu.js'

// Cardápio page: search across every item and a category rail that follows the reader.
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const $ = (s, el = document) => el.querySelector(s)
const $$ = (s, el = document) => [...el.querySelectorAll(s)]
const top = $('[data-top]')

initStatus()

let lenis = null
if (!reduced) {
  lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95, anchors: false })
  const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf) }
  requestAnimationFrame(raf)
}

initMenu({ top, lenis, reduced })

const headerState = () => { top.dataset.scrolled = String(window.scrollY > 24) }
window.addEventListener('scroll', headerState, { passive: true })
headerState()

/* Category links: land the heading under the header (and under the rail on phones). */
const rail = $('[data-cat-nav]')
function offset() {
  const railStuck = getComputedStyle(rail).position === 'sticky'
  return top.offsetHeight + (railStuck ? rail.offsetHeight : 0) + 16
}
function goTo(target, { instant = false } = {}) {
  const y = target.getBoundingClientRect().top + window.scrollY - offset()
  if (lenis && !instant) lenis.scrollTo(y, { duration: 1.1 })
  else window.scrollTo({ top: y, behavior: 'auto' })
}
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]')
  if (!a) return
  const target = document.getElementById(a.getAttribute('href').slice(1))
  if (!target) return
  e.preventDefault()
  goTo(target)
  history.replaceState(null, '', a.getAttribute('href'))
  const heading = target.querySelector('h2') || target
  heading.setAttribute('tabindex', '-1')
  heading.focus({ preventScroll: true })
})
window.addEventListener('load', () => {
  const t = location.hash && document.getElementById(location.hash.slice(1))
  if (t) setTimeout(() => goTo(t, { instant: true }), 40)
})

/* Search */
const normalize = (text) => text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
const escapeHtml = (text) => text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

/** Wraps the first match of the query in <mark>, ignoring accents. */
function highlight(original, query) {
  if (!query) return escapeHtml(original)
  const at = normalize(original).indexOf(query)
  if (at < 0) return escapeHtml(original)
  // Normalising can change the length; map the match back character by character.
  let start = -1
  let end = -1
  let pos = 0
  for (let i = 0; i < original.length; i++) {
    const len = normalize(original[i]).length
    if (start < 0 && pos >= at) start = i
    pos += len
    if (start >= 0 && pos >= at + query.length) { end = i + 1; break }
  }
  if (start < 0 || end < 0) return escapeHtml(original)
  return `${escapeHtml(original.slice(0, start))}<mark>${escapeHtml(original.slice(start, end))}</mark>${escapeHtml(original.slice(end))}`
}

function initSearch() {
  const input = $('[data-search]')
  const clear = $('[data-search-clear]')
  const status = $('[data-search-status]')
  const empty = $('[data-search-empty]')
  const term = $('[data-search-term]')
  const cats = $$('[data-cat]')
  const navLinks = new Map($$('a', rail).map((a) => [a.getAttribute('href').slice(1), a]))

  const items = cats.flatMap((cat) =>
    $$('[data-item]', cat).map((el) => {
      const name = $('.carta-name', el)
      return { el, cat, name, original: name.textContent, text: normalize(el.textContent.replace(/\s+/g, ' ')) }
    }),
  )

  let timer = 0
  function apply() {
    const query = normalize(input.value.trim())
    clear.hidden = !input.value
    let total = 0
    const perCat = new Map(cats.map((c) => [c, 0]))
    for (const item of items) {
      const match = !query || item.text.includes(query)
      item.el.hidden = !match
      item.name.innerHTML = match ? highlight(item.original, query) : escapeHtml(item.original)
      if (match) {
        total++
        perCat.set(item.cat, perCat.get(item.cat) + 1)
      }
    }
    for (const cat of cats) {
      const count = perCat.get(cat)
      cat.hidden = Boolean(query) && count === 0
      // Notes and suggestions describe the whole category, not a search result.
      $$('.carta-note, .carta-ideas', cat).forEach((el) => { el.hidden = Boolean(query) })
      navLinks.get(cat.id)?.classList.toggle('is-empty', Boolean(query) && count === 0)
    }
    empty.hidden = !query || total > 0
    term.textContent = input.value.trim()
    status.textContent = query ? (total === 1 ? '1 item encontrado' : `${total} itens encontrados`) : ''
    lenis?.resize()
    scheduleRail()
  }

  input.addEventListener('input', () => {
    clearTimeout(timer)
    timer = setTimeout(apply, 120)
  })
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && input.value) { e.preventDefault(); input.value = ''; apply() }
  })
  const reset = () => { input.value = ''; apply(); input.focus() }
  clear.addEventListener('click', reset)
  $('[data-search-reset]').addEventListener('click', reset)
}

/* Category rail: the active category is the last visible one whose top has passed a third of the screen. */
const links = $$('a', rail)
const cats = links.map((a) => document.getElementById(a.getAttribute('href').slice(1)))
let current = null
let queued = false
function updateRail() {
  queued = false
  const line = window.innerHeight * 0.33
  const visible = cats.filter((c) => !c.hidden)
  let active = visible[0]
  for (const c of visible) if (c.getBoundingClientRect().top <= line) active = c
  if (!active || active.id === current) return
  current = active.id
  for (const a of links) {
    const on = a.getAttribute('href') === `#${current}`
    if (on) {
      a.setAttribute('aria-current', 'true')
      // On the horizontal rail (phones), keep the active category in view.
      const list = a.closest('nav')
      if (list.scrollWidth > list.clientWidth) {
        list.scrollTo({ left: a.offsetLeft - list.clientWidth / 2 + a.offsetWidth / 2, behavior: reduced ? 'auto' : 'smooth' })
      }
    } else {
      a.removeAttribute('aria-current')
    }
  }
}
function scheduleRail() {
  if (!queued) { queued = true; requestAnimationFrame(updateRail) }
}
window.addEventListener('scroll', scheduleRail, { passive: true })
window.addEventListener('resize', scheduleRail)

initSearch()
updateRail()
