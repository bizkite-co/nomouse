# Plan to Improve Title Extraction

This plan addresses a subtask of GitHub issue #8: "Improve Web Scraping to Handle Sites with Missing Text Content" ([https://github.com/bizkite-co/nomouse/issues/8](https://github.com/bizkite-co/nomouse/issues/8)).

The `src/enrich.js` script is extracting overly long titles from some websites, causing issues with display and potentially SEO. For example, the title for the Wired article "https://www.wired.com/story/quick-select-keyboard-shortcuts-no-mouse/" is currently:

```
If You Know These Keyboard Shortcuts, You Won't Need a Mouse | WIREDMenuSearchSave this storySave this storyTriangleXLargeChevronFacebookXPinterestYouTubeInstagramTiktok
```

This is causing the title to overflow on the index page.

This issue is a subtask of #8 ("Improve Web Scraping to Handle Sites with Missing Text Content").

**Goal:** Modify `src/enrich.js` to extract concise and accurate titles, preventing excessively long titles and removing extraneous text.

**Plan:**

1.  **Analyze `extractData`:** Examine the `extractData` function in `src/enrich.js` to understand how the title is currently being extracted using Cheerio. Specifically, look at the line `const title = $('title').text() ?? '';`.
2.  **Identify the Problem:** Determine why the title extraction is including extra text (e.g., menu items, social media links) from the Wired page. This might involve inspecting the HTML structure of the Wired page using browser developer tools or `curl`.
3.  **Implement a Solution:** Modify the Cheerio selector or add post-processing logic to extract only the desired title text. This could involve:
    *   Using a more specific CSS selector (e.g., targeting a specific `<h1>` tag or a meta tag like `<meta property="og:title">`).
    *   Using JavaScript string manipulation to clean up the extracted title (e.g., splitting the string by a delimiter like "|" and taking the first part).
    *   Adding a maximum length check and truncating the title if necessary.
4.  **Test:** After modifying `src/enrich.js`, run the script with the `--refresh` flag and the Wired URL as the target (`--refresh https://www.wired.com/story/quick-select-keyboard-shortcuts-no-mouse/`) to verify that the title is extracted correctly.
5. **Address index page overflow:** Once we have clean titles, investigate the index page overflow.