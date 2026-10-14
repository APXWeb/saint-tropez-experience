// Viewport captures at scroll stops, desktop and mobile, plus console errors and failed requests.
// Usage: node tools/shots.mjs <outDir> [url]
import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'

const out = process.argv[2] || 'shots'
const url = process.argv[3] || 'http://localhost:4176/'
mkdirSync(out, { recursive: true })

const browser = await chromium.launch({ headless: true, args: ['--use-angle=d3d11'] })
const runs = [
  { name: 'desktop', viewport: { width: 1440, height: 900 }, dpr: 1 },
  { name: 'mobile', viewport: { width: 390, height: 844 }, dpr: 2, mobile: true },
]
for (const r of runs) {
  const ctx = await browser.newContext({ viewport: r.viewport, deviceScaleFactor: r.dpr, isMobile: !!r.mobile, hasTouch: !!r.mobile, locale: 'pt-BR' })
  const page = await ctx.newPage()
  const problems = []
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') problems.push(`console.${m.type()}: ${m.text()}`) })
  page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`))
  page.on('response', (res) => { if (res.status() >= 400) problems.push(`${res.status()} ${res.url()}`) })
  page.on('requestfailed', (req) => problems.push(`failed ${req.url()} ${req.failure()?.errorText}`))
  await page.goto(url, { waitUntil: 'load', timeout: 60000 })
  await page.waitForTimeout(2800)
  await page.screenshot({ path: `${out}/${r.name}-00-hero.png` })
  const total = await page.evaluate(() => document.documentElement.scrollHeight)
  const H = r.viewport.height
  const stops = []
  for (let y = H * 0.9, i = 1; y < total; y += H * 0.9, i++) stops.push([i, Math.round(y)])
  for (const [i, y] of stops) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y)
    await page.waitForTimeout(900)
    await page.screenshot({ path: `${out}/${r.name}-${String(i).padStart(2, '0')}.png` })
  }
  console.log(r.name, 'height', total, 'stops', stops.length)
  console.log(problems.length ? problems.join('\n') : 'no console errors / failed requests')
  await ctx.close()
}
await browser.close()
