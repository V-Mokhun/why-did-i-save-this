import { useState } from "react";
import { HomeHeader } from "./home-header";
import { QuickFilter, QuickFilterTabs } from "./quick-filter-tabs";
import { CategoryChips } from "@/components/category-chips";
import { useCategories, useLinks, useReorder } from "@/lib/hooks";
import { LinkList } from "./link-list";
import { SavedLink } from "@/lib/types";
import { toast } from "sonner";

export const HomeView = () => {
  const { categories } = useCategories();
  const { links, batchUpdateLinks } = useLinks();
  const { isReordering, stopReordering } = useReorder();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<QuickFilter | null>(
    null
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (isReordering && query) {
      stopReordering();
    }
  };

  const handleFilterChange = (filter: QuickFilter | null) => {
    setSelectedFilter(filter);
    if (isReordering && filter && filter !== "pinned") {
      stopReordering();
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    const newSelectedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];

    setSelectedCategories(newSelectedCategories);

    if (isReordering && newSelectedCategories.length > 0) {
      stopReordering();
    }
  };

  const canReorder =
    !searchQuery &&
    (selectedFilter === null || selectedFilter === "pinned") &&
    selectedCategories.length === 0;

  const handleReorder = async (
    oldIndex: number,
    newIndex: number,
    items: SavedLink[]
  ) => {
    if (!canReorder) return;

    const newItems = [...items];
    const [movedItem] = newItems.splice(oldIndex, 1);
    newItems.splice(newIndex, 0, movedItem);

    const updates = newItems.map((link, index) => ({
      url: link.url,
      updates: { position: index },
    }));

    try {
      await batchUpdateLinks(updates);
    } catch (error) {
      console.error("Error reordering links:", error);
      toast.error("Failed to update positions");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <HomeHeader onSearch={handleSearch} canReorder={canReorder} />
      <QuickFilterTabs
        selectedFilter={selectedFilter}
        onFilterChange={handleFilterChange}
      />
      <CategoryChips
        categories={categories}
        selectedCategories={selectedCategories}
        onCategoryToggle={handleCategoryToggle}
      />
      <LinkList
        links={links}
        categories={categories}
        searchQuery={searchQuery}
        selectedFilter={selectedFilter}
        selectedCategories={selectedCategories}
        onReorder={handleReorder}
      />
    </div>
  );
};
