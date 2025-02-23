import { Input } from "@/components/ui/input";
import logo from "@assets/img/logo.svg";
import { Search } from "lucide-react";

interface PopupHeaderProps {
  onSearch?: (query: string) => void;
}

export const PopupHeader = ({ onSearch }: PopupHeaderProps) => {
  return (
    <header className="border-b p-2 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={logo} className="h-6 w-6" alt="logo" />
          <h1 className="text-lg font-semibold">Why Did I Save This?</h1>
        </div>
      </div>
      {onSearch && (
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search saved links..."
            className="pl-8"
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>
      )}
    </header>
  );
};
