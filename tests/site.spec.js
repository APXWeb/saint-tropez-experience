import { test, expect } from '@playwright/test'

const MAPS = 'https://maps.google.com/?cid=42194893093639372'
const IG = 'https://www.instagram.com/sainttropezconfeitaria/'

test.beforeEach(async ({ page }) => {
  const problems = []
  page.on('pageerror', (e) => problems.push(e.message))
  page.on('console', (m) => m.type() === 'error' && problems.push(m.text()))
  page.on('response', (r) => r.status() >= 400 && problems.push(`${r.status()} ${r.url()}`))
  page.problems = problems
  await page.goto('./')
})

test.afterEach(async ({ page }) => {
  expect(page.problems, 'console errors or failed requests').toEqual([])
})

test('abre com título, fatos verificados e ação principal', async ({ page }) => {
  await expect(page).toHaveTitle(/Saint Tropez Confeitaria/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Um novo conceito em confeitaria/)
  await expect(page.locator('.hero-address')).toContainText('R. Piracema, 221')
  const cta = page.locator('.hero-actions a.btn--canopy')
  await expect(cta).toBeVisible()
  await expect(cta).toBeInViewport()
  await expect(cta).toHaveAttribute('href', MAPS)
  await expect(cta).toHaveAttribute('target', '_blank')
  await expect(page.locator('.hero [data-status-text]')).toHaveText(/^(Aberto|Fechado)/)
})

test('sem rolagem horizontal e com o cabeçalho inteiro na tela', async ({ page, isMobile }) => {
  const [scrollW, viewW] = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth])
  expect(scrollW).toBeLessThanOrEqual(viewW)
  await expect(page.locator(isMobile ? '[data-menu-open]' : '.nav a[href="#visite"]')).toBeInViewport({ ratio: 1 })
})

test('todas as imagens carregam', async ({ page }) => {
  const imgs = page.locator('main img, footer img')
  const n = await imgs.count()
  expect(n).toBeGreaterThan(30)
  for (let i = 0; i < n; i++) {
    const img = imgs.nth(i)
    await img.evaluate((el) => { el.loading = 'eager' })
  }
  for (let i = 0; i < n; i++) {
    const img = imgs.nth(i)
    await expect.poll(() => img.evaluate((el) => el.complete && el.naturalWidth > 0), { timeout: 15_000 }).toBe(true)
  }
})

test('links externos apontam para os destinos oficiais', async ({ page }) => {
  const hrefs = await page.locator('a[href^="http"]').evaluateAll((as) => as.map((a) => [a.href, a.target, a.rel]))
  for (const [href, target, rel] of hrefs) {
    expect(target).toBe('_blank')
    expect(rel).toContain('noopener')
    const allowed =
      [MAPS, IG].includes(href) ||
      href.startsWith('https://www.google.com/maps/dir/?api=1&destination=Saint+Tropez+Confeitaria') ||
      href.startsWith('https://waze.com/ul?ll=-23.4911958') ||
      href === 'https://apxweb.github.io/apex-web/'
    expect(allowed, href).toBe(true)
  }
  expect(hrefs.filter(([h]) => h === IG).length).toBeGreaterThan(3)
})

test('âncoras internas existem', async ({ page }) => {
  const ids = await page.locator('a[href^="#"]').evaluateAll((as) => as.map((a) => a.getAttribute('href').slice(1)))
  for (const id of ids) expect(await page.locator(`[id="${id}"]`).count(), id).toBe(1)
})

test('navegação leva a cada seção', async ({ page, isMobile }) => {
  const sections = [['Vitrine', 'vitrine'], ['O salão', 'salao'], ['A casa', 'casa'], ['Instagram', 'instagram'], ['Visite', 'visite']]
  for (const [label, id] of sections) {
    if (isMobile) {
      await page.locator('[data-menu-open]').click()
      await page.locator('[data-menu]').getByRole('link', { name: label, exact: true }).click()
    } else {
      await page.locator('.nav').getByRole('link', { name: label, exact: true }).click()
    }
    await expect
      .poll(
        () =>
          page.evaluate((i) => {
            const r = document.getElementById(i).getBoundingClientRect()
            return r.top < window.innerHeight * 0.6 && r.bottom > 0
          }, id),
        { timeout: 8000 },
      )
      .toBe(true)
    await expect(page).toHaveURL(new RegExp(`#${id}$`))
  }
})

test('menu móvel abre, prende o foco e fecha com Esc', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'só no celular')
  const btn = page.locator('[data-menu-open]')
  await btn.click()
  await expect(btn).toHaveAttribute('aria-expanded', 'true')
  await expect(page.locator('[data-menu]')).toBeVisible()
  await expect(page.locator('[data-menu] a').first()).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(page.locator('[data-menu]')).toBeHidden()
  await expect(btn).toBeFocused()
  await expect(btn).toHaveAttribute('aria-expanded', 'false')
})

test('vitrine: categorias, lightbox, navegação entre fotos e teclado', async ({ page }) => {
  await page.locator('.shelf-tab', { hasText: 'Salgados' }).click()
  await expect
    .poll(
      () =>
        page.locator('#salgados').evaluate((el) => {
          const r = el.getBoundingClientRect()
          return r.left < window.innerWidth * 0.5 && r.right > 0 && r.top < window.innerHeight && r.bottom > 0
        }),
      { timeout: 8000 },
    )
    .toBe(true)

  const first = page.locator('#salgados .piece-open').first()
  await first.click()
  const dialog = page.locator('[data-lightbox]')
  await expect(dialog).toBeVisible()
  await expect(dialog.locator('[data-lb-title]')).toHaveText('Salgado assado com tomate')
  await expect(dialog.locator('[data-lb-count]')).toHaveText('17 de 36')
  await expect.poll(() => dialog.locator('.lb-frame img').evaluate((i) => i.complete && i.naturalWidth > 0)).toBe(true)
  await dialog.getByRole('button', { name: 'Próxima foto' }).click()
  await expect(dialog.locator('[data-lb-count]')).toHaveText('18 de 36')
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('ArrowLeft')
  await expect(dialog.locator('[data-lb-count]')).toHaveText('16 de 36')
  await expect(dialog.locator('[data-lb-cat]')).toHaveText('Pães e folhados')
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(first).toBeFocused()
})

test('reserva (prévia): aviso, validação, mensagem do WhatsApp e pedidos salvos', async ({ page }) => {
  // Capture the WhatsApp window instead of opening it.
  await page.evaluate(() => { window.__opened = []; window.open = (u) => { window.__opened.push(u); return null } })
  const r = page.locator('#reserva')
  await r.scrollIntoViewIfNeeded()
  await expect(r.locator('.reserva-demo')).toContainText('Hoje a casa não faz reservas')

  await r.getByRole('button', { name: /Enviar pedido/ }).click()
  await expect(r.locator('#bk-date-error')).toBeVisible()
  await expect(r.locator('#bk-date')).toBeFocused()

  const d = new Date()
  d.setDate(d.getDate() + 3)
  const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  await r.locator('#bk-date').fill(iso)
  await r.locator('#bk-time').selectOption({ label: '09h30' })
  await r.getByRole('button', { name: 'Mais uma pessoa' }).click()
  await r.locator('#bk-name').fill('Teste Silva')
  await r.locator('#bk-phone').fill('11987654321')
  await expect(r.locator('[data-sum="party"]')).toHaveText('3 pessoas')
  await r.getByRole('button', { name: /Enviar pedido/ }).click()

  await expect(r.locator('[data-bk-done]')).toBeVisible()
  const url = await page.evaluate(() => window.__opened[0])
  expect(url.startsWith('https://wa.me/5511944815707?text=')).toBe(true)
  const text = decodeURIComponent(url.split('text=')[1])
  expect(text).toContain('Saint Tropez Confeitaria')
  expect(text).toContain('Nome: Teste Silva')
  expect(text).toContain('Horário: 09h30')
  expect(text).toContain('Pessoas: 3')
  await expect(r.locator('.ticket')).toHaveCount(1)
  await r.getByRole('button', { name: 'Pedir cancelamento' }).click()
  await expect(r.locator('.ticket-state')).toHaveText('Cancelamento pedido')
})

test('localização: endereço, horário de hoje e mapa sob demanda', async ({ page }) => {
  const v = page.locator('#visite')
  await v.scrollIntoViewIfNeeded()
  await expect(v.getByRole('heading', { level: 2 })).toHaveText('R. Piracema, 221')
  await expect(v).toContainText('02460-040')
  await expect(v.locator('tr[data-today="true"]')).toHaveCount(1)
  await expect(v.locator('a', { hasText: 'Abrir no Google Maps' })).toHaveAttribute('href', MAPS)
  await expect(v.locator('iframe')).toHaveCount(0)
  await v.getByRole('button', { name: 'Mostrar o mapa aqui' }).click()
  await expect(v.locator('iframe')).toHaveAttribute('src', /google\.com\/maps.*Piracema/)
})

test('teclado: pular para o conteúdo e foco visível', async ({ page, isMobile }) => {
  test.skip(isMobile, 'teclado físico só no desktop')
  await page.waitForLoadState('load')
  await page.waitForTimeout(500)
  await page.keyboard.press('Tab')
  const skip = page.getByRole('link', { name: 'Pular para o conteúdo' })
  await expect(skip).toBeFocused()
  for (let i = 0; i < 30; i++) {
    await page.keyboard.press('Tab')
    const read = () =>
      page.evaluate(() => {
        const el = document.activeElement
        const r = el.getBoundingClientRect()
        return { tag: el.tagName, outline: getComputedStyle(el).outlineStyle, visible: r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth }
      })
    const info = await read()
    expect(info.outline, JSON.stringify(info)).not.toBe('none')
    await expect.poll(async () => (await read()).visible, { timeout: 1500 }).toBe(true)
  }
})

test('movimento reduzido: conteúdo visível sem animações de entrada', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1280, height: 800 } })
  const page = await ctx.newPage()
  await page.goto('http://localhost:4177/')
  await expect(page.locator('.hero-title .ln > span').first()).toBeInViewport()
  await expect(page.locator('.hero-actions')).toHaveCSS('opacity', '1')
  await page.locator('#salao').scrollIntoViewIfNeeded()
  await expect(page.locator('[data-salao-copy]')).toHaveCSS('opacity', '1')
  await ctx.close()
})
