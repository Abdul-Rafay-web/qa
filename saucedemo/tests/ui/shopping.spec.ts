import { test, expect } from '@playwright/test';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';


test.describe('Shopping flow', () => {
    let inventory: InventoryPage;

    test.beforeEach(async ({ page }) => {
        await page.goto('/inventory.html');
        inventory = new InventoryPage(page);
    });

    test('shows 6 products', { tag: '@smoke' }, async () => {
        expect(await inventory.getProductNames()).toHaveLength(6);
    });

    test('adding a product updates the cart badge', { tag: '@smoke' }, async () => {
        await inventory.addToCart('sauce-labs-backpack');
        await expect(inventory.cartBadge).toHaveText('1');
    });

    test('removing a product clears the cart badge', { tag: '@regression' }, async () => {
        await inventory.addToCart('sauce-labs-backpack');
        await inventory.removeFromCart('sauce-labs-backpack');
        await expect(inventory.cartBadge).toBeHidden();
    });

    test('added product appears in the cart', { tag: '@regression' }, async ({ page }) => {
        await inventory.addToCart('sauce-labs-backpack');
        await inventory.openCart();
        const cart = new CartPage(page);
        expect(await cart.getItemNames()).toEqual(['Sauce Labs Backpack']);
    });

    test('price sort low to high works', { tag: '@regression' }, async () => {
        await inventory.sortBy('lohi');
        const prices = await inventory.getPrices();
        const expected = [...prices].sort((a, b) => a - b);
        expect(prices).toEqual(expected);
    });
});