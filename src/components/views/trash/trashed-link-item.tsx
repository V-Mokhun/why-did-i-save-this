import { LinkAction } from "@/components/shared/link-actions";
import { LinkCard } from "@/components/shared/link-card";
import { Button } from "@/components/ui/button";
import { Category, SavedLink } from "@/lib/types";
import { ExternalLink, Trash2, Undo2 } from "lucide-react";
import browser from "webextension-polyfill";

interface TrashedLinkItemProps {
  link: SavedLink;
  categories: Category[];
  onRestore: () => Promise<void>;
  onDelete: () => Promise<void>;
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

  const getLinkActions = (): LinkAction[] => [
    {
      label: "Restore",
      icon: <Undo2 className="mr-2 h-4 w-4" />,
      onClick: () => onRestore(),
    },
    {
      label: "Open link",
      icon: <ExternalLink className="mr-2 h-4 w-4" />,
      onClick: () => handleOpen(),
    },
    {
      label: "Delete permanently",
      icon: <Trash2 className="mr-2 h-4 w-4" />,
      onClick: () => onDelete(),
      className: "text-destructive",
    },
  ];

  return (
    <LinkCard
      link={link}
      categories={categories}
      renderActions={(link) => (
        <div className="flex items-center gap-2">
          {getLinkActions().map((action) => (
            <Button
              key={action.label}
              onClick={(e) => {
                e.stopPropagation();
                action.onClick(link);
              }}
              className={`${action.className} cursor-pointer`}
              title={action.label}
              variant="ghost"
              size="icon-xs"
            >
              {action.icon}
            </Button>
          ))}
        </div>
      )}
      className="bg-muted/50"
    >
      {link.deletedAt && (
        <div className="text-xs text-muted-foreground mt-1">
          Deleted {new Date(link.deletedAt).toLocaleDateString()}
        </div>
      )}
    </LinkCard>
  );
};
