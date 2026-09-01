// Fails on anything the browser complains about: hydration mismatches, page
// errors, sideways scroll. Screens at the four sizes people actually use.
import { chromium } from 'playwright-core'

const [out, base] = process.argv.slice(2)
const SIZES = [['mobile', 390, 844], ['tablet', 834, 1112], ['laptop', 1440, 900], ['desktop', 1920, 1080]]
const PAGES = [['/', 'ask'], ['/research', 'research']]

const browser = await chromium.launch({ channel: 'chrome' })
const problems = []

for (const [path, label] of PAGES) {
  for (const [size, width, height] of SIZES) {
    const page = await browser.newPage({ viewport: { width, height } })
    const where = `${label}-${size}`
    page.on('pageerror', (e) => problems.push(`${where}: ${e.message}`))
    page.on('console', (m) => {
      const t = m.text()
      if (/hydrat|cannot be a descendant|Warning:/i.test(t)) problems.push(`${where}: ${t.slice(0, 150)}`)
      if (m.type() === 'error' && !/api\.hanzo\.ai|ERR_FAILED|Failed to load resource/.test(t)) {
        problems.push(`${where}: ${t.slice(0, 150)}`)
      }
    })
    await page.goto(base + path, { waitUntil: 'networkidle' })
    await page.addStyleTag({ content: 'nextjs-portal{display:none!important}' })
    await page.waitForTimeout(900)
    await page.screenshot({ path: `${out}/${where}.png`, fullPage: true })
    const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    if (over > 1) problems.push(`${where}: scrolls ${over}px sideways`)
    await page.close()
  }
}

await browser.close()
console.log(problems.length ? 'PROBLEMS:\n' + [...new Set(problems)].join('\n') : 'clean: no hydration errors, no page errors, no sideways scroll')
