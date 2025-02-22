import logo from "@assets/img/logo.svg";
import { SavedLink, useLinks } from "@/lib/hooks";
import { useEffect, useState } from "react";
import browser from "webextension-polyfill";
import { ConfirmDialog } from "@components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PencilIcon, CheckIcon, XIcon } from "lucide-react";

export default function Popup() {
  const [note, setNote] = useState("");
  const [tags, setTags] = useState("");
  const [currentTab, setCurrentTab] = useState<{
    url: string;
    title: string;
  } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedUrl, setEditedUrl] = useState("");
  const { saveLink } = useLinks();
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingSave, setPendingSave] = useState<SavedLink | null>(null);

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

  const handleSave = async () => {
    if (!currentTab) return;

    try {
      const noteData: SavedLink = {
        url: isEditing ? editedUrl : currentTab.url,
        title: isEditing ? editedTitle : currentTab.title,
        note,
        tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
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
        setIsEditing(false);
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

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset to original values
      if (currentTab) {
        setEditedTitle(currentTab.title);
        setEditedUrl(currentTab.url);
      }
    }
    setIsEditing(!isEditing);
  };

  return (
    <Card className="w-[350px] border-0 bg-gray-800">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <img src={logo} className="h-6 w-6" alt="logo" />
          <h1 className="text-lg font-semibold text-white">Quick Notes</h1>
        </div>
        {currentTab && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-white"
            onClick={handleEditToggle}
          >
            {isEditing ? <XIcon className="h-4 w-4" /> : <PencilIcon className="h-4 w-4" />}
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {currentTab && (
          <div className="space-y-2">
            <div className="space-y-1">
              <Label className="text-xs text-gray-400">Title</Label>
              {isEditing ? (
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="bg-gray-700 border-0 text-white"
                />
              ) : (
                <p className="text-sm font-medium text-white">{currentTab.title}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-gray-400">URL</Label>
              {isEditing ? (
                <Input
                  value={editedUrl}
                  onChange={(e) => setEditedUrl(e.target.value)}
                  className="bg-gray-700 border-0 text-white"
                />
              ) : (
                <p className="text-sm text-gray-400 truncate">{currentTab.url}</p>
              )}
            </div>
          </div>
        )}

        <div className="space-y-1">
          <Label className="text-xs text-gray-400">Note</Label>
          <Textarea
            placeholder="Write your note here..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-[100px] bg-gray-700 border-0 text-white resize-none"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-gray-400">Tags</Label>
          <Input
            placeholder="Add tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="bg-gray-700 border-0 text-white"
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
