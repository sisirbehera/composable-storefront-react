import { test, expect } from '@playwright/test';

test.describe('Customer Auth & Account Navigation', () => {
  test('signs in with 1-Click Demo Login and inspects order history & address book', async ({ page }) => {
    // 1. Visit Login page
    await page.goto('/login?site=electronics-spa');
    await expect(page.locator('text=Sign in to your account')).toBeVisible();

    // 2. Click "1-Click Demo Sign In"
    const demoLoginBtn = page.getByRole('button', { name: /1-Click Demo Sign In/i });
    await expect(demoLoginBtn).toBeVisible();
    await demoLoginBtn.click();

    // 3. Wait for redirect to Account Dashboard
    await expect(page).toHaveURL(/.*\/my-account/, { timeout: 15000 });
    await expect(page.getByRole('heading', { name: 'Alex Morgan' })).toBeVisible();

    // 4. Navigate to Order History
    await page.goto('/my-account/orders?site=electronics-spa');
    await expect(page.locator('text=ORDER-100421')).toBeVisible();

    // 5. Navigate to Address Book
    await page.goto('/my-account/address-book?site=electronics-spa');
    await expect(page.getByRole('heading', { name: 'Address Book' })).toBeVisible();
    await expect(page.getByText('742 Evergreen Terrace').first()).toBeVisible();
  });
});
