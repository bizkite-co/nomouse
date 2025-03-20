import { Button } from "./ui/button.tsx";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog.tsx";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer.tsx";
import { Input } from "./ui/input.tsx";
import { Label } from "./ui/label.tsx";
import { Textarea } from "./ui/textarea.tsx";
import type { WebsiteData } from '../types.js';

export default function ModalSubmitNew({
  children,
  websiteData
}: {
  children: React.ReactNode;
  websiteData?: WebsiteData
}) {
  const title = "Submit a new website";
  const description = "Request us to list your website on this website";

  return (
    <>
      <Drawer>
        <DrawerTrigger className="block md:hidden">{children}</DrawerTrigger>
        <DrawerContent className="mx-2 max-h-[90%] min-h-[70%] px-4">
          <DrawerHeader className="px-0 text-left">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <div>
            <Label htmlFor="inputUrl">Website URL</Label>
            <Input id="inputUrl" name="url" placeholder="https://example.com" defaultValue={websiteData?.url} />
          </div>
          <div>
            <Label htmlFor="inputTitle">Title</Label>
            <Input id="inputTitle" name="title" placeholder="Example Website" defaultValue={websiteData?.title} />
          </div>
          <div>
            <Label htmlFor="inputTags">Tags (comma-separated)</Label>
            <Input id="inputTags" name="tags" placeholder="tag1, tag2, tag3" defaultValue={websiteData?.tags.join(', ')} />
          </div>
          <div>
            <Label htmlFor="inputDescription">Description</Label>
            <Textarea id="inputDescription" name="description" placeholder="Enter a brief description..." defaultValue={websiteData?.description} />
          </div>
          <DrawerFooter className="my-2 space-y-2 px-0">
            <DrawerClose asChild>
              <Button size="lg" variant="secondary">
                Cancel
              </Button>
            </DrawerClose>
            <Button size="lg">Submit</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Dialog>
        <DialogTrigger className="hidden md:block">{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader className="text-left">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div>
            <Label htmlFor="inputUrl">Website URL</Label>
            <Input id="inputUrl" name="url" placeholder="https://example.com" defaultValue={websiteData?.url} />
          </div>
          <div>
            <Label htmlFor="inputTitle">Title</Label>
            <Input id="inputTitle" name="title" placeholder="Example Website" defaultValue={websiteData?.title} />
          </div>
          <div>
            <Label htmlFor="inputTags">Tags (comma-separated)</Label>
            <Input id="inputTags" name="tags" placeholder="tag1, tag2, tag3" defaultValue={websiteData?.tags.join(', ')} />
          </div>
          <div>
            <Label htmlFor="inputDescription">Description</Label>
            <Textarea id="inputDescription" name="description" placeholder="Enter a brief description..." defaultValue={websiteData?.description} />
          </div>
          <DialogFooter className="flex items-center pt-1">
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
