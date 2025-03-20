import { test, expect } from '@playwright/test';

test('search functionality - URL parameter', async ({ page }) => {
  // 1. Test the URL parameter: Test that the input text box gets updated by the URL querystring.
  await page.goto('/?q=keyboard');
  await expect(page.locator('input[data-testid="search-input"]')).toHaveValue('keyboard');
});

test('search functionality - filtering', async ({ page }) => {
  // 2. Test the filtering: Test that putting a search value in the input and blurring it should filter the websites.
  await page.goto('/');
  await page.locator('input[data-testid="search-input"]').fill('keyboard');
  await page.locator('input[data-testid="search-input"]').blur();
  await page.waitForSelector('.website-item');
  const firstItemTitle = await page.locator('.website-item h2').first().textContent();
  expect(firstItemTitle).toBe('Keyboard University');
});