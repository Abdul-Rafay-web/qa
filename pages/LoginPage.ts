import { Page, Locator } from "@playwright/test";

export class LoginPage {
    readonly page: Page;
    readonly username: Locator;
    readonly password: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;


    constructor(page: Page) {
        this.page = page;
        this.username = page.getByTestID("username");
        this.password = page.getByTestID("password");
        this.loginButton = page.getByTestID("login-button");
        this.errorMessage = page.getByTestID("error")
    }
    async gotoLoginPage() {
        await this.page.goto("/");
    }
    async login(user: string, pass: string) {
        await this.username.fill(user)
        await this.password.fill(pass)
        await this.loginButton.click();
    }

}