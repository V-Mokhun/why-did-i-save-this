import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Category } from "@/lib/types";
import * as Icons from "lucide-react";

interface CategorySelectorProps {
  categories: Category[];
  selectedCategories: string[];
  onSelect: (categoryIds: string[]) => void;
}

export function CategorySelector({
  categories,
  selectedCategories,
  onSelect,
}: CategorySelectorProps) {
  const [open, setOpen] = useState(false);

  const toggleCategory = (categoryId: string) => {
    const newSelection = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];
    onSelect(newSelection);
  };

  const getCategoryIcon = (category: Category) => {
    if (!category.icon) return null;
    const IconComponent = Icons[
      category.icon as keyof typeof Icons
    ] as React.ElementType;
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-gray-700 border-0 text-white hover:bg-gray-600"
          >
            <span className="truncate">
              {selectedCategories.length === 0
                ? "Select categories..."
                : `${selectedCategories.length} selected`}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-gray-700 border-gray-600">
          <Command className="bg-transparent">
            <CommandInput
              placeholder="Search categories..."
              className="text-white"
            />
            <CommandList>
              <CommandEmpty className="text-gray-400 p-2">
                No categories found.
              </CommandEmpty>
              <CommandGroup className="max-h-[200px] overflow-auto">
                {categories.map((category) => (
                  <CommandItem
                    key={category.id}
                    value={category.name}
                    onSelect={() => toggleCategory(category.id)}
                    className={cn(
                      "text-white hover:bg-gray-600 relative",
                      category.color && "hover:bg-opacity-90"
                    )}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCategories.includes(category.id)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {category.icon && (
                      <span className="mr-2">{getCategoryIcon(category)}</span>
                    )}
                    {category.name}
                    {category.color && (
                      <div
                        className="absolute bottom-0 left-8 right-4 h-0.5 opacity-50"
                        style={{ backgroundColor: category.color }}
                      />
                    )}
                  </CommandItem>
                ))}
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
            return (
              <div
                key={category.id}
                className="group flex items-center gap-1.5 relative cursor-pointer py-0.5"
                onClick={() => toggleCategory(category.id)}
              >
                {category.icon && (
                  <span className="text-gray-300">
                    {getCategoryIcon(category)}
                  </span>
                )}
                <span className="text-sm text-gray-300">{category.name}</span>
                {category.color && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5 opacity-50 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: category.color }}
                  />
                )}
                <X className="h-3 w-3 text-gray-400 hover:text-gray-300 transition-colors" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
