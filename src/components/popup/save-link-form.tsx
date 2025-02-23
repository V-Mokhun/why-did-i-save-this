import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CategorySelector } from "./category-selector";
import { SavedLink } from "@/lib/types";
import { toast } from "sonner";
import { useState } from "react";
import { useCategories } from "@/lib/hooks";

interface SaveLinkFormProps {
  url: string;
  title: string;
  onSave: (link: SavedLink) => Promise<void>;
  onCancel?: () => void;
}

export function SaveLinkForm({
  url,
  title,
  onSave,
  onCancel,
}: SaveLinkFormProps) {
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedUrl, setEditedUrl] = useState(url);
  const [note, setNote] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { categories } = useCategories();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const urlObj = new URL(editedUrl);

      if (
        urlObj.protocol === "about:" ||
        urlObj.protocol === "chrome:" ||
        urlObj.protocol === "edge:" ||
        urlObj.protocol === "file:"
      ) {
        toast.error("Cannot save this URL", {
          description: "Browser-specific and file URLs cannot be saved.",
          closeButton: true,
        });
        return;
      }

      const noteData: SavedLink = {
        url: editedUrl,
        title: editedTitle,
        note,
        categories: selectedCategories,
        timestamp: Date.now(),
      };

      await onSave(noteData);

      setNote("");
      setSelectedCategories([]);
    } catch (error) {
      toast.error("Invalid URL", {
        description:
          "URLs that start with about:, chrome:, edge:, or file: cannot be saved.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          required
        />
      </div>

      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={!note.trim()}>
          Save Note
        </Button>
      </div>
    </form>
  );
}
