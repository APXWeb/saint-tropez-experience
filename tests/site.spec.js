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

test('vitrine: um balcão numa tela, prateleiras trocam e cada uma leva ao cardápio', async ({ page, isMobile }) => {
  const vit = page.locator('#vitrine')
  await vit.scrollIntoViewIfNeeded()
  const [h, vh] = await page.evaluate(() => [document.getElementById('vitrine').offsetHeight, window.innerHeight])
  expect(h).toBeLessThan(vh * (isMobile ? 1.8 : 1.15))
  const plaques = page.getByRole('tab')
  await expect(plaques).toHaveCount(5)
  await expect(plaques.first()).toHaveAttribute('aria-selected', 'true')
  await expect(page.locator('#bolos-e-doces')).toBeVisible()
  await expect(page.locator('#salgados')).toBeHidden()
  await page.getByRole('tab', { name: /Salgados/ }).click()
  await expect(page.getByRole('tab', { name: /Salgados/ })).toHaveAttribute('aria-selected', 'true')
  await expect(page.locator('#salgados')).toBeVisible()
  await expect(page.locator('#bolos-e-doces')).toBeHidden()
  await expect(page.locator('#salgados .piece')).toHaveCount(5)
  await expect(page.locator('#salgados .case-menu')).toHaveAttribute('href', 'cardapio.html#sanduiches')
})

test('vitrine: teclado nas plaquinhas e todas as fotos na galeria', async ({ page }) => {
  const first = page.getByRole('tab').first()
  await first.focus()
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('ArrowRight')
  const salgados = page.getByRole('tab', { name: /Salgados/ })
  await expect(salgados).toBeFocused()
  await expect(salgados).toHaveAttribute('aria-selected', 'true')
  const more = page.locator('#salgados .case-more')
  await expect(more).toHaveText(/Ver as 10 fotos/)
  await more.click()
  const dialog = page.locator('[data-lightbox]')
  await expect(dialog).toBeVisible()
  await expect(dialog.locator('[data-lb-count]')).toHaveText('18 de 41')
  for (let i = 0; i < 9; i++) await dialog.getByRole('button', { name: 'Próxima foto' }).click()
  await expect(dialog.locator('[data-lb-count]')).toHaveText('27 de 41')
  await expect(dialog.locator('[data-lb-cat]')).toHaveText('Salgados')
  await page.keyboard.press('Escape')
  await expect(more).toBeFocused()
})

test('vitrine: foto do balcão abre a galeria no lugar certo', async ({ page }) => {
  await page.getByRole('tab', { name: /Salgados/ }).click()
  const first = page.locator('#salgados .piece-open').first()
  await first.scrollIntoViewIfNeeded()
  await first.click()
  const dialog = page.locator('[data-lightbox]')
  await expect(dialog).toBeVisible()
  await expect(dialog.locator('[data-lb-title]')).toHaveText('Salgado assado com tomate')
  await expect(dialog.locator('[data-lb-count]')).toHaveText('18 de 41')
  await expect.poll(() => dialog.locator('.lb-frame img').evaluate((i) => i.complete && i.naturalWidth > 0)).toBe(true)
  await page.keyboard.press('ArrowLeft')
  await expect(dialog.locator('[data-lb-cat]')).toHaveText('Pães e folhados')
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(first).toBeFocused()
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

test('cardápio: o índice da home leva à categoria na página do cardápio', async ({ page }) => {
  const index = page.locator('#cardapio .menu-index-list a')
  await expect(index).toHaveCount(13)
  await index.filter({ hasText: 'Canoas' }).click()
  await expect(page).toHaveURL(/cardapio\.html#canoas$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('O cardápio.')
  await expect.poll(() => page.evaluate(() => {
    const r = document.getElementById('canoas').getBoundingClientRect()
    return r.top >= 0 && r.top < window.innerHeight * 0.5
  }), { timeout: 8000 }).toBe(true)
  await expect(page.locator('#canoas .carta-item').first()).toContainText('Canoa Cottage')
  await expect(page.locator('#canoas .carta-item').first()).toContainText('R$ 20,90')
})

test('cardápio: busca sem acento, por número, e estado vazio', async ({ page }) => {
  await page.goto('./cardapio.html')
  await expect(page.locator('[data-item]')).toHaveCount(108)
  await expect(page.locator('[data-search-clear]')).toBeHidden()
  const search = page.locator('[data-search]')
  await search.fill('gateau')
  await expect(page.locator('[data-search-status]')).toHaveText('1 item encontrado')
  await expect(page.locator('[data-item]:visible')).toHaveText(/Petit Gâteau/)
  await expect(page.locator('#cafes')).toBeHidden()
  await search.fill('acai')
  await expect(page.locator('[data-search-status]')).toHaveText('3 itens encontrados')
  await search.fill('92')
  await expect(page.locator('[data-item]:visible').first()).toContainText('Misto Quente')
  await search.fill('xyzw')
  await expect(page.locator('[data-search-empty]')).toBeVisible()
  await page.locator('[data-search-reset]').click()
  await expect(search).toHaveValue('')
  await expect(page.locator('[data-item]:visible')).toHaveCount(108)
})

test('cardápio: categorias acompanham a leitura e não há rolagem horizontal', async ({ page, isMobile }) => {
  await page.goto('./cardapio.html')
  const [scrollW, viewW] = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth])
  expect(scrollW).toBeLessThanOrEqual(viewW)
  await page.locator('[data-cat-nav] a[href="#sobremesas"]').click()
  await expect(page.locator('[data-cat-nav] a[href="#sobremesas"]')).toHaveAttribute('aria-current', 'true', { timeout: 8000 })
  await expect(page).toHaveURL(/#sobremesas$/)
  if (isMobile) await expect(page.locator('[data-cat-nav]')).toBeInViewport()
})

test('destaques: cada atalho leva ao destino certo, sem sair para o Instagram', async ({ page }) => {
  const hl = page.locator('.highlights a')
  await expect(hl).toHaveCount(6)
  const hrefs = await hl.evaluateAll((as) => as.map((a) => [a.textContent.trim(), a.getAttribute('href'), a.target]))
  expect(hrefs).toEqual([
    ['Clientes', '#salao', ''],
    ['Adega', '#cafes-e-adega', ''],
    ['Bolos e doces', '#bolos-e-doces', ''],
    ['Cafés', 'cardapio.html#cafes', ''],
    ['Ilha de frios', '#cafes-e-adega', ''],
    ['Localização', '#visite', ''],
  ])
  const inView = (sel) => page.evaluate((s) => {
    const r = document.querySelector(s).getBoundingClientRect()
    return r.top < window.innerHeight * 0.7 && r.bottom > 0
  }, sel)

  await hl.filter({ hasText: 'Adega' }).click()
  await expect(page).toHaveURL(/#cafes-e-adega$/)
  await expect(page.locator('#cafes-e-adega')).toBeVisible()
  await expect(page.getByRole('tab', { name: /Cafés e adega/ })).toHaveAttribute('aria-selected', 'true')
  await expect.poll(() => inView('#vitrine'), { timeout: 8000 }).toBe(true)

  await page.locator('#instagram').scrollIntoViewIfNeeded()
  await hl.filter({ hasText: 'Bolos e doces' }).click()
  await expect(page).toHaveURL(/#bolos-e-doces$/)
  await expect(page.locator('#bolos-e-doces')).toBeVisible()
  await expect(page.locator('#cafes-e-adega')).toBeHidden()
  await expect.poll(() => inView('#vitrine'), { timeout: 8000 }).toBe(true)

  await page.locator('#instagram').scrollIntoViewIfNeeded()
  await hl.filter({ hasText: 'Clientes' }).click()
  await expect(page).toHaveURL(/#salao$/)
  await expect.poll(() => inView('#salao'), { timeout: 8000 }).toBe(true)

  await page.locator('#instagram').scrollIntoViewIfNeeded()
  await hl.filter({ hasText: 'Localização' }).click()
  await expect(page).toHaveURL(/#visite$/)
  await expect.poll(() => inView('#visite'), { timeout: 8000 }).toBe(true)

  await page.locator('#instagram').scrollIntoViewIfNeeded()
  await hl.filter({ hasText: 'Cafés' }).click()
  await expect(page).toHaveURL(/cardapio\.html#cafes$/)
  await expect(page.locator('#cafes')).toBeInViewport()
})

test('atalho de prateleira aberto direto pela URL abre a prateleira certa', async ({ page }) => {
  await page.goto('./#cafes-e-adega')
  await expect(page.locator('#cafes-e-adega')).toBeVisible()
  await expect(page.getByRole('tab', { name: /Cafés e adega/ })).toHaveAttribute('aria-selected', 'true')
  await expect.poll(() => page.evaluate(() => {
    const r = document.getElementById('vitrine').getBoundingClientRect()
    return r.top < window.innerHeight * 0.7 && r.bottom > 0
  }), { timeout: 8000 }).toBe(true)
})

test('sem repetição: horário ao vivo só na abertura, avisos num lugar, fotos todas diferentes', async ({ page }) => {
  await expect(page.locator('[data-status]')).toHaveCount(1)
  await expect(page.locator('.hero [data-status]')).toHaveCount(1)
  await expect(page.locator('#visite tr[data-day]')).toHaveCount(7)
  await expect(page.locator('#visite .hours-note')).toBeVisible()
  await expect(page.locator('.rules-list li')).toHaveCount(3)
  await expect(page.locator('#visite')).not.toContainText('Não fazemos reservas')
  const names = await page.locator('main img').evaluateAll((imgs) => imgs.map((i) => (i.currentSrc || i.src).match(/img\/(.+?)-\d+\.(?:webp|avif)/)?.[1]).filter(Boolean))
  const dup = names.filter((n, i) => names.indexOf(n) !== i)
  expect(dup, 'fotos repetidas na página').toEqual([])
  await page.goto('./cardapio.html')
  await expect(page.locator('[data-status]')).toHaveCount(0)
  await expect(page.locator('.carta-close a[href="./#casa"]')).toBeVisible()
})

test('instagram: a fachada de dia e à noite se compara com o deslizador, também pelo teclado', async ({ page }) => {
  const duo = page.locator('[data-duo]')
  await duo.scrollIntoViewIfNeeded()
  await expect(duo.locator('img')).toHaveCount(2)
  const range = duo.locator('.duo-range')
  await expect(range).toHaveAttribute('aria-label', /dia e à noite/)
  await expect.poll(() => duo.evaluate((el) => el.style.getPropertyValue('--split') || getComputedStyle(el).getPropertyValue('--split').trim())).toMatch(/50/)
  await range.focus()
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('ArrowRight')
  await expect(range).toHaveValue('52')
  await expect(duo).toHaveAttribute('style', /--split: 52%/)
  await expect(duo.locator('a', { hasText: 'Ver mais fotos no Instagram' })).toHaveAttribute('href', IG)
})
