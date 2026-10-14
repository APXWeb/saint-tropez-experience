// Live "open now" status from the published hours, in São Paulo time.
import { site } from '../data/site.js'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function nowInSaoPaulo(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(date)
  const get = (t) => parts.find((p) => p.type === t)?.value
  return { day: DAYS.indexOf(get('weekday')), hour: Number(get('hour')) % 24, minute: Number(get('minute')) }
}

export function statusFor({ day, hour, minute }) {
  const today = site.hours[day]
  const t = hour + minute / 60
  if (t >= today.open && t < today.close) {
    const soon = today.close - t <= 1
    return { open: true, text: soon ? `Aberto · fecha às ${today.close}h` : `Aberto agora · até ${today.close}h` }
  }
  if (t < today.open) return { open: false, text: `Fechado agora · abre às ${today.open}h` }
  const tomorrow = site.hours[(day + 1) % 7]
  return { open: false, text: `Fechado agora · abre amanhã às ${tomorrow.open}h` }
}

export function initStatus() {
  const nodes = document.querySelectorAll('[data-status]')
  const rows = document.querySelectorAll('.hours tr[data-day]')
  const update = () => {
    const now = nowInSaoPaulo()
    const s = statusFor(now)
    nodes.forEach((n) => {
      n.dataset.open = String(s.open)
      n.querySelector('[data-status-text]').textContent = s.text
    })
    rows.forEach((r) => {
      if (Number(r.dataset.day) === now.day) r.dataset.today = 'true'
      else r.removeAttribute('data-today')
    })
  }
  update()
  setInterval(update, 60_000)
}
