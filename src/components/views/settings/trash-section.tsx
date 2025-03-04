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
import { useTrashSettings } from "@/lib/hooks";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface TrashSectionProps {}

export const TrashSection = ({}: TrashSectionProps) => {
  const {
    retentionDays,
    setRetentionDays,
    autoDeleteEnabled,
    setAutoDeleteEnabled,
  } = useTrashSettings();

  const handleTrashRetentionChange = (value: string) => {
    const days = parseInt(value);
    setRetentionDays(days);
    toast.success(`Links in trash will be deleted after ${days} days`);
  };

  return (
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
              Automatically delete links from trash after a period of time.
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
  );
};
