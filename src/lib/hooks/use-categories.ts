import { useCallback } from "react";
import { Category } from "../types";
import { useStorage } from "./use-storage";

export const CATEGORIES_KEY = "categories";

export function useCategories() {
  const [categories, setCategories] = useStorage<Category[]>(
    CATEGORIES_KEY,
    []
  );

  const saveCategory = useCallback(
    async (category: Category): Promise<Category[]> => {
      try {
        const existingIndex = categories.findIndex((c) => c.id === category.id);
        const updatedCategories = [...categories];

        if (existingIndex !== -1) {
          updatedCategories[existingIndex] = category;
        } else {
          updatedCategories.push(category);
        }

        setCategories(updatedCategories);
        return updatedCategories;
      } catch (error) {
        console.error("Error saving category:", error);
        return categories;
      }
    },
    [categories, setCategories]
  );

  const deleteCategory = useCallback(
    async (categoryId: string): Promise<boolean> => {
      try {
        const filteredCategories = categories.filter(
          (c) => c.id !== categoryId
        );
        setCategories(filteredCategories);
        return true;
      } catch (error) {
        console.error("Error deleting category:", error);
        return false;
      }
    },
    [categories, setCategories]
  );

  return {
    categories,
    saveCategory,
    deleteCategory,
  };
}
