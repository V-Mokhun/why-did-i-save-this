import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useBackup } from "@/lib/hooks/use-backup";
import { toast } from "sonner";
import { Download, Upload } from "lucide-react";
import { useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const BackupSection = () => {
  const { exportData, importData } = useBackup();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleExport = async () => {
    try {
      await exportData();
      toast.success("Backup file downloaded successfully");
    } catch (error) {
      toast.error("Failed to create backup");
      console.error(error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setShowImportDialog(true);
  };

  const handleImportConfirm = async () => {
    if (!selectedFile) return;

    try {
      await importData(selectedFile);
      toast.success("Backup imported successfully");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      toast.error("Failed to import backup");
      console.error(error);
    } finally {
      setShowImportDialog(false);
      setSelectedFile(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            Backup & Restore
          </CardTitle>
          <CardDescription>
            Export your data for safekeeping or import from a previous backup.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Button variant="outline" className="w-full" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
            <p className="text-xs text-muted-foreground">
              Download a JSON file containing all your saved links, categories,
              and settings.
            </p>
          </div>

          <div className="space-y-2">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".json"
              onChange={handleFileSelect}
            />
            <Button
              variant="outline"
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Import Data
            </Button>
            <p className="text-xs text-muted-foreground">
              Import data from a previous backup. This will merge with your
              existing data.
            </p>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Import Backup Data</AlertDialogTitle>
            <AlertDialogDescription>
              This will merge the backup data with your existing data. If there
              are any conflicts, the existing data will be preserved. Are you
              sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedFile(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleImportConfirm}>
              Import
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
