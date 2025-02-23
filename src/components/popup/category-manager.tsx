import { useState } from "react";
import { Plus, X } from "lucide-react";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Category } from "@/lib/types";

interface CategoryManagerProps {
  onSaveCategory: (category: Category) => Promise<void>;
}

const PRESET_COLORS = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#84cc16",
  "#10b981",
  "#06b6d4",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
];

const PRESET_ICONS: (keyof typeof Icons)[] = [
  "Bookmark",
  "Book",
  "Code",
  "Coffee",
  "Film",
  "Folder",
  "Heart",
  "Image",
  "Link",
  "Music",
  "Package",
  "ShoppingBag",
  "Star",
  "Video",
  "Zap",
];

export function CategoryManager({ onSaveCategory }: CategoryManagerProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState<string | undefined>(undefined);
  const [icon, setIcon] = useState<string | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: name.trim(),
      ...(color && { color }),
      ...(icon && { icon }),
    };

    await onSaveCategory(newCategory);
    setName("");
    setColor(undefined);
    setIcon(undefined);
    setIsOpen(false);
  };

  const filteredIcons = PRESET_ICONS.filter(iconName =>
    iconName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-gray-400 hover:text-white bg-gray-700 border-0"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Category
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-gray-700 border-gray-600">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-gray-400">Category Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
              className="bg-gray-600 border-0 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-gray-400">Icon (Optional)</Label>
            <Input
              type="text"
              placeholder="Search icons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-600 border-0 text-white mb-2"
            />
            <div className="grid grid-cols-6 gap-2 max-h-[200px] overflow-y-auto p-1">
              <button
                type="button"
                className={`aspect-square rounded flex items-center justify-center bg-gray-600 ${
                  !icon ? "ring-2 ring-white" : ""
                }`}
                onClick={() => setIcon(undefined)}
              >
                <X className="h-4 w-4 text-white" />
              </button>
              {filteredIcons.map((iconName) => {
                const Icon = Icons[
                  iconName as keyof typeof Icons
                ] as React.ElementType;
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setIcon(iconName)}
                    className={`aspect-square rounded flex flex-col items-center justify-center p-1 hover:bg-gray-600 ${
                      icon === iconName ? "ring-2 ring-white bg-gray-600" : ""
                    }`}
                    title={iconName}
                  >
                    <Icon className="h-4 w-4 text-white" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-gray-400">Color (Optional)</Label>
            <div className="grid grid-cols-6 gap-2">
              <button
                type="button"
                className={`w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center ${
                  !color ? "ring-2 ring-white" : ""
                }`}
                onClick={() => setColor(undefined)}
              >
                <X className="h-4 w-4 text-white" />
              </button>
              {PRESET_COLORS.map((presetColor) => (
                <button
                  key={presetColor}
                  type="button"
                  className={`w-6 h-6 rounded-full ${
                    color === presetColor ? "ring-2 ring-white" : ""
                  }`}
                  style={{ backgroundColor: presetColor }}
                  onClick={() => setColor(presetColor)}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={!name.trim()}>
              Save Category
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
