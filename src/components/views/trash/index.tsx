import { CategoryChips } from "@/components/category-chips";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCategories, useLinks, useTrashSettings } from "@/lib/hooks";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { TrashHeader } from "./trash-header";
import { TrashedLinkItem } from "./trashed-link-item";
import { Trash2 } from "lucide-react";

interface TrashViewProps {
  onViewChange?: (view: "settings") => void;
}

export const TrashView = ({ onViewChange }: TrashViewProps) => {
  const { trashedLinks, restoreFromTrash, deleteLink, emptyTrash } = useLinks();
  const { categories } = useCategories();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { retentionDays, autoDeleteEnabled } = useTrashSettings();

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
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        link.title.toLowerCase().includes(query) ||
        link.note.toLowerCase().includes(query) ||
        link.url.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    if (selectedCategories.length > 0) {
      const hasSelectedCategory = selectedCategories.some((categoryId) =>
        link.categories?.includes(categoryId)
      );
      if (!hasSelectedCategory) return false;
    }

    return true;
  });

  return (
    <div className="flex flex-col h-full">
      <TrashHeader
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
        hasItems={trashedLinks.length > 0}
        onEmptyTrash={handleEmptyTrash}
        onViewChange={onViewChange}
      />

      {availableCategories.length > 0 && (
        <CategoryChips
          categories={availableCategories}
          selectedCategories={selectedCategories}
          onCategoryToggle={handleCategoryToggle}
        />
      )}

      {filteredLinks.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 p-8 text-center">
          <div className="bg-muted rounded-full p-3 mb-4">
            <Trash2 className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-medium mb-1">
            {searchQuery || selectedCategories.length > 0
              ? "No matching items found"
              : "Trash is empty"}
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            {autoDeleteEnabled
              ? `Links that haven't been accessed for ${retentionDays} days will automatically be moved here.`
              : "Enable auto-deleting in settings to automatically move inactive links here."}
          </p>
        </div>
      ) : (
        <ScrollArea className="flex-1 w-full">
          <div className="space-y-2 py-2">
            {filteredLinks.map((link) => (
              <TrashedLinkItem
                key={link.url}
                link={link}
                categories={categories}
                onRestore={() => handleRestore(link.url)}
                onDelete={() => handleDelete(link.url)}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};
