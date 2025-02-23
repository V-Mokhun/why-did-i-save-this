import { useCallback } from "react";
import browser from "webextension-polyfill";
import { Category } from "../types";

const STORAGE_KEY = "categories";

export function useCategories() {
  const getAllCategories = useCallback(async (): Promise<Category[]> => {
    try {
      const result = await browser.storage.local.get(STORAGE_KEY);
      return (result[STORAGE_KEY] || []) as Category[];
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }, []);

  const saveCategory = useCallback(
    async (category: Category): Promise<Category[]> => {
      try {
        const categories = await getAllCategories();
        const existingIndex = categories.findIndex((c) => c.id === category.id);

        if (existingIndex !== -1) {
          categories[existingIndex] = category;
        } else {
          categories.push(category);
        }

        await browser.storage.local.set({ [STORAGE_KEY]: categories });
        return categories;
      } catch (error) {
        console.error("Error saving category:", error);
        return [];
      }
    },
    []
  );

  const deleteCategory = useCallback(
    async (categoryId: string): Promise<boolean> => {
      try {
        const categories = await getAllCategories();
        const filteredCategories = categories.filter(
          (c) => c.id !== categoryId
        );
        await browser.storage.local.set({ [STORAGE_KEY]: filteredCategories });
        return true;
      } catch (error) {
        console.error("Error deleting category:", error);
        return false;
      }
    },
    []
  );

  return {
    getAllCategories,
    saveCategory,
    deleteCategory,
  };
}
