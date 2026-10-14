// The facade relief: a lattice of white diamond pyramids lit by a moving sun.
// One tile is shaded per light change and repeated as a canvas pattern, so a frame
// costs a single fillRect no matter the screen size.

const TILE_W = 88
const TILE_H = 76
const PEAK = 26 // pyramid height, in the same units as the tile
const APEX_DROP = 0.14 // apex sits a little below centre: the facade reads as scales

const DAY_BASE = [240, 242, 239]
const NIGHT_BASE = [16, 38, 40]
const SHADOW_WHITE = [214, 220, 215] // --relief-lo
const LIT_WHITE = [248, 249, 246] // --relief-hi

const mix = (a, b, t) => a + (b - a) * t
const mix3 = (a, b, t) => [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)]

function normal(a, b, c) {
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
  const v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  let n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[2] < 0) n = n.map((x) => -x)
  const l = Math.hypot(...n)
  return n.map((x) => x / l)
}

export function createRelief(canvas) {
  const ctx = canvas.getContext('2d', { alpha: false })
  const tile = document.createElement('canvas')
  const tctx = tile.getContext('2d')
  let dpr = 1
  let width = 0
  let height = 0
  let pattern = null
  let lastKey = ''
  let offset = 0

  // Light state, set from outside (scroll position, intro).
  const light = { az: -140, el: 20, warmth: 0.6, night: 0 }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    width = window.innerWidth
    height = window.innerHeight
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    lastKey = ''
    render()
  }

  function shadeTile() {
    const tw = Math.round(TILE_W * dpr)
    const th = Math.round(TILE_H * dpr)
    tile.width = tw
    tile.height = th

    const az = (light.az * Math.PI) / 180
    const el = (light.el * Math.PI) / 180
    const L = [Math.cos(el) * Math.cos(az), Math.cos(el) * Math.sin(az), Math.sin(el)]

    const n = light.night
    const base = mix3(DAY_BASE, NIGHT_BASE, n)
    // Sun colour: warm at the ends of the day, neutral at noon, cool uplight at night.
    const warm = [1.0, 0.997 - 0.006 * light.warmth, 0.993 - 0.016 * light.warmth]
    const tint = mix3(warm, [0.8, 1.05, 1.02], n)
    const ambient = mix(0.885, 0.62, n)
    const diffuse = mix(0.155, 0.5, n)
    // Daylight: faces run from the wall's shadow white to its lit white. A low sun carves the
    // pyramids; an overhead sun flattens them, so contrast peaks at dawn and dusk only.
    const high = Math.min(1, Math.max(0, (light.el - 10) / 42))
    const contrast = mix(1, 0.38, high)

    const cells = [
      [0, 0], [tw, 0], [0, th], [tw, th], [tw / 2, th / 2],
    ]
    const peak = PEAK * dpr
    for (const [cx, cy] of cells) {
      const top = [cx, cy - th / 2, 0]
      const right = [cx + tw / 2, cy, 0]
      const bottom = [cx, cy + th / 2, 0]
      const left = [cx - tw / 2, cy, 0]
      const apex = [cx, cy + th * APEX_DROP, peak]
      const faces = [
        [top, right, apex],
        [right, bottom, apex],
        [bottom, left, apex],
        [left, top, apex],
      ]
      for (const f of faces) {
        const nn = normal(f[0], f[1], f[2])
        const d = Math.max(0, nn[0] * L[0] + nn[1] * L[1] + nn[2] * L[2])
        let r, g, b
        if (n > 0) {
          const s = ambient + diffuse * d
          r = Math.min(255, base[0] * s * tint[0])
          g = Math.min(255, base[1] * s * tint[1])
          b = Math.min(255, base[2] * s * tint[2])
        } else {
          const t = 1 - contrast * (1 - d)
          const c = mix3(SHADOW_WHITE, LIT_WHITE, t)
          r = Math.min(255, c[0] * tint[0])
          g = Math.min(255, c[1] * tint[1])
          b = Math.min(255, c[2] * tint[2])
        }
        const col = `rgb(${r | 0},${g | 0},${b | 0})`
        tctx.fillStyle = col
        tctx.strokeStyle = col
        tctx.lineWidth = 0.75
        tctx.beginPath()
        tctx.moveTo(f[0][0], f[0][1])
        tctx.lineTo(f[1][0], f[1][1])
        tctx.lineTo(f[2][0], f[2][1])
        tctx.closePath()
        tctx.fill()
        tctx.stroke()
      }
    }
    pattern = ctx.createPattern(tile, 'repeat')
  }

  function render() {
    if (!width) return
    const key = `${light.az.toFixed(1)}|${light.el.toFixed(1)}|${light.warmth.toFixed(2)}|${light.night.toFixed(2)}|${dpr}`
    if (key !== lastKey) {
      shadeTile()
      lastKey = key
    }
    if (!pattern) return
    pattern.setTransform(new DOMMatrix().translate(0, Math.round(-offset * dpr) % tile.height))
    ctx.fillStyle = pattern
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  window.addEventListener('resize', resize, { passive: true })
  resize()

  // A standalone tile for CSS backgrounds (the night block), shaded with a given light.
  function tileURL(state) {
    const saved = { ...light }
    Object.assign(light, state)
    shadeTile()
    const url = tile.toDataURL('image/png')
    Object.assign(light, saved)
    lastKey = ''
    render()
    return { url, w: TILE_W, h: TILE_H }
  }

  return {
    light,
    tileURL,
    set(next) {
      Object.assign(light, next)
      render()
    },
    scroll(y) {
      // The wall sits behind the page: it drifts at a fraction of the scroll.
      offset = y * 0.18
      render()
    },
    render,
  }
}

// Sun path for a day progress t in [0, 1]: rises on the left, crosses, sets on the right.
export function sunAt(t) {
  const az = mix(-165, -15, t)
  const el = 12 + Math.sin(Math.PI * t) * 40
  const warmth = Math.abs(t - 0.5) * 2
  return { az, el, warmth }
}
