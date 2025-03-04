import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLinks, useOnboarding } from "@/lib/hooks";
import { Plus } from "lucide-react";
import { useState } from "react";
import { SaveLinkView } from "@/components/views/save-link";

export const Onboarding = () => {
  const { allLinks } = useLinks();
  const { hasSeenOnboarding } = useOnboarding();
  const [isSaveLinkDialogOpen, setIsSaveLinkDialogOpen] = useState(false);

  if (allLinks.length > 0 || hasSeenOnboarding) return null;

  return (
    <>
      <Card className="mx-2">
        <CardContent>
          <div className="flex flex-col items-center text-center space-y-4">
            <h2 className="text-xl font-semibold">
              Welcome to Why Did I Save This?
            </h2>
            <p className="text-muted-foreground">
              Start saving links with notes to remember why they mattered to
              you.
            </p>
            <Button
              className="mt-2"
              onClick={() => setIsSaveLinkDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Save Your First Link
            </Button>
          </div>
        </CardContent>
      </Card>

      <SaveLinkView
        isOpen={isSaveLinkDialogOpen}
        setIsOpen={setIsSaveLinkDialogOpen}
      />
    </>
  );
};
