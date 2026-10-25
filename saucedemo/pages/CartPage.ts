import { Page, Locator } from '@playwright/test';

export class CartPage {
    readonly page: Page;
    readonly items: Locator;
    readonly checkoutButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.items = page.getByTestId('inventory-item');
        this.checkoutButton = page.getByTestId('checkout');
    }

    async getItemNames(): Promise<string[]> {
        return await this.items.getByTestId('inventory-item-name').allTextContents();
    }

    async proceedToCheckout() {
        await this.checkoutButton.click();
    }
}