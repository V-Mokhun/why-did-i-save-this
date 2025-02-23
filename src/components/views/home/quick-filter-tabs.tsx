import { Button } from "@/components/ui/button";
import { Pin, Clock, AlertCircle } from "lucide-react";

export type QuickFilter = "pinned" | "needs-attention" | "recent";

interface QuickFilterTabsProps {
  selectedFilter: QuickFilter | null;
  onFilterChange: (filter: QuickFilter | null) => void;
}

const QUICK_FILTERS: {
  label: string;
  Icon: React.ElementType;
  filter: QuickFilter;
}[] = [
  {
    label: "Pinned",
    Icon: Pin,
    filter: "pinned",
  },
  {
    label: "Needs Attention",
    Icon: AlertCircle,
    filter: "needs-attention",
  },
  {
    label: "Recently Opened",
    Icon: Clock,
    filter: "recent",
  },
] as const;

export const QuickFilterTabs = ({
  selectedFilter,
  onFilterChange,
}: QuickFilterTabsProps) => {
  return (
    <div className="flex gap-2 p-2 overflow-x-auto">
      {QUICK_FILTERS.map(({ Icon, filter, label }) => (
        <Button
          key={filter}
          variant={selectedFilter === filter ? "default" : "outline"}
          size="sm"
          onClick={() =>
            onFilterChange(selectedFilter === filter ? null : filter)
          }
        >
          <Icon className="h-4 w-4 mr-1" />
          {label}
        </Button>
      ))}
    </div>
  );
};
