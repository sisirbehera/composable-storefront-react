import { test, expect } from '@playwright/test';

test.describe('E-Commerce Funnel: Happy-Path Checkout', () => {
  test('browses catalog, views PDP, adds to cart, and completes checkout', async ({ page }) => {
    // 1. Visit homepage
    await page.goto('/?site=electronics-spa');
    await expect(page).toHaveTitle(/Composable Storefront/i);
    await expect(page.locator('text=Next-Gen Composable Commerce')).toBeVisible();

    // 2. Navigate to Audio category
    await page.goto('/category/audio?site=electronics-spa');
    await expect(page.locator('text=Audio Collection')).toBeVisible();

    // 3. Select Sony WH-1000XM5 headphones
    const productCard = page.locator('text=Sony WH-1000XM5 Wireless Noise-Canceling Headphones').first();
    await expect(productCard).toBeVisible();
    await productCard.click();

    // 4. Assert PDP
    await expect(page).toHaveURL(/.*\/products\/CONF-DEMO-001/);
    await expect(page.locator('h1')).toContainText('Sony WH-1000XM5');
    await expect(page.locator('text=$399.99')).toBeVisible();
    await expect(page.locator('text=In Stock (42)')).toBeVisible();

    // 5. Add to Cart & verify Mini-Cart Drawer slides out
    const addToCartBtn = page.getByRole('button', { name: /Add to Cart/i });
    await expect(addToCartBtn).toBeVisible();
    await addToCartBtn.click();

    // Assert Mini-Cart Drawer
    const miniCartDrawer = page.locator('div[role="dialog"]');
    await expect(miniCartDrawer).toBeVisible();
    await expect(miniCartDrawer.locator('text=Sony WH-1000XM5')).toBeVisible();

    // 6. Proceed to Checkout
    const checkoutBtn = miniCartDrawer.getByRole('button', { name: /Checkout/i });
    await checkoutBtn.click();
    await expect(page).toHaveURL(/.*\/checkout(\/shipping-address)?/);
    await expect(page.locator('h1')).toContainText('Secure Checkout');

    // Step 1: Confirm Delivery Address -> navigates to Delivery Mode
    const continueDeliveryBtn = page.getByRole('button', { name: /Continue to Delivery Mode/i });
    await expect(continueDeliveryBtn).toBeVisible();
    await continueDeliveryBtn.click();
    await expect(page).toHaveURL(/.*\/checkout\/delivery-mode/);

    // Step 2: Choose Delivery Method -> navigates to Payment Details
    const continuePaymentBtn = page.getByRole('button', { name: /Continue to Payment/i });
    await expect(continuePaymentBtn).toBeVisible();
    await continuePaymentBtn.click();
    await expect(page).toHaveURL(/.*\/checkout\/payment-details/);

    // Step 3: Test Refresh Resilience (verify step persists on reload)
    await page.reload();
    await expect(page).toHaveURL(/.*\/checkout\/payment-details/);

    // Step 3: Continue to Review
    const reviewOrderBtn = page.getByRole('button', { name: /Continue to Review/i });
    await expect(reviewOrderBtn).toBeVisible();
    await reviewOrderBtn.click();
    await expect(page).toHaveURL(/.*\/checkout\/review-order/);

    // Step 4: Review & Place Order
    const placeOrderBtn = page.getByRole('button', { name: /Place Order/i });
    await expect(placeOrderBtn).toBeVisible();
    await placeOrderBtn.click();

    // Assert Order Confirmation Receipt
    await expect(page).toHaveURL(/.*\/order-confirmation\/ORDER-.*/, { timeout: 20000 });
    await expect(page.locator('text=Thank you for your order!')).toBeVisible();
    await expect(page.locator('text=CONFIRMED')).toBeVisible();
  });
});
