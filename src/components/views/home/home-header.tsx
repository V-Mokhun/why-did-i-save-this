import { Input } from "@/components/ui/input";
import { Search, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReorder } from "@/lib/hooks";

interface HomeHeaderProps {
  onSearch: (query: string) => void;
  canReorder: boolean;
}

export const HomeHeader = ({ onSearch, canReorder }: HomeHeaderProps) => {
  const { isReordering, toggleReordering } = useReorder();

  return (
    <div className="sticky top-0 bg-background p-2 space-y-2 z-10 w-full mb-2 border-b">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Home</h1>
        {canReorder && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleReordering}
            className={isReordering ? "text-primary" : "text-muted-foreground"}
          >
            <GripVertical className="h-4 w-4 mr-1" />
            {isReordering ? "Done" : "Reorder"}
          </Button>
        )}
      </div>
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search links..."
          className="pl-8"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </div>
  );
};
