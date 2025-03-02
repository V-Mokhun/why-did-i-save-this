import { useCallback } from "react";
import { SavedLink } from "../types";
import { useStorage } from "./use-storage";
import { updateBadge } from "../reminder";

export const LINKS_KEY = "links";

export function useLinks() {
  const [links, setLinks] = useStorage<SavedLink[]>(LINKS_KEY, []);

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
              setTimeout(() => updateBadge(updatedLinks), 100);
            };
          }

          setLinks(updatedLinks);
          setTimeout(() => updateBadge(updatedLinks), 100);
          return true;
        }

        const newLinks = [...links, link];
        setLinks(newLinks);
        setTimeout(() => updateBadge(newLinks), 100);
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
        const updatedLinks = links.filter((link) => link.url !== url);
        setLinks(updatedLinks);

        setTimeout(() => updateBadge(updatedLinks), 100);

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
        updatedLinks[linkIndex] = {
          ...links[linkIndex],
          ...updates,
        };

        setLinks(updatedLinks);

        if ("lastOpenedAt" in updates) {
          setTimeout(() => updateBadge(updatedLinks), 100);
        }

        return true;
      } catch (error) {
        console.error("Error updating link:", error);
        return false;
      }
    },
    [links, setLinks]
  );

  const batchUpdateLinks = useCallback(
    async (
      updates: Array<{ url: string; updates: Partial<SavedLink> }>
    ): Promise<boolean> => {
      try {
        const updatedLinks = [...links];

        for (const update of updates) {
          const linkIndex = updatedLinks.findIndex(
            (link) => link.url === update.url
          );
          if (linkIndex !== -1) {
            updatedLinks[linkIndex] = {
              ...updatedLinks[linkIndex],
              ...update.updates,
            };
          }
        }

        setLinks(updatedLinks);
        return true;
      } catch (error) {
        console.error("Error batch updating links:", error);
        return false;
      }
    },
    [links, setLinks]
  );

  const moveToTrash = useCallback(
    async (url: string): Promise<boolean> => {
      try {
        const linkIndex = links.findIndex((link) => link.url === url);
        if (linkIndex === -1) return false;

        const updatedLinks = [...links];
        updatedLinks[linkIndex] = {
          ...links[linkIndex],
          isDeleted: true,
          deletedAt: Date.now(),
          isPinned: false,
          isArchived: false,
        };

        setLinks(updatedLinks);

        setTimeout(() => updateBadge(updatedLinks), 100);

        return true;
      } catch (error) {
        console.error("Error moving link to trash:", error);
        return false;
      }
    },
    [links, setLinks]
  );

  const restoreFromTrash = useCallback(
    async (url: string): Promise<boolean> => {
      try {
        const linkIndex = links.findIndex((link) => link.url === url);
        if (linkIndex === -1) return false;

        const updatedLinks = [...links];
        updatedLinks[linkIndex] = {
          ...links[linkIndex],
          isDeleted: false,
          deletedAt: undefined,
        };

        setLinks(updatedLinks);

        setTimeout(() => updateBadge(updatedLinks), 100);

        return true;
      } catch (error) {
        console.error("Error restoring link from trash:", error);
        return false;
      }
    },
    [links, setLinks]
  );

  const emptyTrash = useCallback(async (): Promise<boolean> => {
    try {
      setLinks(links.filter((link) => !link.isDeleted));
      return true;
    } catch (error) {
      console.error("Error emptying trash:", error);
      return false;
    }
  }, [links, setLinks]);

  const moveToArchive = useCallback(
    async (url: string): Promise<boolean> => {
      try {
        const linkIndex = links.findIndex((link) => link.url === url);
        if (linkIndex === -1) return false;

        const updatedLinks = [...links];
        updatedLinks[linkIndex] = {
          ...links[linkIndex],
          isArchived: true,
          archivedAt: Date.now(),
        };

        setLinks(updatedLinks);
        return true;
      } catch (error) {
        console.error("Error moving link to archive:", error);
        return false;
      }
    },
    [links, setLinks]
  );

  const restoreFromArchive = useCallback(
    async (url: string): Promise<boolean> => {
      try {
        const linkIndex = links.findIndex((link) => link.url === url);
        if (linkIndex === -1) return false;

        const updatedLinks = [...links];
        updatedLinks[linkIndex] = {
          ...links[linkIndex],
          isArchived: false,
          archivedAt: undefined,
          lastOpenedAt: Date.now(),
        };

        setLinks(updatedLinks);
        return true;
      } catch (error) {
        console.error("Error restoring link from archive:", error);
        return false;
      }
    },
    [links, setLinks]
  );

  const batchArchiveLinks = useCallback(
    async (urls: string[]): Promise<boolean> => {
      try {
        const now = Date.now();
        const updatedLinks = [...links];

        for (const url of urls) {
          const linkIndex = updatedLinks.findIndex((link) => link.url === url);
          if (linkIndex !== -1) {
            updatedLinks[linkIndex] = {
              ...updatedLinks[linkIndex],
              isArchived: true,
              archivedAt: now,
            };
          }
        }

        setLinks(updatedLinks);
        return true;
      } catch (error) {
        console.error("Error batch archiving links:", error);
        return false;
      }
    },
    [links, setLinks]
  );

  return {
    links: links.filter((link) => !link.isDeleted && !link.isArchived),
    archivedLinks: links.filter((link) => !link.isDeleted && link.isArchived),
    trashedLinks: links.filter((link) => link.isDeleted),
    allLinks: links,
    saveLink,
    deleteLink,
    updateLink,
    batchUpdateLinks,
    moveToTrash,
    restoreFromTrash,
    emptyTrash,
    moveToArchive,
    restoreFromArchive,
    batchArchiveLinks,
  };
}
