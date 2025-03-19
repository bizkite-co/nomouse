import { cn } from "../lib/utils.js";
import { filteredTags, searchKeyword } from "../store.js";
import Spinner from "./common/Spinner.tsx";
import { useStore } from "@nanostores/react";
import WebsiteItem from "./WebsiteItem.astro";
import { generateFilename, generateUrlPath, filterWebsites } from "../lib/utils.js"; // Import filterWebsites

export default function ListWebsites({
  websites,
}: {
  websites: {
    data: { url: string; title: string; tags: string[]; favicon?: string, description?: string };
  }[];
}) {
  const $filteredTags = useStore(filteredTags);
    const tags: string[] = [];
    for (const tag in $filteredTags) {
        if ($filteredTags[tag]) {
            tags.push(tag);
        }
    }
  const $searchKeyword = useStore(searchKeyword);

  const search = $searchKeyword.toLowerCase();

  // Use the filterWebsites function
  const filtered = filterWebsites(websites, search, tags);

  if (filtered.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center w-full h-full">
          <p className="text-sm text-gray-500">No websites found.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {filtered.map((website) => (
            <astro-island key={website.data.url} client:load component-url="./WebsiteItem.astro" component-export="default" props={{
                title: website.data.title,
                description: website.data.description,
                url: website.data.url,
                favicon: website.data.favicon,
                slug: generateUrlPath(website.data.url),
                desktopSnapshot: '/screenshots/' + generateFilename(website.data.url)
              }}>
            </astro-island>
        ))}
      </div>
    </>
  );
}
