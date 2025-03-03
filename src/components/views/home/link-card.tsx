import { LinkCard as SharedLinkCard } from "@/components/shared/link-card";
import { checkLinkNeedsAttention } from "@/lib/reminder";
import { Category, SavedLink } from "@/lib/types";
import { AlertCircle, Pin } from "lucide-react";
import browser from "webextension-polyfill";
import { LinkContextMenu } from "./link-context-menu";

interface LinkCardProps {
  link: SavedLink;
  categories: Category[];
  onPin: (link: SavedLink) => void;
  onEdit: (link: SavedLink) => void;
  onDelete: (link: SavedLink) => void;
  onOpen?: () => void;
}

export const LinkCard = ({
  link,
  categories,
  onPin,
  onEdit,
  onDelete,
  onOpen,
}: LinkCardProps) => {
  const handleOpenWithOpenLink = async () => {
    onOpen?.();
    await browser.tabs.create({ url: link.url });
  };

  const needsAttention = checkLinkNeedsAttention(link);

  const renderStatusBadges = (link: SavedLink) => {
    return (
      <>
        {link.isPinned && (
          <Pin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
        )}
        {needsAttention && (
          <AlertCircle className="h-3 w-3 text-amber-500 flex-shrink-0" />
        )}
      </>
    );
  };

  return (
    <LinkContextMenu
      link={link}
      onPin={() => onPin(link)}
      onEdit={() => onEdit(link)}
      onDelete={() => onDelete(link)}
      onOpen={handleOpenWithOpenLink}
    >
      <SharedLinkCard
        link={link}
        categories={categories}
        renderBadges={renderStatusBadges}
        onOpen={onOpen}
        className={needsAttention ? "border-amber-500 shadow-sm" : ""}
      />
    </LinkContextMenu>
  );
};
