# Website Refactoring Plan

This plan outlines the steps to refactor the website to use Astro's content collections and Markdown files for data management, addressing the current error and aligning with the requirements of GitHub Issue #3.

## Current Situation

- The website is currently experiencing a `TypeError` because `src/components/ListTags.tsx` is attempting to read from `websites.json`, which is no longer the primary data source.
- `src/enrich.js` has been modified to generate Markdown files in `src/content/websites/`.
- The goal is to leverage Astro's content collections and routing based on these Markdown files.
- GitHub Issue #3 details the requirements for this refactoring.

## Plan

1.  **Address the Immediate Error (Quick Fix):**

    - Modify `src/components/ListTags.tsx` to temporarily use a hardcoded array of tags. This will allow the website to load without relying on `websites.json`, resolving the `TypeError`.

    ```typescript
    // src/components/ListTags.tsx
    // ... other imports
    import { useMemo } from 'react';

    export default function ListTags() {
      const selectedTags: string[] = useStore(filteredTags);

      // TEMPORARY FIX: Use hardcoded tags
      const tags = useMemo(() => [
        "accessibility",
        "design",
        "community",
        "keyboard",
        "shortcuts",
        "productivity"
      ], []);

      // ... rest of the component
    }
    ```

2.  **Confirm Astro Content Collection Setup:**

    - Inspect `src/content/config.ts` and ensure a `websites` content collection is defined. If not, add it:

    ```typescript
    // src/content/config.ts
    import { defineCollection, z } from 'astro:content';

    const websites = defineCollection({
      type: 'content', // Assuming 'content' type for Markdown
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        favicon: z.string().optional(),
        image: z.string().optional(),
        url: z.string(),
        tags: z.array(z.string()),
        lastReviewAt: z.string().or(z.date()), // Handle both string and date
        desktopSnapshot: z.string().optional(),
        uuid: z.string(),
      }),
    });

    export const collections = { websites };
    ```

3.  **Dynamic Routing Implementation:**

    - Verify that `src/pages/source/[...slug].astro` uses `getStaticPaths` to generate pages based on the `websites` collection. The file should look something like this:

    ```astro
    ---
    // src/pages/source/[...slug].astro
    import { getCollection } from 'astro:content';
    import Layout from '@/layouts/Layout.astro';

    export async function getStaticPaths() {
      const websites = await getCollection('websites');
      return websites.map(website => ({
        params: { slug: website.slug },
        props: { website },
      }));
    }

    const { website } = Astro.props;
    const { Content } = await website.render();
    ---

    <Layout title={website.data.title}>
      <article>
        <h1>{website.data.title}</h1>
        <Content />
        {/* Display other data from website.data */}
      </article>
    </Layout>
    ```

4.  **Refactor `ListTags.tsx` (or Create `TagFilter.tsx`):**

    - Create a new component, `src/components/TagFilter.tsx`, to handle tag filtering. This promotes better component organization.
    - Use `getCollection('websites')` to fetch all website entries.
    - Extract all unique tags from the `websites` collection.
    - Implement the filtering logic using the `filteredTags` store (as currently done in `ListTags.tsx`).

5.  **Update `Navbar.tsx`:**

    - Modify `src/components/Navbar.tsx` to include links to the generated website pages.
    - Fetch the `websites` collection and generate links based on the `slug` of each entry.

6.  **Address GitHub Issue #3:**

    - The provided issue details confirm the overall plan.
    - Add comments to the issue as progress is made, marking tasks as completed.

7.  **Deployment (Confirmation):**

    - Confirm that the Astro build process is correctly configured for GitHub Pages deployment (as specified in `.clinerules`). This usually involves setting the correct `base` path in `astro.config.mjs`.

## Mermaid Diagram

```mermaid
graph LR
    subgraph Data Source
        A[Markdown Files] --> B(Astro Content Collection)
    end
    subgraph Routing
        B --> C[getStaticPaths]
        C --> D[src/pages/source/[...slug].astro]
    end
    subgraph Components
        D --> E[Display Content]
        B --> F[TagFilter.tsx]
        B --> G[Navbar.tsx]
    end
    subgraph GitHub
        H[Issue #3]
    end
    B -- Updates --> H