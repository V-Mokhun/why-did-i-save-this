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
import { Switch } from "@/components/ui/switch";
import { useReminder } from "@/lib/hooks";
import { useArchiveSettings } from "@/lib/hooks/use-archive-settings";
import { useTrashSettings } from "@/lib/hooks/use-trash-settings";
import { toast } from "sonner";
import { Bell, Archive, Trash2 } from "lucide-react";

interface SettingsViewProps {}

export const SettingsView = ({}: SettingsViewProps) => {
  const { reminderDays, setReminderDays } = useReminder();
  const {
    archiveDays,
    setArchiveDays,
    autoArchiveEnabled,
    setAutoArchiveEnabled,
  } = useArchiveSettings();
  const {
    retentionDays,
    setRetentionDays,
    autoDeleteEnabled,
    setAutoDeleteEnabled,
  } = useTrashSettings();

  const handleReminderChange = (value: string) => {
    const days = value === "none" ? null : parseInt(value);
    setReminderDays(days);

    if (days) {
      toast.success(`Default reminder set to ${days} days`);
    } else {
      toast.success("Default reminder disabled");
    }
  };

  const handleArchiveDaysChange = (value: string) => {
    const days = parseInt(value);
    setArchiveDays(days);
    toast.success(`Links will be archived after ${days} days of inactivity`);
  };

  const handleTrashRetentionChange = (value: string) => {
    const days = parseInt(value);
    setRetentionDays(days);
    toast.success(`Links in trash will be deleted after ${days} days`);
  };

  return (
    <div className="flex flex-col h-full px-2">
      <div className="sticky top-0 bg-background p-2 flex items-center justify-between z-10 w-full mb-2 border-b">
        <h1 className="text-xl font-semibold">Settings</h1>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-4 p-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="h-4 w-4" />
                Reminders
              </CardTitle>
              <CardDescription>
                Configure how and when you want to be reminded about your saved
                links.
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
                This will be the default reminder period for newly saved links.
                You can still override this when saving individual links.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Archive className="h-4 w-4" />
                Auto-Archive
              </CardTitle>
              <CardDescription>
                Configure automatic archiving of inactive links.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-archive">Enable Auto-Archive</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically archive links that haven't been accessed for a
                    while.
                  </p>
                </div>
                <Switch
                  id="auto-archive"
                  checked={autoArchiveEnabled}
                  onCheckedChange={setAutoArchiveEnabled}
                />
              </div>

              {autoArchiveEnabled && (
                <div className="space-y-2">
                  <Label htmlFor="archive-days">Archive After</Label>
                  <Select
                    value={archiveDays.toString()}
                    onValueChange={handleArchiveDaysChange}
                  >
                    <SelectTrigger id="archive-days">
                      <SelectValue placeholder="Select days" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="14">14 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Links that haven't been accessed for this long will be
                    automatically archived. Pinned links are excluded from
                    auto-archiving.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Trash2 className="h-4 w-4" />
                Trash
              </CardTitle>
              <CardDescription>
                Configure how deleted links are handled.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-delete">Enable Auto-Delete</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically delete links from trash after a period of
                    time.
                  </p>
                </div>
                <Switch
                  id="auto-delete"
                  checked={autoDeleteEnabled}
                  onCheckedChange={setAutoDeleteEnabled}
                />
              </div>

              {autoDeleteEnabled && (
                <div className="space-y-2">
                  <Label htmlFor="trash-retention">Delete After</Label>
                  <Select
                    value={retentionDays.toString()}
                    onValueChange={handleTrashRetentionChange}
                  >
                    <SelectTrigger id="trash-retention">
                      <SelectValue placeholder="Select days" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 days</SelectItem>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="14">14 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Links in the trash will be automatically deleted after this
                    period. You can restore links from the trash before they are
                    permanently deleted.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};
