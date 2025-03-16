# Issue #12: Add automated testing to your Astro website:

1.  **Testing Framework:** We'll use Vitest, as you suggested.

2.  **Test Type:** We'll start with unit tests, focusing on the functions in `src/lib/utils.ts`, particularly `createRawMarkdown`.

3.  **Test File Location:** I recommend creating a directory `src/lib/__tests__` and placing the tests in a file named `utils.test.ts`. This keeps tests close to the code they are testing.

4.  **Test Cases for `createRawMarkdown`:** We should test the following scenarios:

    * [X] ~~*Empty input string.*~~ [2025-03-16]
    * [ ] Basic HTML (headings, paragraphs, lists, links, images).
    * [ ] Complex HTML (nested elements, tables).
    * [ ] Malformed or incomplete HTML.
    * [ ] Special characters and HTML entities.
    * [ ] Code blocks (verify fenced style).
    * [ ] Headings (verify atx style).
    * [ ] GitHub Flavored Markdown features (tables, strikethrough, etc.).
    * [ ] Large HTML input.
    * [ ] HTML with inline styles and scripts.
    * [ ] Consider testing the commented-out `turndownService.remove` and `turndownService.keep` rules in `src/lib/utils.ts`.
    * [ ] The example real-world test case is `src/content/websites/www_wired_com_story_quick_select_keyboard_shortcuts_no_mouse/raw.html`. An automated test should be created to convert this file to valid Markdown.

5.  **Test Execution:** A `test` script will be added to `package.json` to run Vitest.

This plan focuses on thoroughly testing the `createRawMarkdown` function and provides a standard structure for organizing tests.