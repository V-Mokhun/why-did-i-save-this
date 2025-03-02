import browser from "webextension-polyfill";
import { updateBadge } from "@/lib/reminder";
import { checkLinkShouldBeArchived } from "@/lib/archive";
import { SavedLink } from "@/lib/types";
import {
  ARCHIVE_DAYS_KEY,
  ARCHIVE_EXCLUDED_CATEGORIES_KEY,
  AUTO_ARCHIVE_ENABLED_KEY,
  LINKS_KEY,
} from "@/lib/hooks";

console.log("background script loaded");

interface StorageData {
  links?: SavedLink[];
  archiveDays?: number;
  archiveExcludedCategories?: string[];
  autoArchiveEnabled?: boolean;
  [key: string]: any;
}


// Auto-archive check function
async function checkAndArchiveLinks() {
  try {
    // Get all links and archive settings from storage
    const storageData = (await browser.storage.local.get([
      LINKS_KEY,
      ARCHIVE_DAYS_KEY,
      ARCHIVE_EXCLUDED_CATEGORIES_KEY,
      AUTO_ARCHIVE_ENABLED_KEY,
    ])) as StorageData;

    const links = storageData.links || [];
    const archiveDays = storageData.archiveDays || 30;
    const excludedCategories = storageData.archiveExcludedCategories || [];
    const autoArchiveEnabled = storageData.autoArchiveEnabled !== false; // Default to true

    // If auto-archive is disabled, skip the process
    if (!autoArchiveEnabled) return;

    // Find links that should be archived
    const linksToArchive = links.filter((link) =>
      checkLinkShouldBeArchived(link, archiveDays, excludedCategories)
    );

    // If there are links to archive, update them
    if (linksToArchive.length > 0) {
      const now = Date.now();
      const updatedLinks = links.map((link) => {
        if (linksToArchive.some((l) => l.url === link.url)) {
          return {
            ...link,
            isArchived: true,
            archivedAt: now,
          };
        }
        return link;
      });

      // Save the updated links
      await browser.storage.local.set({ links: updatedLinks });

      // Log the number of archived links
      console.log(`Auto-archived ${linksToArchive.length} links`);
    }
  } catch (error) {
    console.error("Error in auto-archive process:", error);
  }
}

// Listen for storage changes to update the badge
browser.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes.links) {
    updateBadge();
  }
});

// Update the badge periodically (every hour)
setInterval(updateBadge, 60 * 60 * 1000);

// Run auto-archive check daily
setInterval(checkAndArchiveLinks, 24 * 60 * 60 * 1000);

checkAndArchiveLinks();
updateBadge();
