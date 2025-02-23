import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Category } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCategories } from "@/lib/hooks";

interface CategoryManagerProps {
  categoryToEdit?: Category | null;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSaveCategory: (category: Category) => void;
  trigger?: React.ReactNode;
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
  "Activity",
  "Dumbbell",
];

export function CategoryManager({
  categoryToEdit,
  isOpen,
  setIsOpen,
  onSaveCategory,
  trigger,
}: CategoryManagerProps) {
  const [name, setName] = useState(categoryToEdit?.name || "");
  const [color, setColor] = useState<string | undefined>(categoryToEdit?.color);
  const [icon, setIcon] = useState<string | undefined>(categoryToEdit?.icon);
  const [error, setError] = useState("");
  const { categories } = useCategories();

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name);
      setColor(categoryToEdit.color);
      setIcon(categoryToEdit.icon);
    }
  }, [categoryToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setError("");

    if (!name.trim()) {
      setError("Category name is required");
      return;
    }

    const duplicateName = categories.find(
      (c) =>
        c.name.toLowerCase() === name.trim().toLowerCase() &&
        c.id !== categoryToEdit?.id
    );

    if (duplicateName) {
      setError("Category name already exists");
      return;
    }

    const updatedCategory: Category = {
      id: categoryToEdit?.id || crypto.randomUUID(),
      name: name.trim(),
      ...(color && { color }),
      ...(icon && { icon }),
    };

    onSaveCategory(updatedCategory);
    handleClose();
  };

  const handleClose = () => {
    setName("");
    setColor(undefined);
    setIcon(undefined);
    setError("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            {categoryToEdit ? "Edit Category" : "Add Category"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        closeButtonClassName="top-2 right-2"
        onCloseButtonClick={handleClose}
        className="max-w-[350px] max-h-[450px] p-0"
      >
        <DialogHeader className="px-4 py-2 border-b">
          <DialogTitle>
            {categoryToEdit ? "Edit Category" : "Create New Category"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <ScrollArea className="h-full max-h-[300px]">
            <div className="px-4 py-2 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="categoryName">
                  Category Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="categoryName"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter category name"
                  aria-invalid={!!error}
                />
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>

              <div className="space-y-2">
                <Label>Icon (Optional)</Label>
                <div className="grid grid-cols-6 gap-2 p-1">
                  <button
                    type="button"
                    className={`aspect-square rounded flex items-center justify-center border ${
                      !icon ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setIcon(undefined)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                  {PRESET_ICONS.map((iconName) => {
                    const Icon = Icons[
                      iconName as keyof typeof Icons
                    ] as React.ElementType;
                    return (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => setIcon(iconName)}
                        className={`aspect-square rounded flex items-center justify-center border hover:bg-accent ${
                          icon === iconName ? "ring-2 ring-primary" : ""
                        }`}
                        title={iconName}
                      >
                        <Icon className="h-4 w-4" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Color (Optional)</Label>
                <div className="grid grid-cols-6 gap-2">
                  <button
                    type="button"
                    className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                      !color ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setColor(undefined)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                  {PRESET_COLORS.map((presetColor) => (
                    <button
                      key={presetColor}
                      type="button"
                      className={`w-8 h-8 rounded-full border ${
                        color === presetColor ? "ring-2 ring-primary" : ""
                      }`}
                      style={{ backgroundColor: presetColor }}
                      onClick={() => setColor(presetColor)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="flex justify-end gap-2 border-t px-4 py-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              {categoryToEdit ? "Save" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
