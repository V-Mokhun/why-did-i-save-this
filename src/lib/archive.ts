import { SavedLink } from "./types";

export const DEFAULT_ARCHIVE_DAYS = 30;

/**
 * Checks if a link should be archived based on its last opened date
 * and the configured archive period.
 */
export const checkLinkShouldBeArchived = (
  link: SavedLink,
  archiveDays: number = DEFAULT_ARCHIVE_DAYS,
  excludedCategories: string[] = []
): boolean => {
  if (link.isArchived || link.isDeleted) return false;

  if (link.isPinned) return false;

  if (excludedCategories.length > 0 && link.categories) {
    const hasExcludedCategory = link.categories.some((categoryId) =>
      excludedCategories.includes(categoryId)
    );
    if (hasExcludedCategory) return false;
  }

  const archiveThreshold = Date.now() - archiveDays * 24 * 60 * 60 * 1000;

  const lastActivity = link.lastOpenedAt || link.timestamp;

  return lastActivity < archiveThreshold;
};

/**
 * Gets links that will be archived soon (within the specified days threshold)
 */
export const getLinksToBeArchivedSoon = (
  links: SavedLink[],
  archiveDays: number = DEFAULT_ARCHIVE_DAYS,
  excludedCategories: string[] = [],
  daysThreshold: number = 1
): SavedLink[] => {
  const soonThreshold =
    Date.now() - (archiveDays - daysThreshold) * 24 * 60 * 60 * 1000;
  const archiveThreshold = Date.now() - archiveDays * 24 * 60 * 60 * 1000;

  return links.filter((link) => {
    if (link.isArchived || link.isDeleted || link.isPinned) return false;

    if (excludedCategories.length > 0 && link.categories) {
      const hasExcludedCategory = link.categories.some((categoryId) =>
        excludedCategories.includes(categoryId)
      );
      if (hasExcludedCategory) return false;
    }

    const lastActivity = link.lastOpenedAt || link.timestamp;

    return lastActivity < soonThreshold && lastActivity >= archiveThreshold;
  });
};
