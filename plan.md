# Plan to Fix Search Functionality

## Goal

The goal is to fix the search functionality on the index page so that it correctly filters the displayed websites based on the user's search input.

## Problem

The `Search` component updates the `searchKeyword` state, but the `index.astro` page doesn't use this state to filter the websites. It displays all websites regardless of the search term. The `ListWebsites` component *does* implement the filtering logic, but it's not being used on the main page.

## Solution

1.  **Write Tests for `Search` Component:**
    *   Create a new test file: `src/components/__tests__/Search.test.tsx`.
    *   Use `@testing-library/react` to render the `Search` component.
    *   Simulate user input in the search box.
    *   Simulate clicking the search button.
    *   Simulate pressing Enter in the search box.
    *   Assert that the `searchKeyword` state in `src/store.ts` is updated correctly after each action.
    *   Test the clear button functionality, ensuring it resets both the local input state and the global `searchKeyword`.

2.  **Modify `src/pages/index.astro`:**
    *   Import the `ListWebsites` component.
    *   Pass the `websiteData` to the `ListWebsites` component as the `websites` prop.
    *   Replace the direct rendering of `WebsiteItem` components with the `ListWebsites` component.

3. **Verify:**
    * Run the tests.
    * Manually test the search functionality on the index page.