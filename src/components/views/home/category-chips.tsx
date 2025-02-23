import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Circle, Plus } from "lucide-react";
import { Category } from "@/lib/types";
import { useState } from "react";
import { CategoryManager } from "@/components/dialogs/category-manager";
import { useCategories } from "@/lib/hooks";
interface CategoryChipsProps {
  categories: Category[];
  selectedCategories: string[];
  onCategoryToggle: (categoryId: string) => void;
}

export const CategoryChips = ({
  categories,
  selectedCategories,
  onCategoryToggle,
}: CategoryChipsProps) => {
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const { saveCategory } = useCategories();

  if (categories.length === 0) return null;

  return (
    <ScrollArea className="w-full whitespace-nowrap mb-2">
      <div className="flex space-x-2 p-2">
        <CategoryManager
          isOpen={showCategoryManager}
          setIsOpen={setShowCategoryManager}
          onSaveCategory={saveCategory}
          trigger={
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCategoryManager(true)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          }
        />
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category.id);

          return (
            <Button
              key={category.id}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryToggle(category.id)}
            >
              <Circle
                className="h-3 w-3 mr-1 fill-current"
                style={{ color: category.color }}
              />
              {category.name}
            </Button>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
