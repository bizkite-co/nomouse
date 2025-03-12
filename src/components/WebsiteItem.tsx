import type { CollectionEntry } from 'astro:content';
import { Badge } from './ui/badge';

interface Props {
  website: CollectionEntry<'websites'>;
}

export default function WebsiteItem({ website }: Props) {
  return (
    <div className="rounded-lg border p-4">
      <h2 className="text-lg font-semibold">{website.data.title}</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">{website.data.description}</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {website.data.tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
      <a
        href={`/source/${website.slug}`}
        className="mt-4 inline-block text-blue-500 hover:underline"
      >
        View Details
      </a>
    </div>
  );
}
