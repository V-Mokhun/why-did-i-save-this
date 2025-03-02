import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useReminder } from "@/lib/hooks";
import { toast } from "sonner";

interface SettingsViewProps {}

export const SettingsView = ({}: SettingsViewProps) => {
  const { reminderDays, setReminderDays } = useReminder();

  const handleReminderChange = (value: string) => {
    const days = value === "none" ? null : parseInt(value);
    setReminderDays(days);

    if (days) {
      toast.success(`Default reminder set to ${days} days`);
    } else {
      toast.success("Default reminder disabled");
    }
  };

  console.log(reminderDays);

  return (
    <div className="flex flex-col h-full px-2">
      <div className="sticky top-0 bg-background p-2 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Settings</h1>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-4 p-2">
          <div className="space-y-2">
            <Label htmlFor="default-reminder">Default Reminder Period</Label>
            <Select
              value={reminderDays?.toString() || "none"}
              onValueChange={handleReminderChange}
            >
              <SelectTrigger id="default-reminder">
                <SelectValue placeholder="No default reminder" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No default reminder</SelectItem>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="14">14 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              This will be the default reminder period for newly saved links.
              You can still override this when saving individual links.
            </p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
