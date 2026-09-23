import { test, expect } from '@playwright/test';

test.describe('Smoke tests for Frontend', () => {
  test('Home page should load correctly', async ({ page }) => {
    // Assuming the app runs on a common local port like 5173 for Vite
    await page.goto('/');
    
    // Check if the home link is present
    await expect(page.locator('text=Home').first()).toBeVisible();
    
    // Check if register and login links are visible for unauthenticated users
    await expect(page.locator('text=Register')).toBeVisible();
    await expect(page.locator('text=Login')).toBeVisible();
  });

  test('Navigation to Register page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Register');
    await expect(page).toHaveURL(/.*register/);
    await expect(page.getByRole('button', { name: 'Register' })).toBeVisible();
  });

  test('Navigation to Login page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Login');
    await expect(page).toHaveURL(/.*login/);
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });

  test('Protected route /create redirects to login for unauthenticated users', async ({ page }) => {
    await page.goto('/create');
    // Assuming the app redirects unauthenticated users to /login
    await expect(page).toHaveURL(/.*login/);
  });
});
