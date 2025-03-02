import browser from "webextension-polyfill";
import { SavedLink } from "./types";

export const checkLinkNeedsAttention = (link: SavedLink) => {
  if (!link.reminderDays) return false;

  const reminderThreshold =
    Date.now() - link.reminderDays * 24 * 60 * 60 * 1000;

  if (
    (link.lastOpenedAt && link.lastOpenedAt < reminderThreshold) ||
    (!link.lastOpenedAt && link.timestamp < reminderThreshold)
  ) {
    return true;
  }
  return false;
};

interface StorageData {
  links?: SavedLink[];
  [key: string]: any;
}

// Function to update the badge that can be called from both background and popup
export const updateBadge = async (links?: SavedLink[]) => {
  try {
    // If links are not provided, fetch them from storage
    let linksToCheck: SavedLink[] = [];

    if (!links) {
      const storageData = (await browser.storage.local.get(
        "links"
      )) as StorageData;
      linksToCheck = storageData.links || [];
    } else {
      linksToCheck = links;
    }

    // Filter links that need attention
    const linksNeedingAttention = linksToCheck.filter((link) => {
      if (!link.reminderDays || link.isDeleted) return false;
      return checkLinkNeedsAttention(link);
    });

    // Update the badge
    const count = linksNeedingAttention.length;

    if (count > 0) {
      await browser.action.setBadgeText({ text: count.toString() });
      await browser.action.setBadgeBackgroundColor({ color: "#f59e0b" }); // Amber color
    } else {
      await browser.action.setBadgeText({ text: "" });
    }
  } catch (error) {
    console.error("Error updating badge:", error);
  }
};
