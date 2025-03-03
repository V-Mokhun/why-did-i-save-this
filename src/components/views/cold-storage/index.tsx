import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { ArchiveRestore, Trash2, ExternalLink } from "lucide-react";
import { useCategories, useLinks } from "@/lib/hooks";
import { toast } from "sonner";
import browser from "webextension-polyfill";
import { LinkCard } from "@/components/shared/link-card";
import { LinkActions, LinkAction } from "@/components/shared/link-actions";
import { SavedLink } from "@/lib/types";
import { formatRelativeTime } from "@/lib/date";
import { PreArchiveNotification } from "@/components/pre-archive-notification";
import { Button } from "@/components/ui/button";

interface ColdStorageViewProps {}

export const ColdStorageView = ({}: ColdStorageViewProps) => {
  const { archivedLinks, restoreFromArchive, moveToTrash, updateLink } =
    useLinks();
  const { categories } = useCategories();
  const [searchQuery, setSearchQuery] = useState("");

  const handleRestore = async (link: SavedLink) => {
    await restoreFromArchive(link.url);
    toast.success("Link restored from archive");
  };

  const handleDelete = async (link: SavedLink) => {
    await moveToTrash(link.url);
    toast.success("Link moved to trash", {
      action: {
        label: "Undo",
        onClick: () => restoreFromArchive(link.url),
      },
    });
  };

  const handleOpen = async (link: SavedLink) => {
    await updateLink(link.url, { lastOpenedAt: Date.now() });
  };

  const filteredLinks = archivedLinks.filter((link) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      link.title.toLowerCase().includes(query) ||
      link.note.toLowerCase().includes(query) ||
      link.url.toLowerCase().includes(query)
    );
  });

  const sortedLinks = [...filteredLinks].sort((a, b) => {
    return (b.archivedAt || 0) - (a.archivedAt || 0);
  });

  const getLinkActions = (): LinkAction[] => [
    {
      label: "Restore",
      icon: <ArchiveRestore className="mr-2 h-4 w-4" />,
      onClick: handleRestore,
    },
    {
      label: "Open link",
      icon: <ExternalLink className="mr-2 h-4 w-4" />,
      onClick: handleOpen,
    },
    {
      label: "Move to trash",
      icon: <Trash2 className="mr-2 h-4 w-4" />,
      onClick: handleDelete,
      className: "text-destructive",
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 border-b sticky top-0 bg-background z-10 w-full mb-2">
        <h1 className="text-xl font-semibold mb-2">Cold Storage</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Links that haven't been accessed for a while are automatically
          archived here.
        </p>
        <Input
          placeholder="Search archived links..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

      <PreArchiveNotification />

      {sortedLinks.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 p-8 text-center">
          <div className="bg-muted rounded-full p-3 mb-4">
            <ArchiveRestore className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-medium mb-1">No archived links</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Links that haven't been accessed for a while will automatically be
            moved here.
          </p>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4">
            {sortedLinks.map((link) => (
              <LinkCard
                key={link.url}
                link={link}
                categories={categories}
                onOpen={() => handleOpen(link)}
                renderActions={(link) => (
                  <div className="flex items-center gap-2">
                    {getLinkActions().map((action) => (
                      <Button
                        key={action.label}
                        onClick={(e) => {
                          e.stopPropagation();
                          action.onClick(link);
                        }}
                        className={`${action.className} cursor-pointer`}
                        title={action.label}
                        variant="ghost"
                        size="icon-xs"
                      >
                        {action.icon}
                      </Button>
                    ))}
                  </div>
                )}
              >
                {link.archivedAt && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Archived {formatRelativeTime(link.archivedAt)}
                  </div>
                )}
              </LinkCard>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};
