import { useCallback, useState, useEffect } from "react";
import browser from "webextension-polyfill";
import { SavedLink } from "../types";

const STORAGE_KEY = "saved_links";

export function useLinks() {
  const [links, setLinks] = useState<SavedLink[]>([]);

  const getAllLinks = useCallback(async (): Promise<SavedLink[]> => {
    try {
      const result = await browser.storage.local.get(STORAGE_KEY);
      const links = (result[STORAGE_KEY] || []) as SavedLink[];
      return links;
    } catch (error) {
      console.error("Error fetching links:", error);
      return [];
    }
  }, []);

  // Load links initially and keep them updated
  useEffect(() => {
    getAllLinks().then(setLinks);

    // Listen for storage changes
    const handleStorageChange = async (changes: { [key: string]: any }) => {
      if (changes[STORAGE_KEY]) {
        const newLinks = changes[STORAGE_KEY].newValue || [];
        setLinks(newLinks);
      }
    };

    browser.storage.onChanged.addListener(handleStorageChange);
    return () => {
      browser.storage.onChanged.removeListener(handleStorageChange);
    };
  }, [getAllLinks]);

  const saveLink = useCallback(
    async (
      note: SavedLink,
      onDuplicateFound?: () => Promise<boolean>
    ): Promise<boolean> => {
      try {
        const currentLinks = await getAllLinks();
        const existingIndex = currentLinks.findIndex((link) => link.url === note.url);

        if (existingIndex !== -1) {
          if (onDuplicateFound) {
            const shouldUpdate = await onDuplicateFound();
            if (!shouldUpdate) {
              return false;
            }
          }
          currentLinks[existingIndex] = note;
        } else {
          currentLinks.push(note);
        }

        await browser.storage.local.set({ [STORAGE_KEY]: currentLinks });
        setLinks(currentLinks);
        return true;
      } catch (error) {
        console.error("Error saving link:", error);
        return false;
      }
    },
    [getAllLinks]
  );

  const deleteLink = useCallback(async (url: string): Promise<boolean> => {
    try {
      const currentLinks = await getAllLinks();
      const filteredLinks = currentLinks.filter((link) => link.url !== url);
      await browser.storage.local.set({ [STORAGE_KEY]: filteredLinks });
      setLinks(filteredLinks);
      return true;
    } catch (error) {
      console.error("Error deleting link:", error);
      return false;
    }
  }, [getAllLinks]);

  const getLinkByUrl = useCallback(
    async (url: string): Promise<SavedLink | undefined> => {
      try {
        const currentLinks = await getAllLinks();
        return currentLinks.find((link) => link.url === url);
      } catch (error) {
        console.error("Error fetching link:", error);
        return undefined;
      }
    },
    [getAllLinks]
  );

  return {
    links,
    getAllLinks,
    saveLink,
    deleteLink,
    getLinkByUrl,
  };
}
