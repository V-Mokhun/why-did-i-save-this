import { useCallback } from "react";
import browser from "webextension-polyfill";
import { SavedLink } from "../types";

const STORAGE_KEY = "saved_links";

export function useLinks() {
  const getAllLinks = useCallback(async (): Promise<SavedLink[]> => {
    try {
      const result = await browser.storage.local.get(STORAGE_KEY);
      const links = (result[STORAGE_KEY] || []) as SavedLink[];
      console.log("Retrieved links from storage:", links);
      return links;
    } catch (error) {
      console.error("Error fetching links:", error);
      return [];
    }
  }, []);

  const saveLink = useCallback(
    async (
      note: SavedLink,
      onDuplicateFound?: () => Promise<boolean>
    ): Promise<boolean> => {
      try {
        const links = await getAllLinks();
        const existingIndex = links.findIndex((link) => link.url === note.url);

        if (existingIndex !== -1) {
          if (onDuplicateFound) {
            const shouldUpdate = await onDuplicateFound();
            if (!shouldUpdate) {
              return false;
            }
          }

          links[existingIndex] = note;
        } else {
          links.push(note);
        }

        await browser.storage.local.set({ [STORAGE_KEY]: links });
        return true;
      } catch (error) {
        console.error("Error saving link:", error);
        return false;
      }
    },
    []
  );

  const deleteLink = useCallback(async (url: string): Promise<boolean> => {
    try {
      const links = await getAllLinks();
      const filteredLinks = links.filter((link) => link.url !== url);
      await browser.storage.local.set({ [STORAGE_KEY]: filteredLinks });
      return true;
    } catch (error) {
      console.error("Error deleting link:", error);
      return false;
    }
  }, []);

  const getLinkByUrl = useCallback(
    async (url: string): Promise<SavedLink | undefined> => {
      try {
        const links = await getAllLinks();
        return links.find((link) => link.url === url);
      } catch (error) {
        console.error("Error fetching link:", error);
        return undefined;
      }
    },
    []
  );

  return {
    getAllLinks,
    saveLink,
    deleteLink,
    getLinkByUrl,
  };
}
