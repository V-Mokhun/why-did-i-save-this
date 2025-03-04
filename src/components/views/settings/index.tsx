import { ScrollArea } from "@/components/ui/scroll-area";
import { ArchiveSection } from "./archive-section";
import { BackupSection } from "./backup-section";
import { ReminderSection } from "./reminder-section";
import { TrashSection } from "./trash-section";

interface SettingsViewProps {}

export const SettingsView = ({}: SettingsViewProps) => {
  return (
    <div className="flex flex-col h-full px-2">
      <div className="sticky top-0 bg-background p-2 flex items-center justify-between z-10 w-full mb-2 border-b">
        <h1 className="text-xl font-semibold">Settings</h1>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-4 p-2">
          <ReminderSection />
          <ArchiveSection />
          <TrashSection />
          <BackupSection />
        </div>
      </ScrollArea>
    </div>
  );
};
