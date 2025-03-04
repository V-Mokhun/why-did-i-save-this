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
import { Switch } from "@/components/ui/switch";
import { useArchiveSettings } from "@/lib/hooks";
import { Archive } from "lucide-react";
import { toast } from "sonner";

interface ArchiveSectionProps {}

export const ArchiveSection = ({}: ArchiveSectionProps) => {
  const {
    archiveDays,
    setArchiveDays,
    autoArchiveEnabled,
    setAutoArchiveEnabled,
  } = useArchiveSettings();

  const handleArchiveDaysChange = (value: string) => {
    const days = parseInt(value);
    setArchiveDays(days);
    toast.success(`Links will be archived after ${days} days of inactivity`);
  };

  return (
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
  );
};
