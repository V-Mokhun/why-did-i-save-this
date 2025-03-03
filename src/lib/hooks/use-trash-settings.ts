import { useEffect, useState } from "react";
import browser from "webextension-polyfill";
import { SavedLink } from "@/lib/types";
import { LINKS_KEY } from "./use-links";

export const TRASH_SETTINGS_KEY = "trash_settings";
export const DEFAULT_TRASH_RETENTION_DAYS = 7;

interface TrashSettings {
  retentionDays: number;
  autoDeleteEnabled: boolean;
}

export const useTrashSettings = () => {
  const [settings, setSettings] = useState<TrashSettings>({
    retentionDays: DEFAULT_TRASH_RETENTION_DAYS,
    autoDeleteEnabled: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const result = await browser.storage.local.get(TRASH_SETTINGS_KEY);
    if (result[TRASH_SETTINGS_KEY]) {
      setSettings(result[TRASH_SETTINGS_KEY] as TrashSettings);
    }
  };

  const saveSettings = async (newSettings: TrashSettings) => {
    await browser.storage.local.set({ [TRASH_SETTINGS_KEY]: newSettings });
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
    const links = (result.links || []) as SavedLink[];
    const now = new Date();

    const updatedLinks = links.filter((link) => {
      if (!link.deletedAt) return true;
      const deletedDate = new Date(link.deletedAt);
      const daysInTrash =
        (now.getTime() - deletedDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysInTrash < settings.retentionDays;
    });

    await browser.storage.local.set({ links: updatedLinks });
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
