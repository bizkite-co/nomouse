# Plan: Update Website Summaries Tests

## Goal

Update `src/lib/__tests__/updateWebsiteSummaries.test.ts` to reflect the current implementation of `src/lib/updateWebsiteSummaries.ts` and ensure all tests pass.

## Steps

1.  **Understand the Current Implementation:**
    *   Review `src/lib/updateWebsiteSummaries.ts` to understand its current logic and dependencies. It now directly uses `fs.promises` for file operations and no longer interacts with the `website` or `data` modules.

2.  **Update Mocks:**
    *   In `src/lib/__tests__/updateWebsiteSummaries.test.ts`, remove mocks for functions that are no longer used: `websiteModule.getWebsites`, `websiteModule.saveWebsites`, `websiteModule.fetchPage`, `dataModule.extractData`, `websiteModule.captureScreenshot`, `dataModule.createMarkdownContent`, and `websiteModule.processWithCrawl4AI`.
    *   Keep the mocks for `fs.promises` functions (`fs.readdir`, `fs.readFile`, `fs.writeFile`, `fs.mkdir`). Ensure these mocks are set up correctly using `vi.mock('node:fs/promises')` at the top of the file and `vi.mocked()` to access the mocked functions.

3.  **Update Assertions:**
    *   Update the assertions to reflect the current behavior of `updateWebsiteSummaries.ts`. Specifically, check that:
        *   `fs.readdir` is called with the correct path (`src/content/websites`).
        *   `fs.readFile` is called for each `_summary.md` and `index.md` file within the mocked directory structure.
        *   `fs.writeFile` is called for each `index.md` file, and the content written matches the expected combined content of `_summary.md` and the frontmatter of `index.md`.

4.  **Simplify Tests:**
    *   Combine the tests into a single test case, as the logic is now straightforward.

5. **Avoid Previous Errors:**
    * Be mindful of mocking issues encountered in previous attempts. Ensure the mocking strategy is compatible with Vitest and the current project setup.

6. **Run and Verify:**
   * Run the tests using `npm test -- -t src/lib/__tests__/updateWebsiteSummaries.test.ts`.
   * Verify that all tests pass. If tests fail, analyze the failures and adjust the mocks or assertions accordingly.