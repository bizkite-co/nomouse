import { test, expect } from '@playwright/test';

test('search functionality', async ({ page }) => {
  // Navigate to the homepage and wait for the search input to be visible
  await page.goto('/');
  await page.waitForSelector('input[data-testid="search-input"]');

  // Locate the search input field and type a query
  await page.locator('input[data-testid="search-input"]').fill('keyboard');

  // Submit the search
  await page.keyboard.press('Enter');

  // Wait for the URL to change and include the search query
  await expect(page).toHaveURL(/.*\\?q=keyboard.*/, { timeout: 10000 });
});