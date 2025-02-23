import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Category } from "@/lib/types";
import * as Icons from "lucide-react";
import { ChevronsUpDown, Plus, X } from "lucide-react";
import { useState } from "react";
import { CategoryManager } from "@/components/dialogs/category-manager";
import { useCategories } from "@/lib/hooks";

interface CategorySelectorProps {
  categories: Category[];
  selectedCategories: string[];
  onSelect: (categories: string[]) => void;
}

export function CategorySelector({
  categories,
  selectedCategories,
  onSelect,
}: CategorySelectorProps) {
  const [open, setOpen] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const { saveCategory } = useCategories();

  const toggleCategory = (categoryId: string) => {
    onSelect(
      selectedCategories.includes(categoryId)
        ? selectedCategories.filter((id) => id !== categoryId)
        : [...selectedCategories, categoryId]
    );
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <span className="truncate">
              {selectedCategories.length === 0
                ? "Select categories..."
                : `${selectedCategories.length} selected`}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command className="rounded-lg border shadow-md">
            <CommandInput placeholder="Search categories..." />
            <CommandList className="max-h-[200px]">
              <CommandGroup>
                <CategoryManager
                  isOpen={showCategoryManager}
                  setIsOpen={setShowCategoryManager}
                  onSaveCategory={saveCategory}
                  categoryToEdit={categoryToEdit}
                  trigger={
                    <CommandItem
                      onSelect={() => {
                        setCategoryToEdit(null);
                        setShowCategoryManager(true);
                      }}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                      Create new category
                    </CommandItem>
                  }
                />
                <CommandSeparator className="my-1" />
                {categories.length === 0 ? (
                  <CommandEmpty>No categories found.</CommandEmpty>
                ) : (
                  categories.map((category) => {
                    const IconComponent = category.icon
                      ? (Icons[
                          category.icon as keyof typeof Icons
                        ] as React.ElementType)
                      : null;

                    return (
                      <CommandItem
                        key={category.id}
                        onSelect={() => toggleCategory(category.id)}
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <div
                          className={`flex items-center justify-center w-4 h-4 rounded ${
                            selectedCategories.includes(category.id)
                              ? "bg-primary"
                              : "border"
                          }`}
                        >
                          {selectedCategories.includes(category.id) && (
                            <Icons.Check className="h-2 w-2 text-primary-foreground" />
                          )}
                        </div>
                        {IconComponent && (
                          <IconComponent
                            className="h-4 w-4"
                            style={
                              category.color
                                ? { color: category.color }
                                : undefined
                            }
                          />
                        )}
                        {category.name}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCategoryToEdit(category);
                            setShowCategoryManager(true);
                          }}
                          className="ml-auto opacity-0 group-hover:opacity-100 w-4 h-4 border border-accent hover:bg-accent rounded flex items-center justify-center"
                        >
                          <Icons.Pencil className="h-2 w-2" />
                        </button>
                      </CommandItem>
                    );
                  })
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCategories.map((categoryId) => {
            const category = categories.find((c) => c.id === categoryId);
            if (!category) return null;
            const IconComponent = category.icon
              ? (Icons[
                  category.icon as keyof typeof Icons
                ] as React.ElementType)
              : null;
            return (
              <button
                type="button"
                key={category.id}
                className="inline-flex items-center gap-1.5 bg-accent px-2 py-1 rounded-md cursor-pointer"
                onClick={() => toggleCategory(category.id)}
              >
                {IconComponent && (
                  <IconComponent
                    className="h-4 w-4"
                    style={
                      category.color ? { color: category.color } : undefined
                    }
                  />
                )}
                <span className="text-sm">{category.name}</span>
                <X className="h-3 w-3 opacity-60 hover:opacity-100" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
