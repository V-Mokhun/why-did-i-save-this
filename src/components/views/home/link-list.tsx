import { ScrollArea } from "@/components/ui/scroll-area";
import { Category, SavedLink } from "@/lib/types";
import { LinkCard } from "./link-card";
import { QuickFilter } from "./quick-filter-tabs";
import { useLinks } from "@/lib/hooks";
import { useState } from "react";
import { SaveLinkView } from "../save-link";

interface LinkListProps {
  links: SavedLink[];
  categories: Category[];
  searchQuery: string;
  selectedFilter: QuickFilter | null;
  selectedCategories: string[];
}

export const LinkList = ({
  links,
  categories,
  searchQuery,
  selectedFilter,
  selectedCategories,
}: LinkListProps) => {
  const { updateLink, deleteLink } = useLinks();
  const [editingLink, setEditingLink] = useState<SavedLink | null>(null);

  const handlePin = async (link: SavedLink) => {
    await updateLink(link.url, { isPinned: !link.isPinned });
  };

  const handleEdit = (link: SavedLink) => {
    setEditingLink(link);
  };

  const handleDelete = async (link: SavedLink) => {
    await deleteLink(link.url);
  };

  const filteredLinks = links.filter((link) => {
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

    // Quick filter
    // TODO: Implement quick filter logic when the data model supports it

    return true;
  });

  if (filteredLinks.length === 0) {
    return (
      <div className="flex items-center justify-center h-[100px] text-sm text-muted-foreground">
        <p>No links found</p>
      </div>
    );
  }

  return (
    <>
      <ScrollArea className="flex-1 px-2">
        <div className="grid grid-cols-2 gap-2 pb-2">
          {filteredLinks.map((link) => (
            <LinkCard
              key={link.url}
              link={link}
              categories={categories}
              onPin={handlePin}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </ScrollArea>
      <SaveLinkView
        isOpen={!!editingLink}
        setIsOpen={() => setEditingLink(null)}
        editingLink={editingLink}
      />
    </>
  );
};
