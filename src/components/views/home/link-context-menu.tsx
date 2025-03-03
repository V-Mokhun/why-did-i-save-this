import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { SavedLink } from "@/lib/types";
import { Pin, Pencil, Trash2, ExternalLink } from "lucide-react";

interface LinkContextMenuProps {
  link: SavedLink;
  children: React.ReactNode;
  onPin: (e: React.MouseEvent) => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  onOpen: (e: React.MouseEvent) => void;
}

export const LinkContextMenu = ({
  link,
  children,
  onPin,
  onEdit,
  onDelete,
  onOpen,
}: LinkContextMenuProps) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={onOpen}>
          <ExternalLink className="h-4 w-4 mr-2" />
          Open Link
        </ContextMenuItem>
        <ContextMenuItem onClick={onPin}>
          <Pin className="h-4 w-4 mr-2" />
          {link.isPinned ? "Unpin" : "Pin"}
        </ContextMenuItem>
        <ContextMenuItem onClick={onEdit}>
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={onDelete} className="text-destructive">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
