import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useRef } from "react";

const ImportExport: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const settingsString = localStorage.getItem("settings");
    if (!settingsString) {
      alert("No settings found to export.");
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
      alert(
        "Failed to export settings. The settings in localStorage might be corrupted."
      );
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

          if (
            window.confirm(
              "Are you sure you want to import settings? This will overwrite your current settings."
            )
          ) {
            localStorage.setItem("settings", text);
            alert("Settings imported successfully. The page will now reload.");
            window.location.reload();
          }
        }
      } catch (error) {
        console.error("Error parsing settings file:", error);
        alert(
          "Failed to import settings. The file might be corrupted or not a valid settings file."
        );
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
    </Card>
  );
};

export default ImportExport;
