import { Card, CardContent } from "@/components/ui/card";
import { Category, SavedLink } from "@/lib/types";
import { Circle } from "lucide-react";

interface LinkCardProps {
  link: SavedLink;
  categories: Category[];
}

export const LinkCard = ({ link, categories }: LinkCardProps) => {
  const linkCategories = categories.filter((category) =>
    link.categories?.includes(category.id)
  );

  return (
    <Card className="group relative py-0 rounded-sm">
      <CardContent className="p-2 space-y-1">
        <h3
          className="font-medium leading-tight text-sm truncate"
          title={link.title}
        >
          {link.title}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {link.note}
        </p>
        {/* <div className="flex items-center gap-1"> */}
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
        {/* <time
            className="text-xs text-muted-foreground"
            dateTime={link.timestamp.toString()}
          >
            {Intl.DateTimeFormat(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            }).format(link.timestamp)}
          </time>
        </div> */}
      </CardContent>
    </Card>
  );
};
