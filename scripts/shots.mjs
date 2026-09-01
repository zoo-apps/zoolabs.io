// Drives the running dev server: every page at every breakpoint, plus the one
// behaviour that matters — an unreachable model must surface, never be answered
// around.
import { chromium } from 'playwright-core'

const [out, base] = process.argv.slice(2)
const SIZES = [
  ['mobile', 390, 844],
  ['tablet', 834, 1112],
  ['laptop', 1440, 900],
  ['desktop', 1920, 1080],
]
const PAGES = [['/', 'ask'], ['/research', 'research']]

const browser = await chromium.launch({ channel: 'chrome' })
const problems = []

async function open(path, name, width, height) {
  const page = await browser.newPage({ viewport: { width, height } })
  page.on('pageerror', (e) => problems.push(`${name}: ${e.message}`))
  page.on('console', (m) => {
    const t = m.text()
    if (m.type() === 'error' && !t.includes('api.hanzo.ai') && !t.includes('ERR_FAILED')) {
      problems.push(`${name}: ${t}`)
    }
  })
  await page.goto(base + path, { waitUntil: 'networkidle' })
  // The dev overlay is a fixed portal; it sits over the page and eats clicks.
  await page.addStyleTag({ content: 'nextjs-portal{display:none!important}' })
  await page.waitForTimeout(900)
  return page
}

for (const [path, label] of PAGES) {
  for (const [size, w, h] of SIZES) {
    const page = await open(path, `${label}-${size}`, w, h)
    await page.screenshot({ path: `${out}/${label}-${size}.png`, fullPage: true })
    // Nothing may scroll the page sideways.
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    )
    if (overflow > 0) problems.push(`${label}-${size}: page scrolls ${overflow}px sideways`)
    await page.close()
  }
}

// Ask a question and watch what comes back.
const page = await open('/', 'ask-flow', 1280, 900)
await page.fill('#question', 'Why are beluga calves born grey?')
await page.click('form button')
await page.waitForSelector('div[role=alert], article', { timeout: 45000 })
await page.waitForTimeout(1200)
await page.screenshot({ path: `${out}/ask-answered.png`, fullPage: true })

const alert = page.locator('div[role=alert]')
if (await alert.count()) {
  console.log('model refused →', (await alert.innerText()).replace(/\s+/g, ' ').slice(0, 140))
} else {
  console.log('model answered →', (await page.locator('article').last().innerText()).replace(/\s+/g, ' ').slice(0, 140))
  console.log('feeling shown →', await page.locator('figcaption').innerText())
}
await page.close()

// Research search actually narrows.
const r = await open('/research', 'research-flow', 1280, 900)
const all = await r.locator('h2').count()
await r.fill('#find', 'beluga')
await r.waitForTimeout(400)
console.log(`research: ${all} papers → "beluga" narrows to ${await r.locator('h2').count()}`)
await r.close()

await browser.close()
console.log(problems.length ? 'PROBLEMS:\n' + problems.join('\n') : 'no console errors, no sideways scroll')
