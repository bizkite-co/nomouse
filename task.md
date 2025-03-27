# Task 5: Update Playwright Test for CSS Link Verification

**Goal:** Modify `tests/website-page.spec.ts` to verify that the HTML served by the development server for a dynamic page includes a `<link rel="stylesheet">` tag pointing to an Astro-generated CSS file.

**Context:** Previous analysis showed the CSS `<link>` tag was missing in the build output for dynamic pages. We need to confirm if it's also missing when served by the dev server (`npm run dev`).

**Steps:**

1.  **Modify `tests/website-page.spec.ts`:**
    *   Keep the navigation to the dynamic page URL.
    *   Add a specific assertion to check for the presence of the CSS link tag within the `<head>`. Use a locator like `page.locator('head link[rel="stylesheet"][href^="/_astro/"]').first()` and assert its count is 1 (`toHaveCount(1)`).
    *   Temporarily comment out other style assertions (like `toHaveCSS`) to focus solely on the presence of the link tag first.
2.  **Save Changes:** Write the updated code back to `tests/website-page.spec.ts`.
3.  **Append Result to `task.md`:** Append a confirmation message to this file indicating that the Playwright test has been updated as requested.

**Confirmation:** The Playwright test `tests/website-page.spec.ts` has been updated to check for the CSS link tag.