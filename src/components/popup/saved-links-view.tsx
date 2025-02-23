import * as React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Category, SavedLink } from "@/lib/types";
import { ChevronDown, ChevronRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import * as Icons from "lucide-react";
import browser from "webextension-polyfill";
import { toast } from "sonner";

interface SavedLinksViewProps {
  links: SavedLink[];
  categories: Category[];
}

export function SavedLinksView({ links, categories }: SavedLinksViewProps) {
  const [expandedCategories, setExpandedCategories] = React.useState<string[]>(
    []
  );

  const linksByCategory = React.useMemo(() => {
    const categorized = new Map<string, SavedLink[]>();

    // Initialize with all categories
    categories.forEach((cat) => {
      categorized.set(cat.id, []);
    });

    // Add uncategorized group
    categorized.set("uncategorized", []);

    // Sort links into categories
    links.forEach((link) => {
      if (!link.categories?.length) {
        categorized.get("uncategorized")?.push(link);
      } else {
        link.categories.forEach((catId) => {
          const categoryLinks = categorized.get(catId) || [];
          categoryLinks.push(link);
          categorized.set(catId, categoryLinks);
        });
      }
    });

    return categorized;
  }, [links, categories]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const getCategoryIcon = (category: Category) => {
    if (!category.icon) return null;
    const IconComponent = Icons[
      category.icon as keyof typeof Icons
    ] as React.ElementType;
    return <IconComponent className="h-4 w-4" />;
  };

  const openLink = async (url: string) => {
    try {
      await browser.tabs.create({ url });
    } catch (error) {
      toast.error("Error opening link");
    }
  };

  return (
    <ScrollArea className="h-[400px]">
      {Array.from(linksByCategory.entries()).map(
        ([categoryId, categoryLinks]) => {
          if (categoryLinks.length === 0) return null;

          const category = categories.find((c) => c.id === categoryId);
          const isExpanded = expandedCategories.includes(categoryId);

          return (
            <div key={categoryId} className="mb-2">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 p-2"
                onClick={() => toggleCategory(categoryId)}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                {category ? (
                  <>
                    {category.icon && (
                      <span className="mr-2">{getCategoryIcon(category)}</span>
                    )}
                    {category.name}
                  </>
                ) : (
                  "Uncategorized"
                )}
                <span className="ml-auto text-sm text-muted-foreground">
                  {categoryLinks.length}
                </span>
              </Button>

              <div
                className={cn(
                  "grid grid-rows-[0fr] transition-all duration-200",
                  isExpanded && "grid-rows-[1fr]"
                )}
              >
                <div className="overflow-hidden">
                  {categoryLinks.map((link) => (
                    <Button
                      key={link.url}
                      variant="ghost"
                      onClick={() => openLink(link.url)}
                      className="flex items-start gap-2 px-8 py-2 hover:bg-accent"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{link.title}</h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {link.note}
                        </p>
                      </div>
                      <ExternalLink className="h-8 w-8 shrink-0" />
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          );
        }
      )}
    </ScrollArea>
  );
}
