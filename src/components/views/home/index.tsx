import { useState } from "react";
import { HomeHeader } from "./home-header";
import { QuickFilter, QuickFilterTabs } from "./quick-filter-tabs";
import { CategoryChips } from "@/components/category-chips";
import {
  useCategories,
  useLinks,
  useReorder,
  useOnboarding,
} from "@/lib/hooks";
import { LinkList } from "./link-list";
import { SavedLink } from "@/lib/types";
import { toast } from "sonner";
import { Onboarding } from "@/components/onboarding";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SaveLinkView } from "@/components/views/save-link";

const EmptyState = () => {
  const [isSaveLinkDialogOpen, setIsSaveLinkDialogOpen] = useState(false);

  return (
    <>
      <Card className="mb-4 mx-2">
        <CardContent className="">
          <div className="flex flex-col items-center text-center space-y-4">
            <h2 className="text-xl font-semibold">No Links Yet</h2>
            <p className="text-muted-foreground">
              Start saving links to keep track of what matters to you.
            </p>
            <Button
              className="mt-2"
              onClick={() => setIsSaveLinkDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Save a Link
            </Button>
          </div>
        </CardContent>
      </Card>

      <SaveLinkView
        isOpen={isSaveLinkDialogOpen}
        setIsOpen={setIsSaveLinkDialogOpen}
      />
    </>
  );
};

export const HomeView = () => {
  const { categories } = useCategories();
  const { links, batchUpdateLinks } = useLinks();
  const { isReordering, stopReordering } = useReorder();
  const { hasSeenOnboarding } = useOnboarding();
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
      {links.length === 0 ? (
        hasSeenOnboarding ? (
          <EmptyState />
        ) : (
          <Onboarding />
        )
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};
