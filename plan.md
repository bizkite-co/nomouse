# Plan: Update Website Summaries

## Goal

Create a script to automatically update the `index.md` files in each website subfolder within `src/content/websites/` with the content of their respective `_summary.md` files. This script will be callable from the `enrich` script.

## Steps

1.  **Analyze `enrich` Script:**
    *   Examine `src/enrich.js` (or `.ts`) to understand its structure and how to integrate the new script. Identify where to call the new script.
2.  **Create `updateWebsiteSummaries` Script (TypeScript):**
    *   Create a new TypeScript file: `src/lib/updateWebsiteSummaries.ts`.
    *   Implement the script logic:
        *   Use `fs.promises` to read and write files.
        *   Use `path` module for path manipulation.
        *   **Iterate through each subfolder in `src/content/websites/`.**
        *   **For each subfolder, read the content of `_summary.md`.**
        *   **Read the content of `index.md`.**
        *   **Replace the content of `index.md` *after* the frontmatter (indicated by `---`) with the content of `_summary.md`.**
        *   Handle potential errors (e.g., missing files).
3.  **Integrate with `enrich` Script:**
    *   Modify `src/enrich.js` (or `.ts`) to call the `updateWebsiteSummaries` script.
    *   Import the new script.
    *   Call the main function of the new script at an appropriate point in the `enrich` process.
4.  **Test the Script:**
    *   Create a test subfolder within `src/content/websites/` (e.g., `test-website/`).
    *   Create dummy `_summary.md` and `index.md` files in the test subfolder.
    *   Run the `enrich` script (or a modified version) to test the functionality.
    *   Verify that the content of `_summary.md` is correctly written to `index.md`.
5.  **Document the Plan (this file):**
    *   Create this `plan.md` file to document the steps.
6.  **Finalize and Switch Modes:**
    *   Ask for user approval of the plan.
    *   If approved, write the plan to `plan.md`.
    *   Switch to Code mode to implement the solution.

## Implementation Details

*   The `updateWebsiteSummaries` script will iterate through the subfolders in `src/content/websites/`.
*   For each subfolder:
    *   It will read the content of `_summary.md`.
    *   It will read the content of `index.md`.
    *   It will identify the end of the frontmatter in `index.md` (indicated by the second occurrence of `---`).
    *   It will replace the content of `index.md` *after* the frontmatter with the content of `_summary.md`.
*   Error handling will include checking for the existence of `_summary.md` and `index.md` and handling potential file read/write errors.

## Dependencies

*   `node:fs/promises` (built-in)
*   `path` (built-in)