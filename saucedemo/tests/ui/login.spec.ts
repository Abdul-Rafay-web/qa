import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import users from '../../test_data/users.json';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.goto();
    });

    test('standard user can log in', { tag: '@smoke' }, async ({ page }) => {
        await loginPage.login(users.standard.username, users.standard.password);
        await expect(page).toHaveURL(/inventory/);
    });

    const negativeCases = [
        { title: 'locked out user', user: users.locked.username, pass: users.locked.password, error: 'locked out' },
        { title: 'wrong password', user: users.standard.username, pass: 'wrong_pass', error: 'do not match' },
        { title: 'empty username', user: '', pass: 'secret_sauce', error: 'Username is required' },
        { title: 'empty password', user: 'standard_user', pass: '', error: 'Password is required' },
    ];

    for (const c of negativeCases) {
        test(`login fails: ${c.title}`, { tag: '@regression' }, async ({ page }) => {
            await loginPage.login(c.user, c.pass);
            await expect(loginPage.errorMessage).toContainText(c.error);
            await expect(page).not.toHaveURL(/inventory/);
        });
    }
});