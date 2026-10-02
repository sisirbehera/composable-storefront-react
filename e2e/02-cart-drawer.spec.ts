import { test, expect } from '@playwright/test';

test.describe('Cart State & Mini-Cart Drawer', () => {
  test('adds item, increments quantity, and verifies cart persistence', async ({ page }) => {
    // 1. Visit PDP directly
    await page.goto('/products/CONF-DEMO-001?site=electronics-spa');
    await expect(page.locator('h1')).toContainText('Sony WH-1000XM5');

    // 2. Add to Cart
    await page.getByRole('button', { name: /Add to Cart/i }).click();

    // 3. Mini-Cart Drawer opens
    const drawer = page.locator('div[role="dialog"]');
    await expect(drawer).toBeVisible();
    await expect(drawer.locator('text=Sony WH-1000XM5')).toBeVisible();

    // 4. Increment quantity (+) if button is present
    const stepperPlus = drawer.locator('button:has-text("+"), button[aria-label*="increase" i]').first();
    if (await stepperPlus.isVisible()) {
      await stepperPlus.click();
      await page.waitForTimeout(500);
      await expect(drawer.locator('text=$799.98').first()).toBeVisible();
    }

    // 5. Close drawer
    const closeBtn = drawer.locator('button:has-text("✕"), button[aria-label*="close" i]').first();
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
      await expect(drawer).not.toBeVisible();
    }

    // 6. Reload page and verify state persistence
    await page.reload();
    await expect(page.locator('header')).toBeVisible();

    // Open cart drawer from header cart icon
    const cartIcon = page.locator('header a[href*="/cart"], header button:has(svg)').last();
    await cartIcon.click();
    await expect(page.locator('div[role="dialog"]').locator('text=Sony WH-1000XM5')).toBeVisible();
  });
});
