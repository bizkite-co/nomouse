# Task 2: Analyze Build Process (Verbose)

**Goal:** Identify differences in how Astro's build process handles CSS for the static `index.astro` page versus the dynamic `[urlPath].astro` pages.

**Steps:**

1.  **Run Verbose Build:** Execute the command `npx astro build --verbose` in the terminal.
2.  **Capture Output:** Save the complete output log from the command.
3.  **Analyze Log:** Carefully examine the log, specifically comparing the sections related to:
    *   Processing `src/pages/index.astro`.
    *   Processing `src/pages/websites/[urlPath].astro` (and the dynamic pages it generates).
    *   CSS dependency scanning, chunking, and bundling for both types of pages.
    *   Generation of HTML and specifically the inclusion/exclusion of `<link rel="stylesheet">` tags for the CSS bundles.
4.  **Document Findings:** Note any significant differences, warnings, or errors observed between the static and dynamic page build processes, particularly concerning CSS handling.