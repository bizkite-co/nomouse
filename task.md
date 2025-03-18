# Task: Make Astro website collector use the `/index.md` in the website subfolder

**GitHub Issue:** #16

**Description:**

The new scraper creates a subfolder for each website, instead of a single markdown file. The subfolder contains HTML and `_c4ai.md` and other raw scraped files that shouldn't be rendered. It also contains a `index.md` Markdown file that should be used as the content of the website page and that we should display a panel for in the `index.astro`.

**Steps:**

1.  Modify the Astro configuration and/or routing to generate pages from `index.md` files within each website's subfolder (e.g., `src/content/websites/example-site/index.md`).
2.  Update the existing page components (e.g., `src/pages/websites/[filename].astro`, `src/components/WebsiteItem.astro`) to work with the new data structure.
3. Remove or refactor code related to the old file naming convention (long filenames).