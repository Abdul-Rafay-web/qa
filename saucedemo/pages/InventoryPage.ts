import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly items: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    this.items = page.getByTestId('inventory-item');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.sortDropdown = page.getByTestId('product-sort-container');
  }

  async addToCart(productSlug: string) {
    await this.page.getByTestId(`add-to-cart-${productSlug}`).click();
  }

  async openCart() {
    await this.cartLink.click();
  }

  async sortBy(option: string) {
    await this.sortDropdown.selectOption(option);
  }

  async getProductNames(): Promise<string[]> {
    return await this.items.getByTestId('inventory-item-name').allTextContents();
  }

  async getPrices(): Promise<number[]> {
    const texts = await this.items.getByTestId('inventory-item-price').allTextContents();
    return texts.map((text) => parseFloat(text.replace('$', '')));
  }

  async getImageSources(): Promise<(string | null)[]> {
    return await this.items
      .locator('img')
      .evaluateAll((images) => images.map((img) => img.getAttribute('src')));
  }
  async removeFromCart(productSlug: string) {
    await this.page.getByTestId(`remove-${productSlug}`).click();
  }
}