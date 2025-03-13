import WebsiteItem from "@/components/WebsiteItem.tsx";
import { cn } from "@/lib/utils";
import { filteredTags, searchKeyword } from "@/store";
import { useStore } from "@nanostores/react";
import { useMemo, useState, useEffect } from "react";
import { getCollection, type CollectionEntry } from 'astro:content';
import { Suspense } from 'react'; // Import Suspense
import Spinner from "@/components/common/Spinner";

export default function ListWebsites() {
  const search = useStore(searchKeyword);
  const tags = useStore(filteredTags);
  const [websites, setWebsites] = useState<CollectionEntry<'websites'>[]>([]);

  useEffect(() => {
    const fetchWebsites = async () => {
      const fetchedWebsites = await getCollection('websites');
      setWebsites(fetchedWebsites);
    };

    fetchWebsites();
  }, []);

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
      <Suspense fallback={<Spinner />}>
        {filteredWebsites.map((website) => (
          <WebsiteItem key={website.slug} website={website} />
        ))}
      </Suspense>
    </div>
  );
}
