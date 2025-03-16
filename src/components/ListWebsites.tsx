import { cn } from "../lib/utils.js";
import { filteredTags, searchKeyword } from "../store.js";
import Spinner from "./common/Spinner.tsx";
import { useStore } from "@nanostores/react";

export default function ListWebsites({
  websites,
}: {
  websites: {
    data: { url: string; title: string; tags: string[]; favicon?: string };
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

  const filtered = websites.filter((website) => {
    if (
      search.length > 0 &&
      !website.data.title.toLowerCase().includes(search) &&
      !website.data.url.toLowerCase().includes(search)
    ) {
      return false;
    }
    if (tags.length > 0) {
      if (!tags.every((tag: string) => website.data.tags.includes(tag))) {
        return false;
      }
    }

    return true;
  });

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
      {filtered.length > 0 && (
        <div className="flex flex-col gap-2">
          <Spinner className="mx-auto" />
          <p className="text-center text-sm text-gray-500">Loading...</p>
        </div>
      )}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        style={{
          opacity: filtered.length > 0 ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
        }}
      >
        {/* {filtered.map((website) => (
          <WebsiteItem key={website.data.url} website={website.data} />
        ))} */}
      </div>
    </>
  );
}
