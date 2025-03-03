import { useStorage } from "./use-storage";
import { DEFAULT_ARCHIVE_DAYS } from "../archive";

export const ARCHIVE_SETTINGS_KEY = "archive_settings";

interface ArchiveSettings {
  archiveDays: number;
  excludedCategories: string[];
  autoArchiveEnabled: boolean;
}

export const useArchiveSettings = () => {
  const [settings, setSettings] = useStorage<ArchiveSettings>(
    ARCHIVE_SETTINGS_KEY,
    {
      archiveDays: DEFAULT_ARCHIVE_DAYS,
      excludedCategories: [],
      autoArchiveEnabled: true,
    }
  );

  const setArchiveDays = async (days: number) => {
    setSettings({ ...settings, archiveDays: days });
  };

  const setExcludedCategories = async (categories: string[]) => {
    setSettings({ ...settings, excludedCategories: categories });
  };

  const setAutoArchiveEnabled = async (enabled: boolean) => {
    setSettings({ ...settings, autoArchiveEnabled: enabled });
  };

  return {
    archiveSettings: settings,
    archiveDays: settings.archiveDays,
    excludedCategories: settings.excludedCategories,
    autoArchiveEnabled: settings.autoArchiveEnabled,
    setArchiveDays,
    setExcludedCategories,
    setAutoArchiveEnabled,
  };
};
