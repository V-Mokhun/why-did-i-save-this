import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useReminder } from "@/lib/hooks";
import { Bell } from "lucide-react";
import { toast } from "sonner";

interface ReminderSectionProps {}

export const ReminderSection = ({}: ReminderSectionProps) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Bell className="h-4 w-4" />
          Reminders
        </CardTitle>
        <CardDescription>
          Configure how and when you want to be reminded about your saved links.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
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
          This will be the default reminder period for newly saved links. You
          can still override this when saving individual links.
        </p>
      </CardContent>
    </Card>
  );
};
