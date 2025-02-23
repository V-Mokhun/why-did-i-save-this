import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface TrashHeaderProps {
  onEmptyTrash: () => void;
  hasItems: boolean;
}

export const TrashHeader = ({ onEmptyTrash, hasItems }: TrashHeaderProps) => {
  return (
    <div className="sticky top-0 bg-background p-2 flex items-center justify-between">
      <h1 className="text-lg font-semibold">Trash</h1>
      {hasItems && (
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive"
          onClick={onEmptyTrash}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Empty Trash
        </Button>
      )}
    </div>
  );
};
