import { CategoryManager } from "@/components/popup/category-manager";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLinks, useCategories } from "@/lib/hooks";
import { Category, SavedLink } from "@/lib/types";
import logo from "@assets/img/logo.svg";
import { ConfirmDialog } from "@components/confirm-dialog";
import { PencilIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import browser from "webextension-polyfill";
import { CategorySelector } from "@/components/popup/category-selector";

export default function Popup() {
  const [note, setNote] = useState("");
  const [tags, setTags] = useState("");
  const [currentTab, setCurrentTab] = useState<{
    url: string;
    title: string;
  } | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedUrl, setEditedUrl] = useState("");
  const { saveLink } = useLinks();
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingSave, setPendingSave] = useState<SavedLink | null>(null);
  const { saveCategory, getAllCategories } = useCategories();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

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
        setEditedTitle(activeTab.title);
        setEditedUrl(activeTab.url);
      }
    };

    getCurrentTab();
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      const loadedCategories = await getAllCategories();
      setCategories(loadedCategories);
    };
    loadCategories();
  }, [getAllCategories]);

  const handleSave = async () => {
    if (!currentTab) return;

    try {
      const noteData: SavedLink = {
        url: editedUrl,
        title: editedTitle,
        note,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        categories: selectedCategories,
        timestamp: Date.now(),
      };

      const success = await saveLink(noteData, async () => {
        setPendingSave(noteData);
        setShowConfirm(true);
        return new Promise((resolve) => {
          window.confirmResolve = resolve;
        });
      });

      if (success) {
        setNote("");
        setTags("");
        setSelectedCategories([]);
      }
    } catch (error) {
      console.error("Error in save handler:", error);
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

  const handleSaveCategory = async (category: Category) => {
    const categories = await saveCategory(category);
    setCategories(categories);
  };

  return (
    <Card className="w-[350px]">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <img src={logo} className="h-6 w-6" alt="logo" />
          <h1 className="text-lg font-semibold">Quick Notes</h1>
        </div>
        <div className="flex items-center gap-2">
          <CategoryManager onSaveCategory={handleSaveCategory} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {currentTab && (
          <div className="space-y-2">
            <div className="space-y-1">
              <Label>Title</Label>
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>URL</Label>
              <Input
                value={editedUrl}
                onChange={(e) => setEditedUrl(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="space-y-1">
          <Label>Categories</Label>
          <CategorySelector
            categories={categories}
            selectedCategories={selectedCategories}
            onSelect={setSelectedCategories}
          />
        </div>

        <div className="space-y-1">
          <Label>Note</Label>
          <Textarea
            placeholder="Write your note here..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-20 resize-none"
          />
        </div>

        <div className="space-y-1">
          <Label>Tags</Label>
          <Input
            placeholder="Add tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <Button
          className="w-full"
          onClick={handleSave}
          disabled={!currentTab || !note.trim()}
        >
          Save Note
        </Button>
      </CardContent>

      {showConfirm && (
        <ConfirmDialog
          open={showConfirm}
          onOpenChange={setShowConfirm}
          message="This URL already exists. Would you like to update the existing note?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </Card>
  );
}

declare global {
  interface Window {
    confirmResolve?: (value: boolean) => void;
  }
}
