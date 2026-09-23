import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  const timestamp = Date.now();
  const testUser = {
    id: 1,
    name: `Test User ${timestamp}`,
    email: `test${timestamp}@example.com`,
  };

  test('User can register successfully', async ({ page }) => {
    // Mock the register API
    await page.route('/api/register', async route => {
      const json = { user: testUser, token: 'fake-jwt-token-123' };
      await route.fulfill({ json });
    });

    await page.goto('/register');
    
    await page.fill('input[placeholder="Name"]', testUser.name);
    await page.fill('input[placeholder="Email"]', testUser.email);
    await page.fill('input[placeholder="Password"]', 'password123');
    await page.fill('input[placeholder="Confirm Password"]', 'password123');
    
    await page.getByRole('button', { name: 'Register' }).click();

    // Verify successful registration
    await expect(page).toHaveURL('/');
    await expect(page.locator(`text=Welcome back ${testUser.name}`)).toBeVisible();
  });

  test('User can login successfully', async ({ page }) => {
    // Mock the login API
    await page.route('/api/login', async route => {
      const json = { user: testUser, token: 'fake-jwt-token-123' };
      await route.fulfill({ json });
    });

    // Mock the user fetch API that happens on navigation
    await page.route('/api/user', async route => {
      const json = testUser;
      await route.fulfill({ json });
    });

    // Logout mock
    await page.route('/api/logout', async route => {
      await route.fulfill({ status: 200, body: 'ok' });
    });

    await page.goto('/login');
    await page.fill('input[placeholder="Email"]', testUser.email);
    await page.fill('input[placeholder="Password"]', 'password123');
    
    await page.getByRole('button', { name: 'Login' }).click();

    // Verify successful login
    await expect(page).toHaveURL('/');
    await expect(page.locator(`text=Welcome back ${testUser.name}`)).toBeVisible();

    // Test logout
    await page.getByRole('button', { name: 'Logout' }).click();
    await expect(page.locator('text=Login')).toBeVisible();
  });
});
