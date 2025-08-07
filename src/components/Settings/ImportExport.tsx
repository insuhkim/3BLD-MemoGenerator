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
import { Settings } from "@/utils/types/Settings";
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

  const isSettings = (obj: any): obj is Settings => {
    if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
      return false;
    }

    // Check for a few key properties to be reasonably sure it's a settings object.
    return (
      "edgePriority" in obj &&
      Array.isArray(obj.edgePriority) &&
      "cornerPriority" in obj &&
      Array.isArray(obj.cornerPriority) &&
      "edgeBuffer" in obj &&
      typeof obj.edgeBuffer === "string" &&
      "cornerBuffer" in obj &&
      typeof obj.cornerBuffer === "string" &&
      "letteringScheme" in obj &&
      typeof obj.letteringScheme === "string"
    );
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
          const parsedSettings = JSON.parse(text);

          if (!isSettings(parsedSettings)) {
            throw new Error("Invalid settings format");
          }

          setDialogState({
            isOpen: true,
            title: "Confirm Import",
            description:
              "Are you sure you want to import settings? This will overwrite your current settings.",
            showCancel: true,
            onConfirm: () => {
              localStorage.setItem("settings", text);
              // Use a timeout to allow the current dialog to close before opening the next one.
              setTimeout(() => {
                setDialogState({
                  isOpen: true,
                  title: "Import Successful",
                  description:
                    "Settings imported successfully. The page will now reload.",
                  onConfirm: () => window.location.reload(),
                });
              }, 100);
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

  const handleResetToDefault = () => {
    setDialogState({
      isOpen: true,
      title: "Confirm Reset",
      description:
        "Are you sure you want to reset all settings to their default values? This action cannot be undone.",
      showCancel: true,
      onConfirm: () => {
        localStorage.removeItem("settings");
        // Use a timeout to allow the current dialog to close before opening the next one.
        setTimeout(() => {
          setDialogState({
            isOpen: true,
            title: "Reset Successful",
            description:
              "All settings have been reset to default. The page will now reload.",
            onConfirm: () => window.location.reload(),
          });
        }, 100);
      },
    });
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
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleExport}>Export Settings</Button>
          <Button variant="outline" onClick={handleImportClick}>
            Import Settings
          </Button>
          <Button variant="destructive" onClick={handleResetToDefault}>
            Reset to Default
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
