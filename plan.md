# Refactoring Plan for `src/enrich.js`

This plan outlines the steps to refactor `src/enrich.js` to improve its modularity, error handling, and Markdown generation, addressing the requirements of GitHub issue #7.

## 1. Modularization

The following functions will be created or modified:

*   **`normalizeUrl(url)`:** (Existing) - Stays as is.
*   **`generateFilename(url)`:** (Existing) - Stays as is.
*   **`generateUrlPath(url)`:** (Existing) - Stays as is.
*   **`captureScreenshot(url, outputPath)`:** (Existing) - Improve error handling by throwing an error instead of returning `null`.
*   **`fetchPage(url)`:** (Existing) - Improve error handling by throwing an error instead of returning `null`.
*   **`extractData(html, url, currentDate)`:** (Existing) - Improve error handling: return `null` if the title cannot be extracted.
*   **`createMarkdownContent(data)`:** (New) - Takes the extracted data object and returns the Markdown string with frontmatter.
*   **`processWebsite(url, refresh, currentDate)`:** (New) - Handles the logic for a single URL, including fetching, extracting, capturing screenshot, and writing the Markdown file.
*   **`enrichData(refresh = false, targetUrl = null)`:** (Modified) - Reads `pages.csv`, iterates through URLs, calls `processWebsite`, handles `refresh` and `targetUrl` logic, and creates the `screenshots` directory.

## 2. Improved Error Handling

*   In `fetchPage` and `captureScreenshot`, errors will be thrown instead of returning `null`.
*   In `extractData`, `null` will be returned if the title cannot be extracted.
*   In `processWebsite`, if `extractData` returns `null`, the Markdown file will not be written, and an error will be logged.
*   `try...catch` blocks will be used to handle potential errors gracefully.

## 3. Markdown Generation

*   `createMarkdownContent` will correctly format the frontmatter, escaping double quotes in the title and description.
*   Cases where `desktopSnapshot` might be empty will be handled.

## 4. GitHub Issue #7

*   The modularization and error handling directly address the main points of the issue.
*   Checking for website changes (using ETags or Last-Modified headers) is a more complex task and is considered a potential future enhancement.

## Workflow

1.  Read `src/data/pages.csv`.
2.  Parse CSV data to get URLs.
3.  Iterate through URLs:
    *   For each URL, call `processWebsite`.
4.  `processWebsite` function:
    *   Check if `refresh` is true or if the file doesn't exist.
    *   Call `fetchPage` to get HTML.
    *   Call `extractData` to extract data.
    *   If `extractData` returns `null` (title missing), log an error and skip.
    *   Call `captureScreenshot`.
    *   Call `createMarkdownContent` to generate Markdown.
    *   Write Markdown to file.
5. Create the `public/screenshots` directory if it doesn't exist.

## Potential Future Enhancement

*   Implement a mechanism to check for website changes (using ETags or Last-Modified headers) to avoid unnecessary scraping. This could be added to the `processWebsite` function.