import { test, expect } from '@playwright/test';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import data from '../../test_data/checkout.json';

test.describe('Checkout', () => {
    let checkout: CheckoutPage;

    test.beforeEach(async ({ page }) => {
        const inventory = new InventoryPage(page);
        const cart = new CartPage(page);
        checkout = new CheckoutPage(page);

        await page.goto('/inventory.html');
        await inventory.addToCart('sauce-labs-backpack');
        await inventory.openCart();
        await cart.proceedToCheckout();
    });

    test('user completes a purchase', { tag: '@smoke' }, async () => {
        await checkout.fillInfo(data.valid.firstName, data.valid.lastName, data.valid.postalCode);
        await checkout.continue();
        await checkout.finish();
        await expect(checkout.completeHeader).toHaveText('Thank you for your order!');
    });

    for (const c of data.invalidCases) {
        test(`checkout blocked: ${c.title}`, { tag: '@regression' }, async () => {
            await checkout.fillInfo(c.firstName, c.lastName, c.postalCode);
            await checkout.continue();
            await expect(checkout.errorMessage).toContainText(c.error);
        });
    }

    test('order total equals subtotal plus tax', { tag: '@regression' }, async () => {
        await checkout.fillInfo(data.valid.firstName, data.valid.lastName, data.valid.postalCode);
        await checkout.continue();

        const subtotal = await checkout.getAmount(checkout.subtotalLabel);
        const tax = await checkout.getAmount(checkout.taxLabel);
        const total = await checkout.getAmount(checkout.totalLabel);

        expect(total).toBeCloseTo(subtotal + tax, 2);
    });
});