import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTrashSettings } from "@/lib/hooks";
import { Settings, Trash2 } from "lucide-react";

interface TrashHeaderProps {
  hasItems: boolean;
  onEmptyTrash: () => void;
  onViewChange?: (view: "settings") => void;
  onSearch: (query: string) => void;
  searchQuery: string;
}

export const TrashHeader = ({
  hasItems,
  onEmptyTrash,
  onViewChange,
  onSearch,
  searchQuery,
}: TrashHeaderProps) => {
  const { autoDeleteEnabled, retentionDays } = useTrashSettings();

  return (
    <div className="p-2 border-b sticky top-0 bg-background z-10 w-full mb-2">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-semibold">Trash</h1>
        {hasItems && (
          <Button
            variant="outline"
            size="sm"
            onClick={onEmptyTrash}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Empty Trash
          </Button>
        )}
      </div>

      {autoDeleteEnabled ? (
        <p className="text-sm text-muted-foreground mb-2">
          Links in trash will be permanently deleted after {retentionDays} days.
        </p>
      ) : (
        <Alert className="mb-2">
          <AlertDescription className="flex items-center justify-between">
            <span>Auto-deletion is currently disabled.</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewChange?.("settings")}
            >
              <Settings className="mr-1 h-4 w-4" />
              Configure
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Input
        placeholder="Search trashed links..."
        value={searchQuery}
        onChange={(e) => onSearch(e.target.value)}
        className="w-full"
      />
    </div>
  );
};
