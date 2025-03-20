Set up Playwright for end-to-end testing (Issue #17).

Plan:
1. In `src/pages/index.astro`:
   * Get the search query from the URL.
   * Filter the websites using the `filterWebsites` function.
   * Render the filtered websites.
2. In `src/components/Search.tsx`:
   * When the search term changes, update the URL with the search query.
3. In `tests/search.spec.ts`:
   * Remove the `await page.keyboard.press('Enter');` line.
   * Instead of waiting for the URL to change, I'll wait for the website items to be displayed.
   * I'll use `page.locator('.website-item')` to select the website items.
   * I'll assert that the number of website items is 1.