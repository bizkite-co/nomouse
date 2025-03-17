# Issue #12: Add automated testing to your Astro website:

1.  **Testing:**
    *   Skip remaining failing Turndown tests in `src/lib/__tests__/utils.test.ts`.
    *   Add tests for Crawl4AI functionality. This will likely involve creating a new test file, possibly in `src/lib/__tests__`.
2.  **Crawl4AI Integration:**
    *   Ensure Crawl4AI is correctly installed and configured.
    *   Verify that Crawl4AI generates the expected `_c4ai.md` file with the correct structure.
3.  **Page Generation Rework:**
    *   Modify the Astro configuration and/or routing to generate pages from `index.md` files within each website's subfolder (e.g., `src/content/websites/example-site/index.md`).
    *   Update the existing page components (e.g., `src/pages/websites/[filename].astro`, `src/components/WebsiteItem.astro`) to work with the new data structure.
    *   Remove or refactor code related to the old file naming convention (long filenames).
4.  **Cleanup:**
    *   Remove vestigial files and code related to the old Turndown implementation and the old file naming convention.
5.  **Verification:**
    *   Run a full build and test to ensure everything works as expected.

This plan reflects the shift to Crawl4AI and the necessary changes to testing, page generation, and cleanup.