import WebsiteItem from "@/components/WebsiteItem.tsx";
import { cn } from "@/lib/utils";
import { filteredTags, searchKeyword } from "@/store";
import { useStore } from "@nanostores/react";
import { useMemo } from "react";
import type { CollectionEntry } from 'astro:content';

interface Props {
  websites: CollectionEntry<'websites'>[];
}

export default function ListWebsites({ websites }: Props) {
  const search = useStore(searchKeyword);
  const tags = useStore(filteredTags);

  const filteredWebsites = useMemo(() => {
    if (!search && tags.length === 0) return websites;
    return websites.filter((website) => {
      if (
        tags.length > 0 &&
        !tags.every((tag) => website.data.tags.includes(tag))
      ) {
        return false;
      }
      if (
        website.data.title != null &&
        !website.data.title.toLowerCase().includes(search)
      )
        return false;
      return true;
    });
  }, [search, tags, websites]);

  return (
    <div
      className={cn(
        "container mx-auto px-4 md:px-0",
        "grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:grid-cols-4",
      )}
    >
      {filteredWebsites.map((website) => (
        <WebsiteItem key={website.slug} website={website.data} slug={website.slug} />
      ))}
    </div>
  );
}
