import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import users from '../../test_data/users.json';

test.use({ storageState: { cookies: [], origins: [] } });

test('performance glitch user logs in within the time budget', { tag: '@regression' }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    const start = Date.now();
    await loginPage.login(users.performance.username, users.performance.password);
    await expect(page).toHaveURL(/inventory/, { timeout: 15000 });
    const elapsed = Date.now() - start;

    expect(elapsed, `Login took ${elapsed} ms`).toBeLessThan(10000);
});