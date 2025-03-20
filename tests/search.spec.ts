import { test, expect } from '@playwright/test';

test('search functionality', async ({ page }) => {
  // Navigate to the homepage with the search query
  await page.goto('/?q=keyboard');

  // Wait for the website items to be displayed
  await page.waitForSelector('.website-item');

  // Log the number of website items found
  const websiteItems = await page.locator('.website-item').count();
  console.log(`Found ${websiteItems} website items`);

  // Assert that the number of website items is 1
  await expect(page.locator('.website-item')).toHaveCount(1);
});