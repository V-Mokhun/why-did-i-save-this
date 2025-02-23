import { Card, CardContent } from "@/components/ui/card";
import { Category, SavedLink } from "@/lib/types";
import { Circle, Pin } from "lucide-react";
import { LinkContextMenu } from "./link-context-menu";
import browser from "webextension-polyfill";

interface LinkCardProps {
  link: SavedLink;
  categories: Category[];
  onPin: (link: SavedLink) => void;
  onEdit: (link: SavedLink) => void;
  onDelete: (link: SavedLink) => void;
  onOpen: () => void;
}

export const LinkCard = ({
  link,
  categories,
  onPin,
  onEdit,
  onDelete,
  onOpen,
}: LinkCardProps) => {
  const linkCategories = categories.filter((category) =>
    link.categories?.includes(category.id)
  );

  const handleOpen = async () => {
    onOpen();
    await browser.tabs.create({ url: link.url });
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleOpen();
  };

  return (
    <LinkContextMenu
      link={link}
      onPin={() => onPin?.(link)}
      onEdit={() => onEdit?.(link)}
      onDelete={() => onDelete?.(link)}
      onOpen={handleOpen}
    >
      <Card
        className="group relative py-0 rounded-sm hover:bg-accent cursor-pointer"
        onClick={handleClick}
      >
        <CardContent className="p-2 space-y-1">
          <div className="flex items-start gap-1">
            {link.isPinned && (
              <Pin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            )}
            <h3
              className="font-medium leading-tight text-sm truncate"
              title={link.title}
            >
              {link.title}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {link.note}
          </p>
          {linkCategories.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {linkCategories.slice(0, 2).map((category) => (
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
              {linkCategories.length > 2 && (
                <span className="text-[10px] text-muted-foreground">
                  +{linkCategories.length - 2}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </LinkContextMenu>
  );
};
