import { ModeToggle } from "./ModeToggle.tsx";
import { Button, buttonVariants } from "./ui/button.tsx";
import { Separator } from "./ui/separator.tsx";
import { cn } from "../lib/utils.ts";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip.tsx";
import ModalSubmitNew from "./ModalSubmitNew.tsx";

export default function Navbar() {
  return (
    <TooltipProvider>
      <div
        className={cn(
          "sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-8"
        )}
      >
        <div className="border-b">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <a href="/" className="flex items-center gap-2 mr-6">
                <img src="/favicon.svg" alt="Logo" className="h-6 w-6" />
                <p className="font-heading text-xl">textnav</p>
              </a>
            </div>
            <div className="flex items-center gap-4">
              <ModalSubmitNew>
                <Button>Submit a website</Button>
              </ModalSubmitNew>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <a
                    href="https://github.com/bizkite-co/textnav"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonVariants({ variant: "ghost", size: "icon" })}
                  >
                    <img
                      src="/github-mark.svg"
                      alt="GitHub"
                      className="h-6 w-6"
                    />
                    <span className="sr-only">GitHub</span>
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View on GitHub</p>
                </TooltipContent>
              </Tooltip>
              <Separator orientation="vertical" className="h-6" />
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
