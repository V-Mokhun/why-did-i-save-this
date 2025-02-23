import { useCallback } from "react";
import { SavedLink } from "../types";
import { useStorage } from "./use-storage";

const STORAGE_KEY = "links";

export function useLinks() {
  const [links, setLinks] = useStorage<SavedLink[]>(STORAGE_KEY, []);

  const saveLink = useCallback(
    async (
      link: SavedLink,
      onDuplicate?: () => void
    ): Promise<boolean | Function> => {
      try {
        const existingLinkIndex = links.findIndex((l) => l.url === link.url);

        if (existingLinkIndex !== -1) {
          const updatedLinks = [...links];
          updatedLinks[existingLinkIndex] = link;

          if (onDuplicate) {
            onDuplicate();
            return () => {
              setLinks(updatedLinks);
            };
          }

          setLinks(updatedLinks);
          return true;
        }

        setLinks([...links, link]);
        return true;
      } catch (error) {
        console.error("Error saving link:", error);
        return false;
      }
    },
    [links, setLinks]
  );

  const deleteLink = useCallback(
    async (url: string): Promise<boolean> => {
      try {
        setLinks(links.filter((link) => link.url !== url));
        return true;
      } catch (error) {
        console.error("Error deleting link:", error);
        return false;
      }
    },
    [links, setLinks]
  );

  const updateLink = useCallback(
    async (url: string, updates: Partial<SavedLink>): Promise<boolean> => {
      try {
        const linkIndex = links.findIndex((link) => link.url === url);
        if (linkIndex === -1) return false;

        const updatedLinks = [...links];
        updatedLinks[linkIndex] = { ...links[linkIndex], ...updates };
        setLinks(updatedLinks);
        return true;
      } catch (error) {
        console.error("Error updating link:", error);
        return false;
      }
    },
    [links, setLinks]
  );

  return {
    links,
    saveLink,
    deleteLink,
    updateLink,
  };
}
