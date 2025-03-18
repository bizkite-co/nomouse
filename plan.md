# Plan to Update Website Collector

## Goal

Modify the Astro website to use the `/index.md` files within website subfolders instead of the single, long-filename Markdown files.

## Steps

1.  **Modify `src/pages/websites/[filename].astro`:**

    *   Change `getStaticPaths` to:
        *   Read the directories within `src/content/websites/`.
        *   For each directory, construct a path using the directory name.
        *   Read the content of the `index.md` file within each directory using `fs.readFileSync` and `gray-matter`.
        *   Return the directory name as the `filename` param and the parsed Markdown data (frontmatter and content) as props.
    *   Update the component to use the `content` and `data` (frontmatter) props instead of the `website` prop.
    *   Remove the import and usage of `websites.json`.

2.  **Update `src/components/WebsiteItem.astro`:**

    *   Modify this component to accept a `slug` or directory name prop instead of the full filename.
    *   Update the link to use the new `/websites/{slug}` route.

3.  **Remove old code (if any):**

    *   Search for any remaining code that uses the old filename convention and remove or refactor it.

4. **Consider removing `src/lib/utils.ts` functions:**

    *   Review `generateFilename` and `normalizeUrl` in `src/lib/utils.ts`. If they are no longer needed, remove them.

## Detailed Changes (for `[filename].astro`)

```typescript
// ---
// import Layout from '../../layouts/Layout.astro';
// import dataWebsites from '../../data/websites.json'; // Remove this
// import { normalizeUrl, generateFilename } from '../../lib/utils.ts'; // Remove this
//
// interface Props {
//     website: typeof dataWebsites[0];
// }
//
// export async function getStaticPaths() {
//   return dataWebsites.map((website) => {
//     const filename = generateFilename(website.url);
//     return {
//       params: { filename },
//       props: { website },
//     };
//   });
// }
//
// const { filename } = Astro.params;
// const { website } = Astro.props as Props;
//
// if (!website) {
//   return Astro.redirect('/404'); // Or handle the missing website case appropriately
// }
//
// const expectedFilename = generateFilename(website.url);
// if (filename !== expectedFilename) {
//     return Astro.redirect('/404');
// }
//
// ---
//
// <Layout title={website.title || 'Website Details'}>
//   <main class="container mx-auto px-4 md:px-0 py-8">
//     <h1 class="text-2xl font-bold mb-4">{website.title}</h1>
//     <div class="flex gap-4">
//       <div class="h-24 w-24 bg-muted p-2">
//         <img
//           src={website.favicon || 'https://placehold.co/400?text=No%20Picture'}
//           alt={website.title ?? 'missing website title'}
//           class="aspect-square w-full rounded object-cover"
//         />
//       </div>
//       {website.description && (
//         <p class="text-sm text-muted-foreground">{website.description}</p>
//       )}
//     </div>
//     {website.desktopSnapshot && (
//       <img src={`/` + website.desktopSnapshot} alt="website screenshot" class="my-4" />
//     )}
//     <div class="my-4">
//       <p class="text-sm">
//         <strong>Tags:</strong>
//         {website.tags.join(', ')}
//       </p>
//       <p class="text-sm">
//         <strong>Last Reviewed At:</strong>
//         {website.lastReviewAt}
//       </p>
//     </div>
//     <a
//       href={website.url}
//       target="_blank"
//       rel="noopener noreferrer"
//       class="text-blue-500 hover:underline"
//     >
//       Visit Website
//     </a>
//   </main>
// </Layout>

import Layout from '../../layouts/Layout.astro';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface Props {
    content: string;
    data: {
        title?: string;
        description?: string;
        favicon?: string;
        desktopSnapshot?: string;
        tags?: string[];
        lastReviewAt?: string;
        url?:string;
    };
}

export async function getStaticPaths() {
  const websitesDir = path.join(process.cwd(), 'src/content/websites');
  const websiteFolders = fs.readdirSync(websitesDir).filter(item => fs.statSync(path.join(websitesDir, item)).isDirectory());

  return websiteFolders.map(folder => {
    const indexPath = path.join(websitesDir, folder, 'index.md');
    const fileContent = fs.readFileSync(indexPath, 'utf-8');
    const { data, content } = matter(fileContent);

    return {
      params: { filename: folder }, // Use the folder name as the filename
      props: { data, content },
    };
  });
}

const { filename } = Astro.params;
const { data, content } = Astro.props as Props;

if (!data) {
  return Astro.redirect('/404'); // Or handle the missing website case appropriately
}


---

<Layout title={data.title || 'Website Details'}>
  <main class="container mx-auto px-4 md:px-0 py-8">
    <h1 class="text-2xl font-bold mb-4">{data.title}</h1>
    <div class="flex gap-4">
      <div class="h-24 w-24 bg-muted p-2">
        <img
          src={data.favicon || 'https://placehold.co/400?text=No%20Picture'}
          alt={data.title ?? 'missing website title'}
          class="aspect-square w-full rounded object-cover"
        />
      </div>
      {data.description && (
        <p class="text-sm text-muted-foreground">{data.description}</p>
      )}
    </div>
    {data.desktopSnapshot && (
      <img src={`/` + data.desktopSnapshot} alt="website screenshot" class="my-4" />
    )}
    <div class="my-4">
      <p class="text-sm">
        <strong>Tags:</strong>
        {/* Handle tags being potentially undefined */}
        {data.tags ? data.tags.join(', ') : 'No tags'}
      </p>
      <p class="text-sm">
        <strong>Last Reviewed At:</strong>
        {data.lastReviewAt}
      </p>
    </div>
    <a
      href={data.url}
      target="_blank"
      rel="noopener noreferrer"
      class="text-blue-500 hover:underline"
    >
      Visit Website
    </a>
    {/* Render the Markdown content */}
    <div class="prose mt-8" set:html={content} />
  </main>
</Layout>
```

## Update WebsiteItem.astro

```typescript
// <template>
//   <div class="website-item">
//     <h2>
//       <a :href="`/websites/${filename}`">{website.title}</a>
//     </h2>
//     <p>{website.description}</p>
//     </div>
// </template>
//
// <script>
// export default {
//   props: {
//     website: {
//       type: Object,
//       required: true,
//     },
//     filename: {
//       type: String,
//       required: true
//     }
//   },
// };
// </script>

import { generateFilename } from '../../lib/utils';

interface Props {
    title: string;
    description: string;
    url: string;
    favicon?: string;
}

const { title, description, url, favicon } = Astro.props as Props;
const slug = generateFilename(url);

---
<div class="website-item border rounded p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
    <a href={`/websites/${slug}`} class="block">
        <div class="flex items-center gap-4">
            <div class="h-16 w-16 bg-muted p-2 flex-shrink-0">
                {favicon ? (
                    <img
                        src={favicon}
                        alt={title ?? 'missing website title'}
                        class="aspect-square w-full rounded object-cover"
                    />
                ) : (
                    <div class="aspect-square w-full rounded bg-gray-200 flex items-center justify-center text-gray-500">
                        <span class="text-sm">No Image</span>
                    </div>
                )}
            </div>
            <div>
                <h2 class="text-lg font-semibold">{title}</h2>
                {description && (
                    <p class="text-sm text-muted-foreground">{description}</p>
                )}
            </div>
        </div>
    </a>
</div>