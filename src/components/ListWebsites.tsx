import dataWebsites from '@/data/websites.json';
import { cn } from '@/lib/utils';
import { filteredTags, searchKeyword } from '@/store';
import { useStore } from '@nanostores/react';
import { useMemo } from 'react';
import WebsiteItem from '@/components/WebsiteItem.tsx';
import { generateUrlPath } from '@/enrich.js';

export default function ListWebsites() {
  const search = useStore(searchKeyword);
  const tags = useStore(filteredTags);

  const filteredWebsites = useMemo(() => {
    if (!search && tags.length === 0) return dataWebsites;
    return dataWebsites.filter((website) => {
      if (
        tags.length > 0 &&
        !tags.every((tag) => (website.tags as string[]).includes(tag))
      ) {
        return false;
      }
      if (website.title != null && !website.title.toLowerCase().includes(search))
        return false;
      return true;
    });
  }, [search, tags]);

  return (
    <div
      className={cn(
        'container mx-auto px-4 md:px-0',
        'grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:grid-cols-4',
      )}
    >
      {filteredWebsites.map((website, index) => (
        <WebsiteItem key={index} website={website} id={website.uuid!} />
      ))}
    </div>
  );
}
