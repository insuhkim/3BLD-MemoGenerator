import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useContext } from "react";
import { SettingsContext } from "../../context/SettingsContext";

const CUBE_PREVIEW_STYLE_OPTIONS: {
  value: "2D" | "3D";
  label: string;
}[] = [
  { value: "2D", label: "2D" },
  { value: "3D", label: "3D" },
];

export default function PreviewStyle() {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("SettingsPanel must be used within a SettingsProvider");

  const { settings, setSettings } = context;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <Label
            htmlFor="applyScrambleRotationToPreview"
            className="flex flex-col space-y-1"
          >
            <span>Apply scramble rotations to preview</span>
            <span className="font-normal leading-snug text-muted-foreground">
              If enabled, the preview will rotate according to the scramble
              rotations. For example, if the scramble is "Fw", the preview will
              also rotate with "z" move.
            </span>
          </Label>
          <Switch
            id="applyScrambleRotationToPreview"
            checked={settings.applyScrambleRotationToPreview}
            onCheckedChange={(checked) => {
              setSettings((prev) => ({
                ...prev,
                applyScrambleRotationToPreview: !!checked,
              }));
            }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cubePreviewStyleSelect" className="text-sm font-medium">
          Cube Preview Style
        </Label>
        <Select
          value={settings.cubePreviewStyle}
          onValueChange={(value) => {
            setSettings((prev) => ({
              ...prev,
              cubePreviewStyle: value as "2D" | "3D",
            }));
          }}
        >
          <SelectTrigger
            id="cubePreviewStyleSelect"
            className="w-full sm:w-[180px]"
          >
            <SelectValue placeholder="Select preview style" />
          </SelectTrigger>
          <SelectContent>
            {CUBE_PREVIEW_STYLE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
