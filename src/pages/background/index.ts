import { checkLinkShouldBeArchived } from "@/lib/archive";
import {
  ARCHIVE_SETTINGS_KEY,
  DEFAULT_TRASH_RETENTION_DAYS,
  LINKS_KEY,
  TRASH_SETTINGS_KEY,
} from "@/lib/hooks";
import { updateBadge } from "@/lib/reminder";
import { SavedLink } from "@/lib/types";
import browser from "webextension-polyfill";

interface StorageData {
  links?: SavedLink[];
  [key: string]: any;
}

interface TrashSettings {
  retentionDays: number;
  autoDeleteEnabled: boolean;
}

interface ArchiveSettings {
  archiveDays: number;
  excludedCategories: string[];
  autoArchiveEnabled: boolean;
}

// Auto-archive check function
async function checkAndArchiveLinks() {
  try {
    // Get all links and archive settings from storage
    const storageData = (await browser.storage.local.get([
      LINKS_KEY,
      ARCHIVE_SETTINGS_KEY,
    ])) as StorageData;

    const links = storageData.links || [];
    const archiveSettings = (storageData[ARCHIVE_SETTINGS_KEY] || {
      archiveDays: 30,
      excludedCategories: [],
      autoArchiveEnabled: true,
    }) as ArchiveSettings;

    // If auto-archive is disabled, skip the process
    if (!archiveSettings.autoArchiveEnabled) return;

    // Find links that should be archived
    const linksToArchive = links.filter((link) =>
      checkLinkShouldBeArchived(
        link,
        archiveSettings.archiveDays,
        archiveSettings.excludedCategories
      )
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
      await browser.storage.local.set({ [LINKS_KEY]: updatedLinks });

      // Log the number of archived links
      console.log(`Auto-archived ${linksToArchive.length} links`);
    }
  } catch (error) {
    console.error("Error in auto-archive process:", error);
  }
}

// Trash cleanup function
async function checkAndDeleteOldTrash() {
  try {
    const storageData = await browser.storage.local.get([
      LINKS_KEY,
      TRASH_SETTINGS_KEY,
    ]);

    const links = (storageData.links || []) as SavedLink[];
    const trashSettings = (storageData[TRASH_SETTINGS_KEY] || {
      retentionDays: DEFAULT_TRASH_RETENTION_DAYS,
      autoDeleteEnabled: true,
    }) as TrashSettings;

    if (!trashSettings.autoDeleteEnabled) return;

    const now = new Date();
    const updatedLinks = links.filter((link: SavedLink) => {
      if (!link.deletedAt) return true;
      const deletedDate = new Date(link.deletedAt);
      const daysInTrash =
        (now.getTime() - deletedDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysInTrash < trashSettings.retentionDays;
    });

    if (updatedLinks.length !== links.length) {
      await browser.storage.local.set({ [LINKS_KEY]: updatedLinks });
      console.log(
        `Deleted ${links.length - updatedLinks.length} old items from trash`
      );
    }
  } catch (error) {
    console.error("Error in trash cleanup process:", error);
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

// Run auto-archive and trash cleanup checks daily
setInterval(() => {
  checkAndArchiveLinks();
  checkAndDeleteOldTrash();
}, 24 * 60 * 60 * 1000);

// Initial checks
checkAndArchiveLinks();
checkAndDeleteOldTrash();
updateBadge();

// Handle keyboard shortcut
browser.commands.onCommand.addListener(async (command) => {
  if (command === "open-save-link-modal") {
    await browser.storage.local.set({ shouldOpenSaveLink: true });
    await browser.action.openPopup();
  }
});
