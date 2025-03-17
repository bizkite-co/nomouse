# Plan to Integrate Crawl4AI

## Goal

Integrate the `crawl4ai` Python tool into the existing web scraping process to enrich the scraped data.

## Current Scraping Process (`src/enrich.ts`)

1.  **Reads URLs:** Reads a list of URLs from `src/data/pages.csv`.
2.  **Processes each URL:** Calls the `processWebsite` function (in `src/lib/website.ts`) for each URL. This function likely handles the Playwright-based scraping.
3.  **Refresh Flag:** Supports a `--refresh` flag to force reprocessing.
4.  **Single URL:** Accepts an optional URL as a command-line argument.
5. **Screenshot Directory:** It ensures that the `public/screenshots` directory exists.

## Integration Strategy: Command-Line Execution

We'll use command-line execution to integrate `crawl4ai`. This involves calling the `crawl4ai` command from within the `src/enrich.ts` script. This approach is simpler to implement than creating an MCP server, although it might be slightly less efficient.

## Steps

1.  **Install `crawl4ai`:** Ensure `crawl4ai` is installed and accessible in the system's PATH. This might involve using `pip install crawl4ai` or setting up a virtual environment.
2.  **Modify `src/enrich.ts`:**
    *   **Import `exec`:** Import the `exec` function from the `child_process` module to execute shell commands.
    *   **Call `crawl4ai`:** Inside the `processWebsite` function (or potentially in a separate function called by `processWebsite`), after the existing Playwright scraping, execute the `crawl4ai` command.
    *   **Construct the command:** The command will look something like this:
        ```bash
        crawl4ai <url> -o markdown -f <output_file>
        ```
        *   `<url>`: The URL being processed.
        *   `-o markdown`: Specifies Markdown output.
        *   `-f <output_file>`: Specifies the output file path. We'll use a subdirectory within `src/content/websites/` to store the `crawl4ai` output (e.g., `src/content/websites/crawl4ai_output/<url_path>.md`).
    *   **Error Handling:** Wrap the `exec` call in a `try...catch` block to handle potential errors.
    * **Output Directory:** Create the `src/content/websites/crawl4ai_output` directory if it doesn't exist.
3.  **Update `src/lib/website.ts`:**
    *  Modify the `processWebsite` function to include a call to a new function that will run `crawl4ai`.
4.  **Test:** Run `src/enrich.ts` with and without the `--refresh` flag and with a specific URL to ensure both the Playwright scraping and the `crawl4ai` integration work correctly.

## Detailed Command Construction

The `crawl4ai` command will be constructed dynamically based on the URL being processed. Here's a more detailed breakdown:

```typescript
// Inside src/lib/website.ts, create a new function
async function processWithCrawl4AI(url: string, currentDate: string) {
    const urlPath = generateUrlPath(url); // Use existing utility function
    const outputPath = `src/content/websites/crawl4ai_output/${urlPath}.md`;

     // Create the crawl4ai_output directory if it doesn't exist
    try {
      await fs.mkdir('src/content/websites/crawl4ai_output', { recursive: true });
    } catch (error: any) {
      if (error.code !== 'EEXIST') {
        throw error; // Re-throw if it's not a directory-already-exists error
      }
    }

    const crawl4aiCommand = `crawl4ai "${url}" -o markdown -f "${outputPath}"`;

    try {
        const { stdout, stderr } = await exec(crawl4aiCommand);
        console.log('crawl4ai stdout:', stdout);
        if (stderr) {
            console.error('crawl4ai stderr:', stderr);
        }
    } catch (error) {
        console.error('crawl4ai execution error:', error);
    }
}

// Inside src/lib/website.ts modify processWebsite
export async function processWebsite(url: string, refresh: boolean, currentDate: string): Promise<void> {
    // ... existing Playwright scraping logic ...
    await processWithCrawl4AI(url, currentDate);
}

```

## Potential Issues

*   **Dependencies:** `crawl4ai` might have dependencies that need to be installed.
*   **Environment:** The execution environment might need to be configured for `crawl4ai` (e.g., Python virtual environment).
*   **Performance:** Calling `crawl4ai` for every URL might introduce some overhead.

## Alternative: MCP Server (Future Consideration)

For a more robust and efficient integration, we could create an MCP server for `crawl4ai`. This would allow us to interact with `crawl4ai` through a well-defined API, avoiding the overhead of repeated command-line executions. However, this is a more complex task and is best considered for a future iteration.