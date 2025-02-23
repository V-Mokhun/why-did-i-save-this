import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface HomeHeaderProps {
  onSearch: (query: string) => void;
}

export const HomeHeader = ({ onSearch }: HomeHeaderProps) => {
  return (
    <div className="sticky top-0 bg-background p-2 space-y-3">
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
