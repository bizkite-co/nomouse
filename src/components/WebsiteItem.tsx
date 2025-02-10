import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Props {
  website: {
    url: string;
    title: string | null;
    description: string | null;
    tags: string[];
    favicon: string | null;
    desktopSnapshot?: string;
    lastReviewAt: string;
  };
}

export default function WebsiteItem({ website }: Props) {
  return (
    <a
      href={website.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'rounded bg-background p-4 shadow',
        'flex flex-col gap-4',
      )}
    >
      <div className="flex gap-2">
        <div className="h-12 w-12 bg-muted p-2">
          <img
            src={
              website.favicon || 'https://placehold.co/400?text=No%20Picture'
            }
            alt={website.title ?? 'missing website title'}
            className="aspect-square w-full rounded object-cover"
          />
        </div>
        <p className="flex-1 text-sm font-semibold">{website.title}</p>
      </div>
      {website.desktopSnapshot && (
        <img src={website.desktopSnapshot} alt="website screenshot" />
      )}
      <div className="flex flex-1 flex-col justify-between gap-2">
        <div className="flex flex-col gap-1">
          <p className="line-clamp-3 text-xs text-muted-foreground">
            {website.description}
          </p>
          <div className="flex flex-wrap gap-1">
            {website.tags.map((tag: string) => (
              <Badge className="px-1 py-0">{tag}</Badge>
            ))}
          </div>
        </div>
        <div>
          <span className="text-muted-foreground text-xs">
            Last reviewed at{' '}
            <span className="font-medium">{website.lastReviewAt}</span>
          </span>
        </div>
      </div>
    </a>
  );
}