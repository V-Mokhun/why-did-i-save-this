import { SavedLink } from "@/lib/types";
import browser from "webextension-polyfill";
import { LINKS_KEY } from "./use-links";
import { useStorage } from "./use-storage";

export const TRASH_SETTINGS_KEY = "trash_settings";
export const DEFAULT_TRASH_RETENTION_DAYS = 7;

interface TrashSettings {
  retentionDays: number;
  autoDeleteEnabled: boolean;
}

export const useTrashSettings = () => {
  const [settings, setSettings] = useStorage<TrashSettings>(
    TRASH_SETTINGS_KEY,
    {
      retentionDays: DEFAULT_TRASH_RETENTION_DAYS,
      autoDeleteEnabled: true,
    }
  );

  const saveSettings = async (newSettings: TrashSettings) => {
    setSettings(newSettings);
  };

  const setRetentionDays = async (days: number) => {
    await saveSettings({ ...settings, retentionDays: days });
  };

  const setAutoDeleteEnabled = async (enabled: boolean) => {
    await saveSettings({ ...settings, autoDeleteEnabled: enabled });
  };

  const checkAndDeleteOldTrash = async () => {
    if (!settings.autoDeleteEnabled) return;

    const result = await browser.storage.local.get(LINKS_KEY);
    const links = (result[LINKS_KEY] || []) as SavedLink[];
    const now = new Date();

    const updatedLinks = links.filter((link) => {
      if (!link.deletedAt) return true;
      const deletedDate = new Date(link.deletedAt);
      const daysInTrash =
        (now.getTime() - deletedDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysInTrash < settings.retentionDays;
    });

    await browser.storage.local.set({ [LINKS_KEY]: updatedLinks });
  };

  return {
    trashSettings: settings,
    retentionDays: settings.retentionDays,
    autoDeleteEnabled: settings.autoDeleteEnabled,
    setRetentionDays,
    setAutoDeleteEnabled,
    checkAndDeleteOldTrash,
  };
};
