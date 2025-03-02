import { useStorage } from "./use-storage";

const STORAGE_KEY = "reminderDays";

export const useReminder = () => {
  const [reminderDays, setReminderDays] = useStorage<number | null>(
    STORAGE_KEY,
    null
  );

  return { reminderDays, setReminderDays };
};
