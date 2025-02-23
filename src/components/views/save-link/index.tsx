import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useCurrentTab, useLinks } from "@/lib/hooks";
import { SavedLink } from "@/lib/types";
import { useRef, useState } from "react";
import { SaveLinkForm } from "./save-link-form";

interface SaveLinkViewProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const SaveLinkView = ({ isOpen, setIsOpen }: SaveLinkViewProps) => {
  const currentTab = useCurrentTab();
  const [showConfirm, setShowConfirm] = useState(false);
  const { saveLink } = useLinks();
  const onConfirm = useRef<Function>(null);

  const handleSave = async (link: SavedLink) => {
    const result = await saveLink(link, () => {
      setShowConfirm(true);
    });

    if (typeof result === "function") {
      onConfirm.current = result;
    } else {
      setIsOpen(false);
    }
  };

  const handleConfirm = () => {
    if (onConfirm.current) {
      onConfirm.current();
    }

    setShowConfirm(false);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogTitle className="sr-only">Save Link</DialogTitle>
          <SaveLinkForm
            url={currentTab?.url || ""}
            title={currentTab?.title || ""}
            onSave={handleSave}
            onCancel={() => setIsOpen(false)}
          />
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        message="This URL already exists. Would you like to update the existing note?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
};
