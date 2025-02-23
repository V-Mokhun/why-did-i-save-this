import { useCallback, useState, useEffect } from "react";
import browser from "webextension-polyfill";
import { Category } from "../types";

const STORAGE_KEY = "categories";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);

  const getAllCategories = useCallback(async (): Promise<Category[]> => {
    try {
      const result = await browser.storage.local.get(STORAGE_KEY);
      return (result[STORAGE_KEY] || []) as Category[];
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }, []);

  // Load categories initially and keep them updated
  useEffect(() => {
    getAllCategories().then(setCategories);

    // Listen for storage changes
    const handleStorageChange = async (changes: { [key: string]: any }) => {
      if (changes[STORAGE_KEY]) {
        const newCategories = changes[STORAGE_KEY].newValue || [];
        setCategories(newCategories);
      }
    };

    browser.storage.onChanged.addListener(handleStorageChange);
    return () => {
      browser.storage.onChanged.removeListener(handleStorageChange);
    };
  }, [getAllCategories]);

  const saveCategory = useCallback(
    async (category: Category): Promise<Category[]> => {
      try {
        const currentCategories = await getAllCategories();
        const existingIndex = currentCategories.findIndex((c) => c.id === category.id);

        if (existingIndex !== -1) {
          currentCategories[existingIndex] = category;
        } else {
          currentCategories.push(category);
        }

        await browser.storage.local.set({ [STORAGE_KEY]: currentCategories });
        setCategories(currentCategories);
        return currentCategories;
      } catch (error) {
        console.error("Error saving category:", error);
        return categories; // Return current state instead of empty array
      }
    },
    [getAllCategories, categories]
  );

  const deleteCategory = useCallback(
    async (categoryId: string): Promise<boolean> => {
      try {
        const currentCategories = await getAllCategories();
        const filteredCategories = currentCategories.filter(
          (c) => c.id !== categoryId
        );
        await browser.storage.local.set({ [STORAGE_KEY]: filteredCategories });
        setCategories(filteredCategories);
        return true;
      } catch (error) {
        console.error("Error deleting category:", error);
        return false;
      }
    },
    [getAllCategories]
  );

  return {
    categories,
    getAllCategories,
    saveCategory,
    deleteCategory,
  };
}
