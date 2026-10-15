// Vitrine lightbox: native <dialog>, the photo flies from its place on the shelf,
// arrows / swipe / keyboard move through the whole vitrine.
import images from '../data/images.json'
import { vitrine } from '../data/site.js'

const BASE = import.meta.env.BASE_URL
const items = vitrine.flatMap((c) => c.items.map((it) => ({ ...it, category: c.title })))

function imgFor(item) {
  const meta = images[item.img]
  const img = new Image()
  img.alt = item.alt
  img.width = meta.w
  img.height = meta.h
  img.sizes = '(max-width: 760px) 96vw, 80vw'
  img.srcset = meta.sizes.map((w) => `${BASE}img/${item.img}-${w}.webp ${w}w`).join(', ')
  img.src = `${BASE}img/${item.img}-${meta.sizes.at(-1)}.webp`
  return img
}

export function initLightbox({ onOpen, onClose, reduced }) {
  const dialog = document.querySelector('[data-lightbox]')
  const frame = dialog.querySelector('[data-lb-frame]')
  const cat = dialog.querySelector('[data-lb-cat]')
  const title = dialog.querySelector('[data-lb-title]')
  const count = dialog.querySelector('[data-lb-count]')
  let index = 0
  let trigger = null

  async function show(i, { from, dir = 0 } = {}) {
    index = (i + items.length) % items.length
    const item = items[index]
    const img = imgFor(item)
    cat.textContent = item.category
    title.textContent = item.caption
    count.textContent = `${index + 1} de ${items.length}`
    try {
      await img.decode()
    } catch {
      /* show it anyway */
    }
    const old = frame.firstElementChild
    frame.replaceChildren(img)
    if (reduced) return
    if (from) {
      // FLIP: start where the thumbnail is, land in the frame.
      const a = from.getBoundingClientRect()
      const b = img.getBoundingClientRect()
      if (b.width && b.height) {
        const sx = a.width / b.width
        const sy = a.height / b.height
        const s = Math.max(sx, sy)
        img.animate(
          [
            { transform: `translate(${a.left + a.width / 2 - (b.left + b.width / 2)}px, ${a.top + a.height / 2 - (b.top + b.height / 2)}px) scale(${s})`, clipPath: `inset(${((1 - sy / s) * 50).toFixed(2)}% ${((1 - sx / s) * 50).toFixed(2)}%)` },
            { transform: 'none', clipPath: 'inset(0% 0%)' },
          ],
          { duration: 620, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
        )
      }
    } else if (old || dir) {
      img.animate(
        [{ opacity: 0, transform: `translateX(${dir * 40}px)` }, { opacity: 1, transform: 'none' }],
        { duration: 420, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
      )
    }
  }

  function open(i, el) {
    trigger = el
    dialog.showModal()
    onOpen?.()
    show(i, { from: el.querySelector('img') })
  }

  function close() {
    dialog.close()
  }

  dialog.addEventListener('close', () => {
    onClose?.()
    frame.replaceChildren()
    trigger?.focus({ preventScroll: true })
  })

  // Photos in the case, and each shelf's "ver todas" button (which starts at the shelf's first photo).
  document.querySelectorAll('.piece-open, .case-more').forEach((btn) => {
    btn.addEventListener('click', () => open(Number(btn.dataset.index), btn))
  })
  dialog.querySelector('[data-lb-prev]').addEventListener('click', () => show(index - 1, { dir: -1 }))
  dialog.querySelector('[data-lb-next]').addEventListener('click', () => show(index + 1, { dir: 1 }))
  dialog.querySelector('[data-lb-close]').addEventListener('click', close)
  // Click on the dark backdrop (outside the photo and controls) closes.
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog || e.target.classList.contains('lb-stage')) close()
  })
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); show(index + 1, { dir: 1 }) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(index - 1, { dir: -1 }) }
  })

  // Swipe on touch screens.
  let x0 = null
  dialog.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') x0 = e.clientX })
  dialog.addEventListener('pointerup', (e) => {
    if (x0 === null) return
    const dx = e.clientX - x0
    x0 = null
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1), { dir: dx < 0 ? 1 : -1 })
  })
}
