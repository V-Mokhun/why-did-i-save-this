import { Card, CardContent } from "@/components/ui/card";
import { Category, SavedLink } from "@/lib/types";
import { Circle } from "lucide-react";
import browser from "webextension-polyfill";

export interface LinkCardProps {
  link: SavedLink;
  categories: Category[];
  onOpen?: () => void;
  renderActions?: (link: SavedLink) => React.ReactNode;
  renderBadges?: (link: SavedLink) => React.ReactNode;
  className?: string;
}

export const LinkCard = ({
  link,
  categories,
  onOpen,
  renderActions,
  renderBadges,
  className = "",
}: LinkCardProps) => {
  const linkCategories = categories.filter((category) =>
    link.categories?.includes(category.id)
  );

  const handleOpen = async () => {
    onOpen?.();
    await browser.tabs.create({ url: link.url });
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleOpen();
  };

  return (
    <Card
      className={`group relative rounded-sm hover:bg-accent py-0 cursor-pointer ${className}`}
      onClick={handleClick}
    >
      <CardContent className="p-2 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h3
            className="font-medium leading-tight text-sm truncate cursor-pointer hover:underline flex-1 min-w-0"
            title={link.title}
          >
            {link.title}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            {renderBadges?.(link)}
            {renderActions?.(link)}
          </div>
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
  );
};
