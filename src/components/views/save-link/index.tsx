import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useCurrentTab, useLinks, useOnboarding } from "@/lib/hooks";
import { SavedLink } from "@/lib/types";
import { useRef, useState } from "react";
import { SaveLinkForm } from "./save-link-form";

interface SaveLinkViewProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  editingLink?: SavedLink | null;
}

export const SaveLinkView = ({
  isOpen,
  setIsOpen,
  editingLink,
}: SaveLinkViewProps) => {
  const currentTab = useCurrentTab();
  const [showConfirm, setShowConfirm] = useState(false);
  const { saveLink, updateLink } = useLinks();
  const { markOnboardingAsSeen } = useOnboarding();
  const onConfirm = useRef<Function>(null);

  const handleSave = async (link: SavedLink) => {
    if (editingLink) {
      const result = await updateLink(editingLink.url, link);
      if (result) {
        setIsOpen(false);
      }
      return;
    }

    const result = await saveLink(link, () => {
      setShowConfirm(true);
    });

    if (typeof result === "function") {
      onConfirm.current = result;
    } else {
      markOnboardingAsSeen();
      setIsOpen(false);
    }
  };

  const handleConfirm = () => {
    if (onConfirm.current) {
      onConfirm.current();
      markOnboardingAsSeen();
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
        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogTitle className="sr-only">Save Link</DialogTitle>
          <SaveLinkForm
            url={editingLink?.url || currentTab?.url || ""}
            title={editingLink?.title || currentTab?.title || ""}
            onSave={handleSave}
            onCancel={() => setIsOpen(false)}
            editingLink={editingLink}
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
