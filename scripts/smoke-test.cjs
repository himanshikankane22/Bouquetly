/* End-to-end smoke test of the full sender → envelope → reveal flow. */
const { chromium } = require('playwright-core')

const BASE = 'http://localhost:4173'
let failures = 0

function check(name, ok, extra = '') {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? ` — ${extra}` : ''}`)
  if (!ok) failures++
}

async function main() {
  const browser = await chromium.launch()

  /* ---------- SENDER: home → create → preview → link ---------- */
  const sender = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  const page = await sender.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push('console: ' + m.text())
  })

  await page.goto(BASE + '/')
  check('home hero heading', await page.locator('h1').first().textContent() === 'A Little Something For You.')
  await page.getByRole('link', { name: 'Create a Bouquet' }).click()
  await page.waitForURL('**/create')
  check('arrived at /create', page.url().endsWith('/create'))

  // step 0: pick flowers (draft is prefilled with 3 roses)
  check('draft comes with roses', await page.locator('[role="button"][aria-label^="Rose"]').getAttribute('aria-pressed') === 'true')
  check('next is enabled with prefilled roses', !(await page.getByRole('button', { name: 'Next' }).isDisabled()))
  await page.locator('[role="button"][aria-label^="Rose"]').click()
  await page.locator('[role="button"][aria-label^="Tulip"]').click()
  await page.locator('[role="button"][aria-label^="Daisy"]').click()
  await page.getByRole('button', { name: 'Next' }).click()
  await page.waitForTimeout(350)

  // step 1: customize (defaults fine)
  await page.getByRole('button', { name: 'Next' }).click()
  await page.waitForTimeout(350)

  // step 2: message
  await page.getByLabel('To:').fill('Maya')
  await page.getByLabel(/Your message/).fill('Just wanted to remind you that you are someone very special.')
  await page.getByLabel('From:').fill('Noah')
  check('photo toggle default on', await page.locator('[role="switch"]').getAttribute('aria-checked') === 'true')
  await page.getByRole('button', { name: 'Next' }).click()
  await page.waitForTimeout(350)

  // step 3 → preview
  await page.getByRole('link', { name: 'Open the surprise preview' }).click()
  await page.waitForURL('**/preview')
  check('preview shows closed envelope', await page.getByRole('button', { name: 'Open the envelope' }).isVisible())
  check('surprise text visible first', (await page.getByText("You've got a little something").count()) > 0)
  check('card NOT visible before opening', (await page.getByText('Made just for you').count()) === 0)

  await page.getByRole('button', { name: 'Open the envelope' }).click({ force: true })
  await page.waitForTimeout(900)
  check('envelope flap open (button disabled during reveal)', await page.getByRole('button', { name: 'Open the envelope' }).isDisabled())
  await page.waitForTimeout(5200)
  check('letter card revealed', await page.getByText('Made just for you ♡').isVisible())
  check('to-line shown', await page.getByText('To: Maya').isVisible())
  check('message shown', await page.getByText('Just wanted to remind you that you are someone very special.').isVisible())
  check('from-line shown', await page.getByText('— Noah').isVisible())
  check('photo visible in card', await page.getByRole('img', { name: /keepsake photograph/i }).isVisible())
  const imgVisible = await page.getByRole('img', { name: /keepsake photograph/i }).evaluate((el) => {
    const r = el.getBoundingClientRect()
    return r.width > 0 && r.height > 0 && getComputedStyle(el).opacity !== '0'
  })
  check('photo has real dimensions', imgVisible)
  check('generate CTA visible', await page.getByRole('button', { name: /Generate My Surprise/ }).isVisible())

  await page.getByRole('button', { name: /Generate My Surprise/ }).click()
  await page.waitForTimeout(600)
  check('ready screen', (await page.getByText('Your little surprise is ready ✨').count()) > 0)
  const shareUrl = await page.evaluate(() => {
    const els = Array.from(document.querySelectorAll('span'))
    const el = els.find((n) => /^https?:\/\/[^\s]+$/.test((n.textContent || '').trim()))
    return el ? el.textContent.trim() : null
  })
  if (!shareUrl || !shareUrl.startsWith('http')) {
    check('share URL captured', false, String(shareUrl))
  } else {
    check('share URL captured', true, shareUrl.slice(0, 60) + '…')

    /* ---------- RECIPIENT in a completely fresh session ---------- */
    const fresh = await browser.newContext({ viewport: { width: 390, height: 844 } })
    const rp = await fresh.newPage()
    await rp.goto(shareUrl)
    await rp.waitForTimeout(600)
    check('recipient: closed envelope first', await rp.getByRole('button', { name: 'Open the envelope' }).isVisible())
    check('recipient: no card yet', (await rp.getByText('Made just for you').count()) === 0)
    const preImgs = await rp.locator('img[alt*="keepsake photograph"]').count()
    check('recipient: image not in DOM before opening', preImgs === 0)
    const noHScroll = await rp.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)
    check('mobile: no horizontal overflow', noHScroll)

    await rp.getByRole('button', { name: 'Open the envelope' }).click({ force: true })
    await rp.waitForTimeout(4600)
    check('recipient: revealed card on mobile', await rp.getByText('Made just for you ♡').isVisible())
    check('recipient: correct names', (await rp.getByText('To: Maya').count()) > 0 && (await rp.getByText('— Noah').count()) > 0)
    const postOpacity = await rp.getByRole('img', { name: /keepsake photograph/i }).evaluate((el) => getComputedStyle(el).opacity)
    check('recipient: image visible after reveal', postOpacity !== '0', `opacity=${postOpacity}`)
    const noScroll2 = await rp.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)
    check('mobile: no horizontal overflow after reveal', noScroll2)
    await rp.close()
    await fresh.close()
  }

  /* ---------- invalid id ---------- */
  const bad = await browser.newPage()
  await bad.goto(BASE + '/surprise/not-a-real-id')
  await bad.waitForTimeout(500)
  check('invalid id fallback', (await bad.getByText(/wandered away/).count()) > 0)
  check('fallback has create CTA', await bad.getByRole('link', { name: 'Create Your Own' }).isVisible())
  await bad.close()

  /* ---------- reduced motion ---------- */
  const rm = await browser.newContext({ viewport: { width: 800, height: 900 }, reducedMotion: 'reduce' })
  const rmp = await rm.newPage()
  await rmp.goto(shareUrl || BASE + '/create')
  await rmp.waitForTimeout(800)
  if (shareUrl) {
    check('reduced motion: skips envelope, shows card directly', (await rmp.getByText('Made just for you ♡').count()) > 0)
  }
  await rmp.close()
  await rm.close()

  /* ---------- mobile flower picker sanity ---------- */
  const mob = await browser.newContext({ viewport: { width: 375, height: 700 } })
  const mp = await mob.newPage()
  await mp.goto(BASE + '/create')
  await mp.waitForTimeout(600)
  const overflow = await mp.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)
  check('mobile create: no horizontal overflow', overflow)
  await mp.close()
  await mob.close()

  if (errors.length) {
    console.log('\nJS ERRORS DURING SESSION:')
    errors.forEach((e) => console.log('  ' + e))
    failures++
  }

  await sender.close()
  await browser.close()
  console.log(`\n${failures === 0 ? 'ALL CHECKS PASSED ✅' : failures + ' CHECK(S) FAILED ❌'}`)
  process.exit(failures === 0 ? 0 : 1)
}

main().catch((e) => {
  console.error('Test crashed:', e)
  process.exit(1)
})