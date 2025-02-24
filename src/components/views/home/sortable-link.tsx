import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Category, SavedLink } from "@/lib/types";
import { LinkCard } from "./link-card";
import { cn } from "@/lib/utils";

interface SortableLinkProps {
  link: SavedLink;
  categories: Category[];
  onPin: (link: SavedLink) => void;
  onEdit: (link: SavedLink) => void;
  onDelete: (link: SavedLink) => void;
  onOpen: () => void;
}

export const SortableLink = ({
  link,
  categories,
  onPin,
  onEdit,
  onDelete,
  onOpen,
}: SortableLinkProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: link.url,
    data: link,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
    touchAction: "none",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn("touch-none", isDragging && "opacity-50 z-50")}
    >
      <LinkCard
        link={link}
        categories={categories}
        onPin={onPin}
        onEdit={onEdit}
        onDelete={onDelete}
        onOpen={onOpen}
      />
    </div>
  );
};
