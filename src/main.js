import '@fontsource/gloock'
import '@fontsource-variable/figtree'
import './styles/main.css'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { createRelief, sunAt } from './js/relief.js'
import { initStatus } from './js/status.js'
import { initLightbox } from './js/lightbox.js'

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
const menu = $('[data-menu]')
const menuBtn = $('[data-menu-open]')
function setMenu(open, { focus = true } = {}) {
  menuBtn.setAttribute('aria-expanded', String(open))
  menuBtn.querySelector('.menu-btn-label').textContent = open ? 'Fechar' : 'Menu'
  top.dataset.menuState = open ? 'open' : ''
  if (open) {
    menu.hidden = false
    requestAnimationFrame(() => (menu.dataset.open = 'true'))
    lenis?.stop()
    document.body.style.overflow = 'hidden'
    if (focus) setTimeout(() => $('a', menu)?.focus(), 80)
  } else {
    menu.dataset.open = 'false'
    lenis?.start()
    document.body.style.overflow = ''
    setTimeout(() => { if (menu.dataset.open === 'false') menu.hidden = true }, reduced ? 0 : 560)
    if (focus) menuBtn.focus()
  }
}
menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'))
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menu.dataset.open === 'true') setMenu(false)
  // Keep Tab inside the open menu (and the header button that closes it).
  if (e.key === 'Tab' && menu.dataset.open === 'true') {
    const items = [menuBtn, ...$$('a, button', menu)]
    const i = items.indexOf(document.activeElement)
    if (e.shiftKey && i <= 0) { e.preventDefault(); items.at(-1).focus() }
    else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus() }
  }
})
window.matchMedia('(min-width: 961px)').addEventListener('change', (e) => {
  if (e.matches && menu.dataset.open === 'true') setMenu(false, { focus: false })
})

/* In-page links go through Lenis; the vitrine tabs map to the horizontal rail */
let railTrigger = null
const track = $('[data-track]')
const rail = $('[data-rail]')
const railDistance = () => Math.max(0, track.scrollWidth - window.innerWidth)
function shelfY(shelf) {
  if (!railTrigger) return shelf.getBoundingClientRect().top + window.scrollY - (top.offsetHeight + 12)
  const gutter = parseFloat(getComputedStyle(track).paddingLeft) || 0
  const x = Math.min(railDistance(), Math.max(0, shelf.offsetLeft - gutter))
  return railTrigger.start + (x / railDistance()) * (railTrigger.end - railTrigger.start)
}
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]')
  if (!a) return
  const id = a.getAttribute('href').slice(1)
  const target = id ? document.getElementById(id) : null
  if (!target) return
  e.preventDefault()
  const fromMenu = a.hasAttribute('data-menu-link')
  if (fromMenu) setMenu(false, { focus: false })
  const go = () => {
    const y = target.classList.contains('shelf') ? shelfY(target) : id === 'inicio' ? 0 : target.getBoundingClientRect().top + window.scrollY
    scrollTo(y)
    history.replaceState(null, '', `#${id}`)
    // Move focus for keyboard and screen-reader users without a second jump.
    const focusTarget = target.querySelector('h1, h2, h3') || target
    focusTarget.setAttribute('tabindex', '-1')
    focusTarget.focus({ preventScroll: true })
  }
  fromMenu ? setTimeout(go, reduced ? 0 : 320) : go()
})

/* Motion */
const mm = gsap.matchMedia()

if (!reduced) {
  // Opening: sunrise on the wall, the title rises out of its lines, the windows open.
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, onComplete: () => root.classList.add('js-ready') })
  tl.to({}, { duration: 2.2, ease: 'power2.out', onUpdate() { intro = this.progress(); lightFromScroll() } }, 0)
    .fromTo('.hero-title .ln > span', { yPercent: 110 }, { yPercent: 0, duration: 1.25, stagger: 0.09 }, 0.15)
    .fromTo('[data-hero-arch]', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' }, 0.1)
    .fromTo('[data-hero-arch] img', { scale: 1.18 }, { scale: 1, duration: 2.2 }, 0.1)
    .fromTo('[data-hero-square]', { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 1.2 }, 0.75)
    .fromTo(['.hero-lead', '.hero-plaque', '.hero-actions'], { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08 }, 0.55)
    .set(['.hero-title .ln > span', '[data-hero-arch]', '[data-hero-square]', '.hero-lead', '.hero-plaque', '.hero-actions'], { clearProps: 'transform,clipPath,opacity,visibility' })

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

mm.add(
  {
    desktop: '(min-width: 1024px) and (min-height: 621px)',
    mobile: '(max-width: 1023px), (max-height: 620px)',
    motion: '(prefers-reduced-motion: no-preference)',
  },
  (ctx) => {
    const { desktop, motion } = ctx.conditions
    const tabs = $$('.shelf-tab')
    const shelves = $$('.shelf[id]')
    const bar = $('[data-rail-bar]')
    const markTab = (i) => tabs.forEach((t, k) => t.setAttribute('aria-current', String(k === i)))

    // Vitrine: on desktop the shelves slide past like walking along the glass.
    if (desktop) {
      const tween = gsap.to(track, {
        x: () => -railDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: rail,
          start: 'top top',
          end: () => `+=${railDistance() * 0.72}`,
          pin: true,
          scrub: motion ? 0.7 : true,
          invalidateOnRefresh: true,
          onUpdate(self) {
            if (bar) bar.style.transform = `scaleX(${self.progress})`
            const x = self.progress * railDistance() + window.innerWidth * 0.35
            let current = 0
            shelves.forEach((s, i) => { if (s.offsetLeft <= x) current = i })
            markTab(current)
          },
          onLeave: () => markTab(-1),
          onLeaveBack: () => markTab(-1),
        },
      })
      railTrigger = tween.scrollTrigger
      // Keyboard focus inside the rail: bring the focused photo into view.
      const onFocus = (e) => {
        rail.scrollLeft = 0
        const piece = e.target.closest('.piece, .shelf--also')
        if (!piece || !railTrigger) return
        // offsetLeft is measured against the rail (the nearest positioned box), unaffected by the track's transform.
        const left = piece.offsetLeft
        const x = Math.min(railDistance(), Math.max(0, left - window.innerWidth * 0.3))
        const y = railTrigger.start + (x / railDistance()) * (railTrigger.end - railTrigger.start)
        if (Math.abs(window.scrollY - y) > 2) {
          lenis ? lenis.scrollTo(y, { immediate: true, force: true }) : window.scrollTo(0, y)
        }
        // Keyboard users get the shelf in place at once, not after the scrub easing.
        ScrollTrigger.update()
        railTrigger.getTween?.()?.progress(1)
      }
      rail.addEventListener('focusin', onFocus)
      return () => {
        railTrigger = null
        rail.removeEventListener('focusin', onFocus)
      }
    }

    // Narrow screens: native horizontal rows; tabs track the shelf in view.
    shelves.forEach((s, i) => {
      ScrollTrigger.create({ trigger: s, start: 'top 60%', end: 'bottom 40%', onToggle: ({ isActive }) => isActive && markTab(i) })
    })
    return undefined
  },
)

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
  if (location.hash) {
    const t = document.getElementById(location.hash.slice(1))
    if (t) setTimeout(() => scrollTo(t.classList.contains('shelf') ? shelfY(t) : t.getBoundingClientRect().top + window.scrollY, { immediate: true }), 60)
  }
})
