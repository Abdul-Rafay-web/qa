import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
    readonly page: Page;
    readonly firstName: Locator;
    readonly lastName: Locator;
    readonly postalCode: Locator;
    readonly continueButton: Locator;
    readonly finishButton: Locator;
    readonly errorMessage: Locator;
    readonly subtotalLabel: Locator;
    readonly taxLabel: Locator;
    readonly totalLabel: Locator;
    readonly completeHeader: Locator;

    constructor(page: Page) {
        this.page = page;
        this.firstName = page.getByTestId('firstName');
        this.lastName = page.getByTestId('lastName');
        this.postalCode = page.getByTestId('postalCode');
        this.continueButton = page.getByTestId('continue');
        this.finishButton = page.getByTestId('finish');
        this.errorMessage = page.getByTestId('error');
        this.subtotalLabel = page.getByTestId('subtotal-label');
        this.taxLabel = page.getByTestId('tax-label');
        this.totalLabel = page.getByTestId('total-label');
        this.completeHeader = page.getByTestId('complete-header');
    }

    async fillInfo(first: string, last: string, zip: string) {
        await this.firstName.fill(first);
        await this.lastName.fill(last);
        await this.postalCode.fill(zip);
    }

    async continue() {
        await this.continueButton.click();
    }

    async finish() {
        await this.finishButton.click();
    }

    async getAmount(label: Locator): Promise<number> {
        const text = (await label.textContent()) ?? '';
        return parseFloat(text.replace(/[^0-9.]/g, ''));
    }
}