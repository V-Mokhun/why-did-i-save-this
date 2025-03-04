import { useCallback } from "react";
import browser from "webextension-polyfill";
import { SavedLink } from "@/lib/types";
import { LINKS_KEY } from "./use-links";
import { ARCHIVE_SETTINGS_KEY } from "./use-archive-settings";
import { TRASH_SETTINGS_KEY } from "./use-trash-settings";
import { CATEGORIES_KEY } from "./use-categories";

interface BackupData {
  version: string;
  timestamp: number;
  data: {
    links: SavedLink[];
    categories: Record<string, any>;
    archiveSettings: Record<string, any>;
    trashSettings: Record<string, any>;
  };
}

export const useBackup = () => {
  const exportData = useCallback(async () => {
    try {
      const storageData = await browser.storage.local.get([
        LINKS_KEY,
        CATEGORIES_KEY,
        ARCHIVE_SETTINGS_KEY,
        TRASH_SETTINGS_KEY,
      ]);

      const backupData: BackupData = {
        version: "1.0.0",
        timestamp: Date.now(),
        data: {
          links: (storageData[LINKS_KEY] || []) as SavedLink[],
          categories: storageData[CATEGORIES_KEY] || {},
          archiveSettings: storageData[ARCHIVE_SETTINGS_KEY] || {},
          trashSettings: storageData[TRASH_SETTINGS_KEY] || {},
        },
      };

      // Convert to JSON and create blob
      const jsonString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      // Create download link
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `why-did-i-save-this-backup-${timestamp}.json`;

      // Trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error("Error exporting data:", error);
      throw error;
    }
  }, []);

  const importData = useCallback(async (file: File): Promise<boolean> => {
    try {
      // Read file content
      const text = await file.text();
      const backupData = JSON.parse(text) as BackupData;

      // Validate backup data structure
      if (!backupData.version || !backupData.timestamp || !backupData.data) {
        throw new Error("Invalid backup file format");
      }

      // Validate required data
      if (!Array.isArray(backupData.data.links)) {
        throw new Error("Invalid links data");
      }

      // Merge data with existing storage
      const currentData = await browser.storage.local.get([
        LINKS_KEY,
        CATEGORIES_KEY,
        ARCHIVE_SETTINGS_KEY,
        TRASH_SETTINGS_KEY,
      ]);

      // Handle conflicts (keep existing data if backup data is empty)
      const mergedData = {
        [LINKS_KEY]:
          backupData.data.links.length > 0
            ? backupData.data.links
            : ((currentData[LINKS_KEY] || []) as SavedLink[]),
        [CATEGORIES_KEY]:
          Object.keys(backupData.data.categories).length > 0
            ? backupData.data.categories
            : currentData[CATEGORIES_KEY] || {},
        [ARCHIVE_SETTINGS_KEY]:
          Object.keys(backupData.data.archiveSettings).length > 0
            ? backupData.data.archiveSettings
            : currentData[ARCHIVE_SETTINGS_KEY] || {},
        [TRASH_SETTINGS_KEY]:
          Object.keys(backupData.data.trashSettings).length > 0
            ? backupData.data.trashSettings
            : currentData[TRASH_SETTINGS_KEY] || {},
      };

      await browser.storage.local.set(mergedData);

      return true;
    } catch (error) {
      console.error("Error importing data:", error);
      throw error;
    }
  }, []);

  return {
    exportData,
    importData,
  };
};
