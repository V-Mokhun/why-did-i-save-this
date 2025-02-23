import { CategoryManager } from "@/components/popup/category-manager";
import { SaveLinkForm } from "@/components/popup/save-link-form";
import { SavedLinksView } from "@/components/popup/saved-links-view";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useLinks, useCategories } from "@/lib/hooks";
import { SavedLink } from "@/lib/types";
import logo from "@assets/img/logo.svg";
import { BookmarkPlus, List, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import browser from "webextension-polyfill";
import { Toaster } from "@/components/ui/sonner";
import { ConfirmDialog } from "@components/confirm-dialog";

export default function Popup() {
  const [currentTab, setCurrentTab] = useState<{
    url: string;
    title: string;
  } | null>(null);
  const { saveLink, links } = useLinks();
  const { categories } = useCategories();
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingSave, setPendingSave] = useState<SavedLink | null>(null);
  const [isViewingMode, setIsViewingMode] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  useEffect(() => {
    const getCurrentTab = async () => {
      const tabs = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });
      const activeTab = tabs[0];
      if (activeTab?.url && activeTab?.title) {
        setCurrentTab({
          url: activeTab.url,
          title: activeTab.title,
        });
      }
    };

    getCurrentTab();
  }, []);

  const handleSave = async (noteData: SavedLink) => {
    const success = await saveLink(noteData, async () => {
      setPendingSave(noteData);
      setShowConfirm(true);
      return new Promise((resolve) => {
        window.confirmResolve = resolve;
      });
    });

    if (success) {
      setShowSaveDialog(false);
    }
  };

  const handleConfirm = () => {
    window.confirmResolve?.(true);
    setShowConfirm(false);
    setPendingSave(null);
  };

  const handleCancel = () => {
    window.confirmResolve?.(false);
    setShowConfirm(false);
    setPendingSave(null);
  };

  return (
    <>
      <Card className="h-[600px] w-md">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2">
            <img src={logo} className="h-6 w-6" alt="logo" />
            <h1 className="text-lg font-semibold">Quick Notes</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsViewingMode(!isViewingMode)}
            >
              {isViewingMode ? (
                <Plus className="h-4 w-4" />
              ) : (
                <List className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {isViewingMode ? (
            <SavedLinksView links={links} categories={categories} />
          ) : (
            currentTab && (
              <SaveLinkForm
                url={currentTab.url}
                title={currentTab.title}
                onSave={handleSave}
              />
            )
          )}
        </CardContent>
      </Card>

      {showConfirm && (
        <ConfirmDialog
          open={showConfirm}
          onOpenChange={setShowConfirm}
          message="This URL already exists. Would you like to update the existing note?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
      <Toaster />
    </>
  );
}

declare global {
  interface Window {
    confirmResolve?: (value: boolean) => void;
  }
}
