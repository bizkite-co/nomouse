# Overall Plan

## Fix Search Functionality

* [x] Write tests for the `Search` component. (Partially done, some tests commented out)
* [x] Install testing libraries (@testing-library/react, @testing-library/jest-dom, jsdom).
* [x] Configure Vitest for JSDOM.
* [x] Fix import errors in tests.
* [x] Move event handler functions (`onSearch`, `onClickSearch`, `onClear`) inside the `Search` component.
* [x] Remove `ListWebsites` component and render `WebsiteItem` directly in `index.astro`.
* [x] Ensure `index.astro` correctly fetches and processes website data using `getCollection`.
* [x] Ensure `index.astro` correctly filters website data based on `searchKeyword`.
* [x] Ensure `WebsiteItem` components are rendered correctly with the filtered data.
* [x] Fix the issue with `this` being undefined in event handlers.
* [x] Address the `astro-island` errors.
* [x] Address the React key prop warning.
* [x] Ensure the build process completes successfully.
* [x] Ensure the website list is displayed correctly on page load.
* [x] Ensure the search input filters the website list correctly.
* [x] Create a VS Code launch configuration for debugging.
* [ ] Write comprehensive integration/end-to-end tests (consider Playwright).

## Improve Type Definitions

* [x] Create `src/types.ts` and define `WebsiteData` interface.
* [x] Update `src/lib/utils.ts` to use `WebsiteData`.
* [x] Update `src/pages/index.astro` to use `WebsiteData`.
* [x] Update `src/components/ListWebsites.tsx` to use `WebsiteData`. (Later removed)
* [x] Update `src/components/ModalSubmitNew.tsx` to use `WebsiteData`.

## Future Considerations

* [ ] Set up Playwright for end-to-end testing (Issue #17).