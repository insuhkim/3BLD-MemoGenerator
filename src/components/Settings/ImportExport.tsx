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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useRef, useState } from "react";

const ImportExport: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm?: () => void;
    showCancel?: boolean;
  }>({
    isOpen: false,
    title: "",
    description: "",
  });

  const handleExport = () => {
    const settingsString = localStorage.getItem("settings");
    if (!settingsString) {
      setDialogState({
        isOpen: true,
        title: "Export Failed",
        description: "No settings found to export.",
      });
      return;
    }

    try {
      const settings = JSON.parse(settingsString);
      const blob = new Blob([JSON.stringify(settings, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "3bld-memo-settings.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting settings:", error);
      setDialogState({
        isOpen: true,
        title: "Export Error",
        description:
          "Failed to export settings. The settings in localStorage might be corrupted.",
      });
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text === "string") {
          // Validate that the imported string is valid JSON
          JSON.parse(text);

          setDialogState({
            isOpen: true,
            title: "Confirm Import",
            description:
              "Are you sure you want to import settings? This will overwrite your current settings.",
            showCancel: true,
            onConfirm: () => {
              localStorage.setItem("settings", text);
              setDialogState({
                isOpen: true,
                title: "Import Successful",
                description:
                  "Settings imported successfully. The page will now reload.",
                onConfirm: () => window.location.reload(),
              });
            },
          });
        }
      } catch (error) {
        console.error("Error parsing settings file:", error);
        setDialogState({
          isOpen: true,
          title: "Import Failed",
          description:
            "Failed to import settings. The file might be corrupted or not a valid settings file.",
        });
      }
    };
    reader.readAsText(file);
    // Reset file input value to allow re-uploading the same file
    event.target.value = "";
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="mt-5">
      <CardHeader>
        <CardTitle>Import / Export Settings</CardTitle>
        <CardDescription>
          Save your settings to a file or load them from one.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Button onClick={handleExport}>Export Settings</Button>
          <Button variant="outline" onClick={handleImportClick}>
            Import Settings
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImport}
            accept=".json"
          />
        </div>
      </CardContent>
      <AlertDialog
        open={dialogState.isOpen}
        onOpenChange={(isOpen) =>
          setDialogState((prev) => ({ ...prev, isOpen }))
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogState.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {dialogState.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {dialogState.showCancel && (
              <AlertDialogCancel>Cancel</AlertDialogCancel>
            )}
            <AlertDialogAction onClick={dialogState.onConfirm}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default ImportExport;
