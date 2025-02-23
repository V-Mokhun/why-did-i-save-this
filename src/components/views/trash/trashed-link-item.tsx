import { Button } from "@/components/ui/button";
import { Category, SavedLink } from "@/lib/types";
import { Undo2, Trash2, ExternalLink, Circle } from "lucide-react";
import browser from "webextension-polyfill";

interface TrashedLinkItemProps {
  link: SavedLink;
  categories: Category[];
  onRestore: (url: string) => Promise<void>;
  onDelete: (url: string) => Promise<void>;
}

export const TrashedLinkItem = ({
  link,
  categories,
  onRestore,
  onDelete,
}: TrashedLinkItemProps) => {
  const handleOpen = async () => {
    await browser.tabs.create({ url: link.url });
  };

  const linkCategories = categories.filter((category) =>
    link.categories?.includes(category.id)
  );

  return (
    <div className="flex items-start justify-between gap-2 p-2 rounded-sm bg-muted/50 group">
      <div
        className="flex-1 min-w-0 cursor-pointer hover:opacity-70"
        onClick={handleOpen}
      >
        <h3 className="font-medium text-sm truncate">{link.title}</h3>
        <p className="text-xs text-muted-foreground line-clamp-1">
          {link.note}
        </p>
        {linkCategories.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {linkCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-center gap-1 rounded-sm bg-muted px-1 py-0.5 text-[10px] text-muted-foreground"
              >
                <Circle
                  className="h-1.5 w-1.5 fill-current"
                  style={{ color: category.color }}
                />
                {category.name}
              </div>
            ))}
          </div>
        )}
        <time
          className="text-xs text-muted-foreground block mt-1"
          dateTime={link.deletedAt?.toString()}
        >
          Deleted{" "}
          {link.deletedAt ? new Date(link.deletedAt).toLocaleDateString() : ""}
        </time>
      </div>
      <div className="flex gap-1">
        <Button variant="ghost" size="sm" onClick={() => onRestore(link.url)}>
          <Undo2 className="h-4 w-4" />
          <span className="sr-only">Restore</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={handleOpen}>
          <ExternalLink className="h-4 w-4" />
          <span className="sr-only">Open Link</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive"
          onClick={() => onDelete(link.url)}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete Permanently</span>
        </Button>
      </div>
    </div>
  );
};
