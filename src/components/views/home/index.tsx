import { useState } from "react";
import { HomeHeader } from "./home-header";
import { QuickFilter, QuickFilterTabs } from "./quick-filter-tabs";
import { CategoryChips } from "../../category-chips";
import { useCategories, useLinks } from "@/lib/hooks";
import { LinkList } from "./link-list";

export const HomeView = () => {
  const { categories } = useCategories();
  const { links } = useLinks();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<QuickFilter | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filter: QuickFilter | null) => {
    setSelectedFilter(filter);
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="flex flex-col h-full">
      <HomeHeader onSearch={handleSearch} />
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
      />
    </div>
  );
};
