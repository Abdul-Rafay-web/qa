import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import users from '../../test_data/users.json';

setup('authenticate as standard user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory/);
    await page.context().storageState({ path: '.auth/standard.json' });
});