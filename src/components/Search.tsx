// Modified by Roo to fix search functionality.  Do not overwrite.
import { Button } from "./ui/button.tsx";
import { Input } from "./ui/input.tsx";
import { cn } from "../lib/utils.ts";
import { searchKeyword } from "../store.ts";
import { Search as SearchIcon, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function Search({ className, "data-search-query": initialSearchQuery }: { className?: string, "data-search-query"?: string }) {
  console.log("Rendering Search component");
  console.log("initialSearchQuery:", initialSearchQuery);
  const [search, setSearch] = useState(initialSearchQuery || "");
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setIsDark(isDark);
  }, []);

  const onSearch = () => {
    // Dispatch a custom event with the search term
    const searchEvent = new CustomEvent('search-updated', {
      detail: { searchTerm: search },
    });
    document.dispatchEvent(searchEvent);
  };

  const onClickSearch = () => {
    onSearch();
  };

  const onClear = () => {
    if (search !== "") setSearch("");
    searchKeyword.set(""); // Still clear the store
     const searchEvent = new CustomEvent('search-updated', {
      detail: { searchTerm: "" },
    });
    document.dispatchEvent(searchEvent);
  };

  return (
    <div
      className={cn(
        "flex w-full items-center justify-center gap-2 md:gap-4",
        className,
      )}
      data-test-search-container
    >
      <div className={cn("relative flex w-full")}>
        <Input
          placeholder="Enter something..."
          value={search}
          className="h-12 w-full bg-background pl-12 text-sm shadow-lg md:h-16 md:text-lg"
          onChange={(e) => setSearch(e.target.value)}
          onKeyUp={(event) => {
            if (event.key === "Enter" || event.keyCode === 13) {
              onSearch();
            }
          }}
          onBlur={onSearch}
          data-testid="search-input"
        />
        <a
          onClick={onClear}
          className={cn(
            "absolute right-4 top-1 z-10 translate-y-[50%] md:top-2",
            "cursor-pointer text-muted-foreground opacity-0 transition-all",
            search !== "" && "opacity-100",
          )}
        >
          <XCircle className="size-5 md:size-6" />
        </a>
        <SearchIcon
          className={cn(
            "absolute left-4 top-1 translate-y-[50%] md:top-2",
            "size-5 cursor-pointer text-muted-foreground/20 md:size-6",
          )}
        />
      </div>
      <Button
        variant={isDark ? "secondary" : "default"}
        className={cn(
          "h-12 w-32 text-sm font-light shadow-lg md:h-16 md:text-lg",
        )}
        onClick={() => onClickSearch()}
      >
        Search
      </Button>
    </div>
  );
}
