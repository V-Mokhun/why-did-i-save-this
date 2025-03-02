import { useStorage } from "./use-storage";
import { DEFAULT_ARCHIVE_DAYS } from "../archive";

export const ARCHIVE_DAYS_KEY = "archiveDays";
export const ARCHIVE_EXCLUDED_CATEGORIES_KEY = "archiveExcludedCategories";
export const AUTO_ARCHIVE_ENABLED_KEY = "autoArchiveEnabled";

export const useArchiveSettings = () => {
  const [archiveDays, setArchiveDays] = useStorage<number>(
    ARCHIVE_DAYS_KEY,
    DEFAULT_ARCHIVE_DAYS
  );

  const [excludedCategories, setExcludedCategories] = useStorage<string[]>(
    ARCHIVE_EXCLUDED_CATEGORIES_KEY,
    []
  );

  const [autoArchiveEnabled, setAutoArchiveEnabled] = useStorage<boolean>(
    AUTO_ARCHIVE_ENABLED_KEY,
    true
  );

  return {
    archiveDays,
    setArchiveDays,
    excludedCategories,
    setExcludedCategories,
    autoArchiveEnabled,
    setAutoArchiveEnabled,
  };
};
