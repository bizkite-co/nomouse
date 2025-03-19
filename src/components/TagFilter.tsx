import { getCollection } from 'astro:content';
import { cn } from "../lib/utils.js";
import { filteredTags } from "../store.ts";
import { useStore } from "@nanostores/react";
import { X } from "lucide-react";
import { useMemo } from "react";
import { Button } from "./ui/button.js";

interface WebsiteData {
  url: string;
  title: string;
  tags: string[];
  favicon?: string;
  description?: string;
}

interface WebsiteEntry {
  data: WebsiteData;
}

export default function TagFilter() {
  const selectedTags: string[] = useStore(filteredTags);

  const { tags } = useMemo(() => {
    let allTags = new Set<string>();
    getCollection('websites').then((websites: WebsiteEntry[]) => {
      websites.forEach((website: WebsiteEntry) => {
        website.data.tags.forEach((tag: string) => allTags.add(tag));
      });
    });
    return { tags: Array.from(allTags).sort() };
  }, []);

  return (
    <div
      className={cn(
        "container mx-auto p-4 md:px-0 md:py-8",
        "flex flex-wrap items-center justify-center gap-1",
      )}
    >
      {tags.map((tag) => {
        const selected = selectedTags.includes(tag);
        return (
          <Button
            key={tag}
            size="sm"
            variant={selected ? "default" : "outline"}
            onClick={() =>
              filteredTags.set(
                selected
                  ? selectedTags.filter((e) => e !== tag)
                  : [...selectedTags, tag],
              )
            }
            className={cn(
              "flex cursor-pointer items-center gap-2 transition-all",
            )}
          >
            {tag} {selected && <X size={12} />}
          </Button>
        );
      })}
    </div>
  );
}