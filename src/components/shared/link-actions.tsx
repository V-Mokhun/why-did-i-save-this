import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SavedLink } from "@/lib/types";
import { MoreHorizontal } from "lucide-react";

export interface LinkAction {
  label: string;
  icon: React.ReactNode;
  onClick: (link: SavedLink) => void;
  className?: string;
}

interface LinkActionsProps {
  link: SavedLink;
  actions: LinkAction[];
}

export const LinkActions = ({ link, actions }: LinkActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 flex-shrink-0 ml-auto"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {actions.map((action, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => action.onClick(link)}
            className={action.className}
          >
            {action.icon}
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}; 
