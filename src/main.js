import '@fontsource-variable/figtree'
import './styles/main.css'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { createRelief, sunAt } from './js/relief.js'
import { initStatus } from './js/status.js'
import { initLightbox } from './js/lightbox.js'
import { initMenu } from './js/menu.js'

gsap.registerPlugin(ScrollTrigger)

const root = document.documentElement
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const $ = (s, el = document) => el.querySelector(s)
const $$ = (s, el = document) => [...el.querySelectorAll(s)]

initStatus()

/* Scroll: Lenis drives ScrollTrigger; reduced motion keeps the native scroll. */
let lenis = null
if (!reduced) {
  lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95, anchors: false })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
  // Pins add height after Lenis measured the page: keep its scroll limit in sync.
  ScrollTrigger.addEventListener('refresh', () => lenis.resize())
}
const scrollTo = (y, opts = {}) => {
  if (lenis) {
    lenis.resize()
    lenis.scrollTo(y, { duration: 1.2, ...opts })
  }
  else window.scrollTo({ top: typeof y === 'number' ? y : y.getBoundingClientRect().top + window.scrollY, behavior: 'auto' })
}

/* The relief and its sun */
const relief = createRelief($('.relief'))
root.classList.add('has-relief')
const visite = $('#visite')
// The address block is night on the same wall: lit from below, like the entrance after dark.
{
  const t = relief.tileURL({ az: 90, el: 16, warmth: 0, night: 1 })
  visite.style.backgroundImage = `url(${t.url})`
  visite.style.backgroundSize = `${t.w}px ${t.h}px`
}
let intro = reduced ? 1 : 0 // sunrise on load
function lightFromScroll() {
  const y = window.scrollY
  const dayEnd = Math.max(1, visite.offsetTop - window.innerHeight * 0.5)
  const t = Math.min(1, y / dayEnd)
  const sun = sunAt(t)
  // Intro: the sun starts grazing the wall and climbs to its scroll position.
  relief.set({ az: sun.az, el: 4 + (sun.el - 4) * intro, warmth: sun.warmth, night: 0 })
  relief.scroll(y)
}
window.addEventListener('scroll', lightFromScroll, { passive: true })
window.addEventListener('resize', lightFromScroll, { passive: true })
lightFromScroll()

/* Header: solid after the fold, follows the colour of the section under it */
const top = $('[data-top]')
function headerState() {
  top.dataset.scrolled = String(window.scrollY > 24)
  const probe = (top.offsetHeight || 70) - 1
  const vit = $('#vitrine').getBoundingClientRect()
  const night = visite.getBoundingClientRect().top <= probe
  const turq = vit.top <= probe && vit.bottom > probe
  top.dataset.theme = night ? 'night' : turq ? 'turq' : ''
}
window.addEventListener('scroll', headerState, { passive: true })
headerState()

/* Mobile menu */
const setMenu = initMenu({ top, lenis, reduced })

/* In-page links go through Lenis. A link to a vitrine shelf (#cafes-e-adega, #bolos-e-doces...)
   opens that shelf and scrolls to the vitrine; showShelf is set by the vitrine block below. */
let showShelf = () => false
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]')
  if (!a) return
  const id = a.getAttribute('href').slice(1)
  const target = id ? document.getElementById(id) : null
  if (!target) return
  e.preventDefault()
  const fromMenu = a.hasAttribute('data-menu-link')
  if (fromMenu) setMenu(false, { focus: false })
  const isShelf = target.classList.contains('shelf')
  const go = () => {
    if (isShelf) showShelf(id)
    const anchor = isShelf ? $('#vitrine') : target
    const y = id === 'inicio' ? 0 : anchor.getBoundingClientRect().top + window.scrollY
    scrollTo(y)
    history.replaceState(null, '', `#${id}`)
    // Move focus for keyboard and screen-reader users without a second jump.
    const focusTarget = isShelf ? $('[data-plaque][aria-selected="true"]') : target.querySelector('h1, h2, h3') || target
    focusTarget.setAttribute('tabindex', '-1')
    focusTarget.focus({ preventScroll: true })
  }
  fromMenu ? setTimeout(go, reduced ? 0 : 320) : go()
})

/* Motion */
const mm = gsap.matchMedia()

if (!reduced) {
  // Opening: only the sunrise on the wall runs here. The title, copy and windows enter in CSS
  // (see "Entrada da abertura"), so they never wait for this script to load.
  gsap.to({}, { duration: 2.2, ease: 'power2.out', onUpdate() { intro = this.progress(); lightFromScroll() } })

  // The windows sit at different depths in the wall.
  gsap.to('[data-hero-square]', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
  gsap.to('[data-hero-arch] picture', { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })

  // Photos set into the wall open from the sill up, the picture settling inside.
  $$('[data-reveal]').forEach((el) => {
    const pic = $('picture', el)
    const t = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 86%', once: true } })
    t.fromTo(pic || el, { clipPath: 'inset(18% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.out' })
    if (pic) t.fromTo($('img', pic), { scale: 1.14 }, { scale: 1, duration: 1.6, ease: 'expo.out' }, 0)
    if (!pic) t.fromTo(el, { y: 30 }, { y: 0, duration: 1.1, ease: 'expo.out' }, 0)
  })
}

/* Vitrine: the plaques choose which shelf sits behind the glass. */
{
  const plaques = $$('[data-plaque]')
  const shelves = $$('.shelf[data-shelf]')
  let current = 0
  function choose(i, { focus = false } = {}) {
    if (i === current) return
    const from = shelves[current]
    const to = shelves[i]
    current = i
    plaques.forEach((p, k) => {
      p.setAttribute('aria-selected', String(k === i))
      p.tabIndex = k === i ? 0 : -1
    })
    if (focus) plaques[i].focus()
    from.hidden = true
    to.hidden = false
    if (reduced) return
    // The new shelf is set into the case piece by piece, from the counter up.
    gsap.fromTo($$('.piece', to), { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'expo.out', stagger: 0.06, clearProps: 'clipPath' })
    gsap.fromTo($$('.piece img', to), { scale: 1.12 }, { scale: 1, duration: 1.2, ease: 'expo.out', stagger: 0.06, clearProps: 'transform' })
    gsap.fromTo($('.case-base', to), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out', clearProps: 'all' })
  }
  plaques.forEach((p, i) => p.addEventListener('click', () => choose(i)))
  showShelf = (id) => {
    const i = shelves.findIndex((sh) => sh.id === id)
    if (i < 0) return false
    choose(i)
    return true
  }
  // Arrow keys move between plaques, as in any tab list.
  $('[data-plaques]').addEventListener('keydown', (e) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]
    if (step) { e.preventDefault(); choose((current + step + plaques.length) % plaques.length, { focus: true }) }
    if (e.key === 'Home') { e.preventDefault(); choose(0, { focus: true }) }
    if (e.key === 'End') { e.preventDefault(); choose(plaques.length - 1, { focus: true }) }
  })
}

mm.add('(prefers-reduced-motion: no-preference)', () => {
  // O salão: an arch in the wall widens until the room fills the screen.
  const narrow = window.matchMedia('(max-width: 760px)').matches
  const from = narrow ? 'inset(16% 12% 0% 12% round 38vw 38vw 0vw 0vw)' : 'inset(12% 32% 0% 32% round 18vw 18vw 0vw 0vw)'
  const tl = gsap.timeline({
    scrollTrigger: { trigger: '[data-salao]', start: 'top top', end: '+=105%', pin: true, scrub: 0.6, invalidateOnRefresh: true },
  })
  tl.fromTo('[data-salao-arch]', { clipPath: from }, { clipPath: 'inset(0% 0% 0% 0% round 0vw 0vw 0vw 0vw)', ease: 'power2.inOut', duration: 1 }, 0)
    .fromTo('[data-salao-arch] img', { scale: 1.32 }, { scale: 1, ease: 'power1.out', duration: 1 }, 0)
    .fromTo('[data-salao-copy]', { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.35 }, 0.62)
    .to({}, { duration: 0.25 })
})

/* Lightbox */
initLightbox({
  reduced,
  onOpen: () => lenis?.stop(),
  onClose: () => lenis?.start(),
})

/* Instagram: the façade opens from day to night as it comes into view, then the reader can slide it. */
{
  const duo = $('[data-duo]')
  if (duo) {
    const range = $('.duo-range', duo)
    const set = (v) => duo.style.setProperty('--split', `${v}%`)
    set(range.value)
    range.addEventListener('input', () => set(range.value))
    if (!reduced) {
      gsap.fromTo(duo, { '--split': '100%' }, {
        '--split': `${range.value}%`,
        duration: 1.8,
        ease: 'expo.out',
        scrollTrigger: { trigger: duo, start: 'top 82%', once: true },
      })
    }
  }
}

/* Map: loads from Google only on request */
const mapBtn = $('[data-map-load]')
mapBtn?.addEventListener('click', () => {
  const iframe = document.createElement('iframe')
  iframe.src = mapBtn.dataset.src
  iframe.title = 'Mapa com a localização da Saint Tropez Confeitaria na Rua Piracema, 221'
  iframe.loading = 'lazy'
  iframe.referrerPolicy = 'no-referrer-when-downgrade'
  iframe.allowFullscreen = true
  mapBtn.replaceWith(iframe)
  $('.map-note').textContent = 'Mapa do Google.'
})

/* Section highlight in the nav */
const navLinks = $$('.nav a')
$$('main > section[id]').forEach((sec) => {
  ScrollTrigger.create({
    trigger: sec,
    start: 'top 45%',
    end: 'bottom 45%',
    onToggle: ({ isActive }) => {
      if (!isActive) return
      navLinks.forEach((a) => a.setAttribute('aria-current', String(a.getAttribute('href') === `#${sec.id}`)))
    },
  })
})

/* Fonts and images change layout: refresh the scroll math once they settle. */
document.fonts?.ready.then(() => ScrollTrigger.refresh())
window.addEventListener('load', () => {
  ScrollTrigger.refresh()
  lightFromScroll()
  openHash()
})
// A shelf link opened from another page (or the address changed by hand, or back/forward)
// lands on the vitrine with that shelf open.
function openHash() {
  if (!location.hash) return
  const t = document.getElementById(location.hash.slice(1))
  if (!t) return
  const anchor = t.classList.contains('shelf') && showShelf(t.id) ? $('#vitrine') : t
  setTimeout(() => scrollTo(anchor.getBoundingClientRect().top + window.scrollY, { immediate: true }), 60)
}
window.addEventListener('hashchange', openHash)
