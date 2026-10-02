import { test, expect } from '@playwright/test';

test.describe('Theme System & Zero-FOUC', () => {
  test('defaults to light view, toggles to dark mode, and persists across reloads', async ({ page }) => {
    // 1. Visit homepage
    await page.goto('/?site=electronics-spa');

    // Reset preference to ensure clean light default
    await page.evaluate(() => localStorage.removeItem('storefront_theme'));
    await page.reload();

    const html = page.locator('html');
    await expect(html).not.toHaveClass(/dark/);

    // 2. Find Theme Toggle button in top utility bar
    const themeToggle = page.locator('button[title*="theme" i], button[aria-label*="theme" i]').first();
    await expect(themeToggle).toBeVisible();

    // 3. Click Theme Toggle -> switches to Dark Mode
    await themeToggle.click();
    await expect(html).toHaveClass(/dark/);

    // 4. Reload page to verify persistence without flash
    await page.reload();
    await expect(html).toHaveClass(/dark/);

    // 5. Click again -> switches back to Light Mode
    await themeToggle.click();
    await expect(html).not.toHaveClass(/dark/);
  });
});
