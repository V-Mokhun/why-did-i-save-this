import { ScrollArea } from "@/components/ui/scroll-area";
import { useLinks, useCategories } from "@/lib/hooks";
import { toast } from "sonner";
import { TrashedLinkItem } from "./trashed-link-item";
import { TrashHeader } from "./trash-header";
import { Input } from "@/components/ui/input";
import { Search, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState, useMemo } from "react";
import { CategoryChips } from "@/components/category-chips";

const PERMANENT_DELETE_DAYS = 30; // Configure as needed

export const TrashView = () => {
  const { trashedLinks, restoreFromTrash, deleteLink, emptyTrash } = useLinks();
  const { categories } = useCategories();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Get only categories that are used in trashed links
  const availableCategories = useMemo(() => {
    const usedCategoryIds = new Set(
      trashedLinks.flatMap((link) => link.categories || [])
    );
    return categories.filter((category) => usedCategoryIds.has(category.id));
  }, [trashedLinks, categories]);

  const handleRestore = async (url: string) => {
    await restoreFromTrash(url);
    toast.success("Link restored");
  };

  const handleDelete = async (url: string) => {
    await deleteLink(url);
    toast.success("Link permanently deleted");
  };

  const handleEmptyTrash = async () => {
    await emptyTrash();
    toast.success("Trash emptied");
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const filteredLinks = trashedLinks.filter((link) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        link.title.toLowerCase().includes(query) ||
        link.note.toLowerCase().includes(query) ||
        link.url.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Category filter
    if (selectedCategories.length > 0) {
      const hasSelectedCategory = selectedCategories.some((categoryId) =>
        link.categories?.includes(categoryId)
      );
      if (!hasSelectedCategory) return false;
    }

    return true;
  });

  return (
    <div className="flex flex-col h-full px-2">
      <TrashHeader
        hasItems={trashedLinks.length > 0}
        onEmptyTrash={handleEmptyTrash}
      />
      <Alert variant="destructive" className="mb-2">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Items in trash will be permanently deleted after{" "}
          {PERMANENT_DELETE_DAYS} days
        </AlertDescription>
      </Alert>
      {trashedLinks.length > 0 && (
        <>
          <div className="relative mb-2">
            <Search className="absolute left-4 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search in trash..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {availableCategories.length > 0 && (
            <CategoryChips
              categories={availableCategories}
              selectedCategories={selectedCategories}
              onCategoryToggle={handleCategoryToggle}
              showAddCategory={false}
              wrapperClassName="p-0"
            />
          )}
        </>
      )}
      {filteredLinks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-sm text-muted-foreground">
          <p>
            {searchQuery || selectedCategories.length > 0
              ? "No matching items found"
              : "Trash is empty"}
          </p>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="space-y-2 py-2">
            {filteredLinks.map((link) => (
              <TrashedLinkItem
                key={link.url}
                link={link}
                categories={categories}
                onRestore={handleRestore}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};
