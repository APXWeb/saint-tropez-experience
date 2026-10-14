// Reservation request, adapted from the Famiglia Mancini proposal for a single house.
//
// This is a DEMO for presenting to Saint Tropez: the house does not take reservations
// today (Instagram bio), and the page says so. There is no booking backend: the form
// composes a WhatsApp message to the number in site.booking and the team would confirm
// there. Times follow the published hours in site.hours. Requests sent from this device
// are kept in localStorage so the guest can ask for a change or a cancellation later.
import { site } from '../data/site.js'

const B = site.booking
const STORAGE_KEY = 'sainttropez.pedidos.v1'
const WEEKDAYS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']

const pad = (n) => String(n).padStart(2, '0')
const isoDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const parseIso = (s) => {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}
const people = (n) => `${n} ${n === 1 ? 'pessoa' : 'pessoas'}`
const clock = (minutes) => `${pad(Math.floor(minutes / 60))}h${minutes % 60 ? pad(minutes % 60) : ''}`
const dateLabel = (iso) => {
  const d = parseIso(iso)
  return `${WEEKDAYS[d.getDay()]}, ${pad(d.getDate())}/${pad(d.getMonth() + 1)}`
}

/** Slots of a weekday, in minutes from midnight, from opening to one hour before closing. */
function slotsFor(day) {
  const h = site.hours[day]
  const out = []
  for (let m = h.open * 60; m <= h.close * 60 - B.lastSlotBeforeClose; m += B.slotMinutes) out.push(m)
  return out
}

function formatPhone(raw) {
  const d = raw.replace(/\D/g, '').replace(/^55(?=\d{10,11}$)/, '')
  if (d.length < 10) return raw.trim()
  return `(${d.slice(0, 2)}) ${d.slice(2)}`
}

function buildMessage(kind, r) {
  const head = {
    new: `Pedido de reserva pelo site · ${site.name}`,
    change: `Alteração de reserva · ${site.name}`,
    cancel: `Cancelamento de reserva · ${site.name}`,
  }[kind]
  const lines = [
    head,
    `Nome: ${r.name}`,
    `Pessoas: ${r.party}`,
    `Data: ${dateLabel(r.date)}`,
    `Horário: ${clock(r.time)}`,
    `WhatsApp: ${r.phone}`,
  ]
  if (r.note) lines.push(`Observações: ${r.note}`)
  if (kind === 'change') lines.push('', 'Olá! Gostaria de alterar esta reserva. Podem me ajudar com a nova data ou horário?')
  if (kind === 'cancel') lines.push('', 'Olá! Gostaria de cancelar esta reserva, por favor.')
  return lines.join('\n')
}

const whatsappUrl = (text) => `https://wa.me/${B.whatsapp}?text=${encodeURIComponent(text)}`

const store = {
  read() {
    try {
      const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      return Array.isArray(list) ? list : []
    } catch {
      return []
    }
  },
  write(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    } catch {
      /* private mode: the request still goes out, it just isn't remembered */
    }
  },
}

// window.open with noopener always returns null, so success cannot be detected;
// the confirmation panel keeps a link as the manual fallback.
function openWhatsapp(text) {
  const url = whatsappUrl(text)
  window.open(url, '_blank', 'noopener')
  return url
}

const svg = (d) => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`
const ico = {
  minus: svg('<path d="M5 12h14"/>'),
  plus: svg('<path d="M12 5v14M5 12h14"/>'),
  out: svg('<path d="M8 16 17 7M9 7h8v8"/>'),
}

function template() {
  return `
  <form class="bk" novalidate data-bk-form>
    <div class="bk-fields">
      <div class="field">
        <label for="bk-date">Dia</label>
        <input id="bk-date" name="date" type="date" required aria-describedby="bk-date-hint bk-date-error">
        <p class="field-hint" id="bk-date-hint" data-bk-date-hint>Até ${B.windowDays} dias a partir de hoje.</p>
        <p class="field-error" id="bk-date-error" hidden></p>
      </div>

      <div class="field">
        <label for="bk-time">Horário</label>
        <select id="bk-time" name="time" required disabled aria-describedby="bk-time-hint bk-time-error">
          <option value="">Escolha o dia primeiro</option>
        </select>
        <p class="field-hint" id="bk-time-hint">Dentro do horário de funcionamento daquele dia.</p>
        <p class="field-error" id="bk-time-error" hidden></p>
      </div>

      <div class="field field--wide">
        <label for="bk-party">Pessoas</label>
        <div class="stepper">
          <button type="button" class="stepper-btn" data-step="-1" aria-label="Menos uma pessoa">${ico.minus}</button>
          <input class="stepper-value" id="bk-party" name="party" type="number" inputmode="numeric" min="1" max="${B.maxParty}" value="2" required aria-describedby="bk-party-error">
          <button type="button" class="stepper-btn" data-step="1" aria-label="Mais uma pessoa">${ico.plus}</button>
        </div>
        <p class="field-error" id="bk-party-error" hidden></p>
      </div>

      <div class="field">
        <label for="bk-name">Nome</label>
        <input id="bk-name" name="name" type="text" autocomplete="name" required maxlength="80" aria-describedby="bk-name-error">
        <p class="field-error" id="bk-name-error" hidden></p>
      </div>

      <div class="field">
        <label for="bk-phone">Seu WhatsApp</label>
        <input id="bk-phone" name="phone" type="tel" autocomplete="tel-national" inputmode="tel" required placeholder="(11) 900000000" maxlength="20" aria-describedby="bk-phone-error">
        <p class="field-error" id="bk-phone-error" hidden></p>
      </div>

      <div class="field field--wide">
        <label for="bk-note">Observações <span class="field-optional">(opcional)</span></label>
        <textarea id="bk-note" name="note" rows="2" maxlength="300" placeholder="Aniversário, cadeirão, mesa no salão…"></textarea>
      </div>
    </div>

    <aside class="bk-summary" aria-label="Resumo do pedido">
      <dl class="bk-ticket">
        <div><dt>Dia</dt><dd data-sum="date">·</dd></div>
        <div><dt>Horário</dt><dd data-sum="time">·</dd></div>
        <div><dt>Pessoas</dt><dd data-sum="party">·</dd></div>
      </dl>
      <p class="bk-ticket-note">A reserva só vale depois da resposta no WhatsApp.</p>
      <button class="btn btn--canopy bk-submit" type="submit">Enviar pedido pelo WhatsApp ${ico.out}</button>
      <p class="bk-fine">Ao enviar, abrimos o WhatsApp com a mensagem pronta. Nada é cobrado pelo site.</p>
    </aside>
  </form>

  <div class="bk-done" role="status" aria-live="polite" tabindex="-1" hidden data-bk-done>
    <p class="bk-done-title" data-bk-done-summary></p>
    <p>Abrimos o WhatsApp com a mensagem pronta. Se ele não abriu, use o botão abaixo. A mesa fica reservada só depois da confirmação.</p>
    <div class="bk-done-actions">
      <a class="btn btn--canopy" href="#reserva" target="_blank" rel="noopener" data-bk-done-link>Abrir o WhatsApp ${ico.out}</a>
      <button class="btn btn--line" type="button" data-bk-done-new>Fazer outro pedido</button>
    </div>
  </div>

  <section class="tickets" aria-labelledby="tickets-t">
    <h3 class="tickets-title" id="tickets-t" tabindex="-1">Seus pedidos neste aparelho</h3>
    <p class="tickets-note">Ficam salvos só neste navegador, para você pedir alteração ou cancelamento depois.</p>
    <ul class="tickets-list" data-tickets-list></ul>
    <p class="tickets-empty" data-tickets-empty>Nenhum pedido enviado deste aparelho ainda.</p>
  </section>`
}

/** Renders the reservation into [data-booking]. */
export function initBooking() {
  const root = document.querySelector('[data-booking]')
  if (!root) return
  root.innerHTML = template()

  const q = (sel) => root.querySelector(sel)
  const form = q('[data-bk-form]')
  const f = form.elements
  const dateHint = q('[data-bk-date-hint]')
  const done = q('[data-bk-done]')
  const ticketsList = q('[data-tickets-list]')
  const ticketsEmpty = q('[data-tickets-empty]')
  const sum = Object.fromEntries([...root.querySelectorAll('[data-sum]')].map((el) => [el.dataset.sum, el]))

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const lastDay = new Date(today)
  lastDay.setDate(lastDay.getDate() + B.windowDays)
  f.date.min = isoDate(today)
  f.date.max = isoDate(lastDay)

  /* ---- Date and time ---- */

  function fillTimes() {
    const select = f.time
    const previous = select.value
    select.replaceChildren()
    if (!f.date.value) {
      select.append(new Option('Escolha o dia primeiro', ''))
      select.disabled = true
      dateHint.textContent = `Até ${B.windowDays} dias a partir de hoje.`
      return
    }
    const day = parseIso(f.date.value).getDay()
    let slots = slotsFor(day)
    if (f.date.value === isoDate(new Date())) {
      // Today: only times still ahead, with half an hour to get there.
      const now = new Date()
      slots = slots.filter((m) => m >= now.getHours() * 60 + now.getMinutes() + 30)
    }
    if (!slots.length) {
      select.append(new Option('Sem horários restantes hoje', ''))
      select.disabled = true
      dateHint.textContent = 'Para hoje não há mais horários. Escolha outro dia.'
      return
    }
    const h = site.hours[day]
    dateHint.textContent = `${h.day}: a casa abre das ${h.open}h às ${h.close}h.`
    select.disabled = false
    select.append(new Option('Escolha um horário', ''))
    slots.forEach((m) => select.append(new Option(clock(m), String(m))))
    if (slots.map(String).includes(previous)) select.value = previous
  }
  f.date.addEventListener('change', () => { fillTimes(); clearError(f.date); renderSummary() })
  f.time.addEventListener('change', () => { clearError(f.time); renderSummary() })

  /* ---- Party stepper ---- */

  const stepButtons = form.querySelectorAll('[data-step]')
  function syncStepper() {
    const n = Number(f.party.value) || 0
    stepButtons.forEach((b) => {
      const dir = Number(b.dataset.step)
      b.disabled = (dir < 0 && n <= 1) || (dir > 0 && n >= B.maxParty)
    })
  }
  stepButtons.forEach((b) => b.addEventListener('click', () => {
    f.party.value = Math.min(B.maxParty, Math.max(1, (Number(f.party.value) || 0) + Number(b.dataset.step)))
    clearError(f.party)
    syncStepper()
    renderSummary()
  }))
  f.party.addEventListener('input', () => { syncStepper(); renderSummary() })
  f.phone.addEventListener('blur', () => { if (f.phone.value) f.phone.value = formatPhone(f.phone.value) })

  /* ---- Live summary ---- */

  function renderSummary() {
    sum.date.textContent = f.date.value ? dateLabel(f.date.value) : '·'
    sum.time.textContent = f.date.value && f.time.value ? clock(Number(f.time.value)) : '·'
    const n = Number(f.party.value)
    sum.party.textContent = Number.isInteger(n) && n > 0 ? people(n) : '·'
  }

  /* ---- Validation ---- */

  const errorEl = (field) => root.querySelector(`#${field.id}-error`)
  function setError(field, message) {
    field.setAttribute('aria-invalid', 'true')
    const el = errorEl(field)
    el.textContent = message
    el.hidden = false
  }
  function clearError(field) {
    field.removeAttribute('aria-invalid')
    const el = errorEl(field)
    if (el) { el.hidden = true; el.textContent = '' }
  }
  form.addEventListener('input', (e) => { if (e.target.hasAttribute('aria-invalid')) clearError(e.target) })

  function validate() {
    const errors = []
    if (!f.date.value) errors.push([f.date, 'Escolha o dia da reserva.'])
    else if (f.date.value < f.date.min || f.date.value > f.date.max) errors.push([f.date, `Escolha um dia entre hoje e os próximos ${B.windowDays} dias.`])
    if (!f.time.value) errors.push([f.time, f.time.disabled && f.date.value ? 'Não há horários neste dia. Escolha outro.' : 'Escolha um horário.'])
    const party = Number(f.party.value)
    if (!Number.isInteger(party) || party < 1) errors.push([f.party, 'Informe quantas pessoas vêm.'])
    else if (party > B.maxParty) errors.push([f.party, `Para mais de ${B.maxParty} pessoas, fale direto pelo WhatsApp.`])
    if (f.name.value.trim().length < 2) errors.push([f.name, 'Diga o nome para a reserva.'])
    const digits = f.phone.value.replace(/\D/g, '')
    if (digits.length < 10 || digits.length > 13) errors.push([f.phone, 'Informe um WhatsApp com DDD, por exemplo (11) 900000000.'])
    ;[f.date, f.time, f.party, f.name, f.phone].forEach(clearError)
    errors.forEach(([field, msg]) => setError(field, msg))
    return errors
  }

  /* ---- Submit ---- */

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const errors = validate()
    if (errors.length) {
      errors[0][0].focus()
      return
    }
    const request = {
      id: Date.now(),
      party: Number(f.party.value),
      date: f.date.value,
      time: Number(f.time.value),
      name: f.name.value.trim(),
      phone: formatPhone(f.phone.value),
      note: f.note.value.trim(),
      state: 'sent',
    }
    const list = store.read()
    list.unshift(request)
    store.write(list)
    renderTickets()

    const url = openWhatsapp(buildMessage('new', request))
    q('[data-bk-done-summary]').textContent = `${people(request.party)}, ${dateLabel(request.date)}, às ${clock(request.time)}.`
    q('[data-bk-done-link]').href = url
    form.hidden = true
    done.hidden = false
    done.focus()
  })

  q('[data-bk-done-new]').addEventListener('click', () => {
    form.reset()
    fillTimes()
    syncStepper()
    renderSummary()
    done.hidden = true
    form.hidden = false
    f.date.focus()
  })

  /* ---- Tickets ---- */

  function renderTickets() {
    const list = store.read()
    ticketsList.replaceChildren()
    ticketsEmpty.hidden = list.length > 0
    const todayIso = isoDate(new Date())
    list.forEach((r) => {
      const past = r.date < todayIso
      const cancelled = r.state === 'cancel-requested'
      const li = document.createElement('li')
      li.className = `ticket${cancelled ? ' is-cancelled' : ''}`
      const line = (cls, text) => {
        const p = document.createElement('p')
        p.className = cls
        p.textContent = text
        li.append(p)
      }
      line('ticket-when', `${dateLabel(r.date)} · ${clock(r.time)}`)
      line('ticket-who', `${people(r.party)} · ${r.name}`)
      line('ticket-state', cancelled ? 'Cancelamento pedido' : past ? 'Data passada' : 'Pedido enviado · aguarde a confirmação')
      const actions = document.createElement('div')
      actions.className = 'ticket-actions'
      const button = (label, action) => {
        const b = document.createElement('button')
        b.type = 'button'
        b.textContent = label
        b.dataset.action = action
        b.dataset.id = String(r.id)
        actions.append(b)
      }
      if (!cancelled && !past) {
        button('Pedir alteração', 'change')
        button('Pedir cancelamento', 'cancel')
      } else {
        button('Remover da lista', 'remove')
      }
      li.append(actions)
      ticketsList.append(li)
    })
  }

  ticketsList.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-action]')
    if (!b) return
    const list = store.read()
    const r = list.find((x) => String(x.id) === b.dataset.id)
    if (!r) return
    if (b.dataset.action === 'change') {
      openWhatsapp(buildMessage('change', r))
      return
    }
    if (b.dataset.action === 'cancel') {
      openWhatsapp(buildMessage('cancel', r))
      r.state = 'cancel-requested'
      store.write(list)
    } else {
      store.write(list.filter((x) => x !== r))
    }
    renderTickets()
    const next = ticketsList.querySelector('button')
    if (next) next.focus()
    else q('#tickets-t').focus()
  })

  syncStepper()
  renderSummary()
  renderTickets()
}
