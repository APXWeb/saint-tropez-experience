// Mobile menu: the canopy that drops over the page. Shared by the home and the cardápio.
export function initMenu({ top, lenis = null, reduced = false }) {
  const $ = (s, el = document) => el.querySelector(s)
  const $$ = (s, el = document) => [...el.querySelectorAll(s)]
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
  return setMenu
}
