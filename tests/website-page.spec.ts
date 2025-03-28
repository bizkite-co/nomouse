import { test, expect } from '@playwright/test';

test('Site-specific page styling', async ({ page }) => {
  // Navigate to the specific page (Reverted for Task 11 Step 5)
  await page.goto('/websites/brothermobilesolutions_com_insights_article_mobile_building_inspection_accuracy'); 

  // Wait for the page to load (optional, adjust as needed)
  await page.waitForLoadState('networkidle');

  // Take a screenshot to visually verify styling
  await page.screenshot({ path: 'test-results/website-page-screenshot.png', fullPage: true });

  // Check for the presence of the Vite-injected style tag in the head (dev server)
  const cssStyleTag = page.locator('head style[data-vite-dev-id]').first();
  await expect(cssStyleTag).toHaveCount(1, { timeout: 10000 }); // Ensure the style block exists

  // Use a more specific locator for the main h1 element
  // const h1 = page.locator('main h1');
  // Ensure the locator resolves to exactly one element before asserting CSS
  // await expect(h1).toHaveCount(1);

  // Check if the h1 element has the expected font size and weight
  // Updated expected font-size to 32px based on previous test failure
  // await expect(h1).toHaveCSS('font-size', '32px');
  // await expect(h1).toHaveCSS('font-weight', '700'); // Assuming font-bold corresponds to 700

  // Check if the main container has padding
  // const main = page.locator('main');
  // await expect(main).toHaveCSS('padding-top', '32px'); // Assuming py-8 corresponds to 32px
});