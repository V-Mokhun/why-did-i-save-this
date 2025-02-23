import * as React from "react";
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
  const [open, setOpen] = React.useState(false);

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
          <Command>
            <CommandInput placeholder="Search categories..." />
            <CommandList>
              <CommandEmpty>No categories found.</CommandEmpty>
              <CommandGroup>
                {categories.map((category) => (
                  <CommandItem
                    key={category.id}
                    value={category.name}
                    onSelect={() => toggleCategory(category.id)}
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
                    <span>{category.name}</span>
                    {category.color && (
                      <div
                        className="ml-auto w-3 h-3 rounded-full opacity-50"
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
                className="flex items-center gap-1.5 cursor-pointer"
                onClick={() => toggleCategory(category.id)}
              >
                {category.icon && (
                  <span>{getCategoryIcon(category)}</span>
                )}
                <span className="text-sm">{category.name}</span>
                <X className="h-3 w-3" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
