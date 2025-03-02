import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Archive, X } from "lucide-react";
import { useLinks } from "@/lib/hooks/use-links";
import { useArchiveSettings } from "@/lib/hooks/use-archive-settings";
import { getLinksToBeArchivedSoon } from "@/lib/archive";

interface PreArchiveNotificationProps {
  onDismiss?: () => void;
}

export const PreArchiveNotification = ({
  onDismiss,
}: PreArchiveNotificationProps) => {
  const { allLinks, batchArchiveLinks } = useLinks();
  const { archiveDays, excludedCategories, autoArchiveEnabled } =
    useArchiveSettings();
  const [linksToBeArchived, setLinksToBeArchived] = useState<string[]>([]);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!autoArchiveEnabled) return;

    const soonToBeArchived = getLinksToBeArchivedSoon(
      allLinks,
      archiveDays,
      excludedCategories
    );

    setLinksToBeArchived(soonToBeArchived.map((link) => link.url));
  }, [allLinks, archiveDays, excludedCategories, autoArchiveEnabled]);

  if (linksToBeArchived.length === 0 || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  const handleArchiveNow = async () => {
    await batchArchiveLinks(linksToBeArchived);
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <Alert className="mb-4 border-amber-500">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2">
          <Archive className="h-4 w-4 mt-0.5 text-amber-500" />
          <div>
            <AlertTitle>Links will be archived soon</AlertTitle>
            <AlertDescription>
              {linksToBeArchived.length}{" "}
              {linksToBeArchived.length === 1 ? "link" : "links"} will be
              automatically archived tomorrow.
            </AlertDescription>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleArchiveNow}
            className="text-xs"
          >
            Archive now
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            className="h-6 w-6"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </Alert>
  );
};
