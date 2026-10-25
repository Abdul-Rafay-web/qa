import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import users from '../../test_data/users.json';

test.use({ storageState: { cookies: [], origins: [] } });

for (const [name, creds] of Object.entries(users)) {
    if (name === 'locked') continue;

    test.describe(`${name} user`, () => {
        test('each product has its own image', { tag: '@regression' }, async ({ page }) => {
            test.fail(name === 'problem', 'BUG-001: problem_user sees the same image for every product');

            const loginPage = new LoginPage(page);
            await loginPage.goto();
            await loginPage.login(creds.username, creds.password);

            const inventory = new InventoryPage(page);
            const sources = await inventory.getImageSources();
            expect(new Set(sources).size).toBe(sources.length);
        });
    });
}