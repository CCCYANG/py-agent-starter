import { expect, test } from '@playwright/test'
import enUS from '../../packages/frontend/src/locales/en-US.json' with { type: 'json' }
import zhCN from '../../packages/frontend/src/locales/zh-CN.json' with { type: 'json' }

test.use({ colorScheme: 'light' })

test('translation catalogs cover the same messages', () => {
  expect(Object.keys(enUS).sort()).toEqual(Object.keys(zhCN).sort())
})

test('switches languages and themes, persisting both after reload', async ({ page }) => {
  await page.goto('/')
  const html = page.locator('html')
  await expect(html).toHaveAttribute('lang', 'zh-CN')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('让每一次学习')
  await expect(page.getByRole('switch', { name: '深色模式' })).not.toBeChecked()
  const lightBackground = await page.locator('body').evaluate(el => getComputedStyle(el).backgroundColor)

  await page.getByRole('radio', { name: 'English' }).click()
  await expect(html).toHaveAttribute('lang', 'en-US')
  await expect(page).toHaveTitle('Learning workspace · Python Agent Starter')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Make every lesson')
  await page.getByRole('switch', { name: 'Dark mode' }).click()
  await expect(html).toHaveClass('dark')
  await expect(page.locator('body')).not.toHaveCSS('background-color', lightBackground)

  await page.reload()
  await expect(page.getByRole('radio', { name: 'English' })).toBeChecked()
  await expect(page.getByRole('switch', { name: 'Dark mode' })).toBeChecked()
  await expect(html).toHaveClass('dark')

  await page.getByRole('radio', { name: '中文' }).click()
  await page.getByRole('switch', { name: '深色模式' }).click()
  await expect(html).not.toHaveClass('dark')
  await expect(page.locator('body')).toHaveCSS('background-color', lightBackground)
  await page.reload()
  await expect(html).toHaveAttribute('lang', 'zh-CN')
  await expect(page.getByRole('switch', { name: '深色模式' })).not.toBeChecked()
})

test('uses system dark appearance on first visit', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/')
  await expect(page.locator('html')).toHaveClass('dark')
  await expect(page.getByRole('switch', { name: '深色模式' })).toBeChecked()
})

test('supports keyboard controls through the core-ui Reka exports', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('radio', { name: '中文' }).focus()
  await page.keyboard.down('ArrowRight')
  await expect(page.getByRole('radio', { name: 'English' })).toBeChecked()
  await page.keyboard.up('ArrowRight')
  await page.getByRole('switch', { name: 'Dark mode' }).focus()
  await page.keyboard.press('Space')
  await expect(page.locator('html')).toHaveClass('dark')
})

test('reports unavailable storage while keeping controls usable', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() { throw new DOMException('Blocked', 'SecurityError') },
    })
  })
  await page.goto('/')
  await expect(page.getByRole('alert')).toContainText('无法读取或保存显示偏好')
  await page.getByRole('radio', { name: 'English' }).click()
  await page.getByRole('switch', { name: 'Dark mode' }).click()
  await expect(page.locator('html')).toHaveClass('dark')
  await expect(page.getByRole('alert')).toContainText('could not be read or saved')
})

test('rejects invalid stored preference values and can repair them', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('py-agent-starter:preferences', JSON.stringify({ locale: ['en-US'], dark: 'yes' }))
  })
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN')
  await expect(page.getByRole('alert')).toBeVisible()
  await page.getByRole('radio', { name: 'English' }).click()
  await expect(page.getByRole('alert')).toHaveCount(0)
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('py-agent-starter:preferences')!))
  expect(saved).toEqual({ locale: 'en-US', dark: false })
})

test('keeps controls and content within a mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  await page.getByRole('radio', { name: 'English' }).click()
  await page.getByRole('switch', { name: 'Dark mode' }).click()
  const width = await page.evaluate(() => ({
    content: document.documentElement.scrollWidth,
    viewport: window.innerWidth,
  }))
  expect(width.content).toBeLessThanOrEqual(width.viewport)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})
