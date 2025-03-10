import { ScrollArea } from "@/components/ui/scroll-area";
import { Category, SavedLink } from "@/lib/types";
import { LinkCard } from "./link-card";
import { QuickFilter } from "./quick-filter-tabs";
import { useLinks, useReorder } from "@/lib/hooks";
import { useState } from "react";
import { SaveLinkView } from "../save-link";
import { toast } from "sonner";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { SortableLink } from "./sortable-link";

interface LinkListProps {
  links: SavedLink[];
  categories: Category[];
  searchQuery: string;
  selectedFilter: QuickFilter | null;
  selectedCategories: string[];
}

export const LinkList = ({
  links,
  categories,
  searchQuery,
  selectedFilter,
  selectedCategories,
}: LinkListProps) => {
  const { updateLink, moveToTrash, restoreFromTrash } = useLinks();
  const { isReordering } = useReorder();
  const [editingLink, setEditingLink] = useState<SavedLink | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handlePin = async (link: SavedLink) => {
    await updateLink(link.url, { isPinned: !link.isPinned });
  };

  const handleEdit = (link: SavedLink) => {
    setEditingLink(link);
  };

  const handleDelete = async (link: SavedLink) => {
    await moveToTrash(link.url);
    toast.success("Link moved to trash", {
      action: {
        label: "Undo",
        onClick: () => restoreFromTrash(link.url),
      },
    });
  };

  const handleOpen = async (link: SavedLink) => {
    await updateLink(link.url, { lastOpenedAt: Date.now() });
  };

  const handleDragStart = (event: DragStartEvent) => {
    console.log('Drag started:', event);
    setActiveId(event.active.id.toString());
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    console.log('Drag ended:', event);
    setActiveId(null);

    if (!event.over) return;

    const oldIndex = sortedLinks.findIndex(
      (link) => link.url === event.active.id.toString()
    );
    const newIndex = sortedLinks.findIndex(
      (link) => link.url === event.over!.id.toString()
    );

    console.log('Indices:', { oldIndex, newIndex });

    if (oldIndex !== newIndex) {
      const updates = sortedLinks.map((link, index) => {
        if (index === oldIndex) return { ...link, position: newIndex };
        if (index === newIndex) return { ...link, position: oldIndex };
        return link;
      });

      console.log('Updates:', updates);

      // Update positions in database
      await Promise.all(
        updates.map((link) => updateLink(link.url, { position: link.position }))
      );
    }
  };

  const filteredLinks = links.filter((link) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        link.title.toLowerCase().includes(query) ||
        link.note.toLowerCase().includes(query) ||
        link.url.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Category filter
    if (selectedCategories.length > 0) {
      const hasSelectedCategory = selectedCategories.some((categoryId) =>
        link.categories?.includes(categoryId)
      );
      if (!hasSelectedCategory) return false;
    }

    // Quick filter
    if (selectedFilter) {
      switch (selectedFilter) {
        case "pinned":
          if (!link.isPinned) return false;
          break;
        case "recent":
          if (!link.lastOpenedAt) return false;
          //TODO: Make this configurable
          const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
          if (link.lastOpenedAt < oneWeekAgo) return false;
          break;
        case "needs-attention":
          //TODO: Implement needs attention filter
          break;
      }
    }

    return true;
  });

  const sortedLinks = [...filteredLinks].sort((a, b) => {
    // First sort by pinned status
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    // Then sort by position if available
    if (a.position !== undefined && b.position !== undefined) {
      return a.position - b.position;
    }

    // Finally sort by timestamp
    return b.timestamp - a.timestamp;
  });

  if (sortedLinks.length === 0) {
    return (
      <div className="flex items-center justify-center h-[100px] text-sm text-muted-foreground">
        <p>No links found</p>
      </div>
    );
  }

  return (
    <>
      <ScrollArea className="flex-1 px-2">
        {isReordering ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortedLinks.map((link) => link.url)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-2 gap-2 pb-2">
                {sortedLinks.map((link) => (
                  <SortableLink
                    key={link.url}
                    link={link}
                    categories={categories}
                    onPin={handlePin}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onOpen={() => handleOpen(link)}
                  />
                ))}
              </div>
            </SortableContext>
            <DragOverlay>
              {activeId ? (
                <LinkCard
                  link={sortedLinks.find((link) => link.url === activeId)!}
                  categories={categories}
                  onPin={handlePin}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onOpen={() => {}}
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        ) : (
          <div className="grid grid-cols-2 gap-2 pb-2">
            {sortedLinks.map((link) => (
              <LinkCard
                key={link.url}
                link={link}
                categories={categories}
                onPin={handlePin}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onOpen={() => handleOpen(link)}
              />
            ))}
          </div>
        )}
      </ScrollArea>
      <SaveLinkView
        isOpen={!!editingLink}
        setIsOpen={() => setEditingLink(null)}
        editingLink={editingLink}
      />
    </>
  );
};
