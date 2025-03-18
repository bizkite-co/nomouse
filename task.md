# Task: Test Crawl4AI File Creation

Create a test to verify that the Crawl4AI process runs as part of the `enrich` process and produces the expected output file (`_c4ai.md`).

1.  **Locate the relevant command:** The command that runs the Crawl4AI process is likely within the `processWithCrawl4AI` function in `src/lib/website.ts`. This function is called by `processWebsite`.
2.  **Determine the expected output file:** The expected output file is `_c4ai.md`, and it should be in the same directory as the corresponding `raw.html` and `index.md` files.
3.  **Create a test file:** The test file is `src/lib/__tests__/website.test.ts`.
4.  **Write the test:**
    *   Mock `fs.promises.writeFile`, `fs.promises.mkdir`, `fs.promises.access`, and `fs.promises.readFile`.
    *   Mock `child_process.exec` to simulate the execution of the `crawl4ai` command.  Return a mock `stdout` string.
    *   Mock `generateUrlPath` to return a predictable path.
    *   Call `processWithCrawl4AI` with a test URL and date.
    *   Assert that `fs.promises.writeFile` was called with the correct file path and the mocked `stdout` content.
    *   The test should *not* attempt to directly import or use anything from the compiled `website.js` file, as this has been causing module resolution issues.  Instead, rely on mocking and dynamic imports within the test itself.

**Context:**

Previous attempts to write this test have been plagued by module resolution errors (CommonJS vs. ES Modules) and build failures. The project has been reverted to a known good state (commit `3d20acb`). The goal is to write a focused test that verifies the core functionality without getting bogged down in unrelated build issues. The `enrich` script itself has been confirmed to work, so the test should focus on verifying the expected side effects (file creation) rather than trying to replicate the entire process.