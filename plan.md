# Plan to Create raw.md from raw.html

This plan addresses a subtask of GitHub issue #11: "Improve Web Scraping to Handle Sites with Missing Text Content" ([https://github.com/bizkite-co/nomouse/issues/11](https://github.com/bizkite-co/nomouse/issues/11)).

As part of the new data storage structure (issue #10), each scraped website now has a dedicated folder containing its data, including the raw HTML (`raw.html`). This issue focuses on creating a new function to generate a Markdown version of this raw HTML (`raw.md`) within the same folder.

**Goal:** Create a new function (e.g., `createRawMarkdown`) in `src/enrich.js` (or a separate module) that takes the path to a website's folder as input and generates a `raw.md` file from the `raw.html` file within that folder. This function should be callable independently, allowing for selective processing of websites.

This issue is a subtask of #8 ("Improve Web Scraping to Handle Sites with Missing Text Content").

**Plan:**

1.  **Create `createRawMarkdown` Function:**  Create a new function (either in `src/enrich.js` or a new module) that:
    *   Takes the website folder path as an argument.
    *   Reads the `raw.html` file from the folder.
    *   Converts the HTML to Markdown. Consider using a library like `turndown` or `html-to-markdown`.
    *   Writes the resulting Markdown to a `raw.md` file in the same folder.
2.  **Test:**
    * Create a test, or modify the existing enrich script to call the function on at least one site.
    *   Verify that the `raw.md` file is created correctly and contains the expected Markdown content.
3. **Commit and Close:**
    * Commit the changes with a message that closes the new issue, and does not use backticks. Wait until the git push deploys properly.

# Refactoring src/enrich.js

Due to module resolution issues and conflicts between CommonJS and ES Modules, the following refactoring steps will be taken:

1.  **Convert `src/enrich.js` to TypeScript (`src/enrich.ts`):** This will ensure consistency in the use of TypeScript throughout the project.
2.  **Separate Concerns:** Break down the large `enrichData` and `processWebsite` functions into smaller, more manageable functions with specific responsibilities. Create separate files for these functions within a new `src/lib/` subdirectory (e.g., `src/lib/website.ts`, `src/lib/data.ts`).
3.  **Use Explicit Types:** Add type annotations to all function parameters and return values.
4.  **Use `import type` where appropriate:** For type-only imports, use `import type` to avoid potential circular dependencies.
5. **Use top-level await:** Simplify asynchronous code with top-level await (requires `"module": "NodeNext"` or similar in `tsconfig.json`).
6.  **Address remaining TypeScript errors:** After making these changes, compile the code and address any remaining TypeScript errors.
7. **Update imports:** Update any files that import from `src/enrich.js` or `src/lib/utils.ts` to use the new file names and paths.