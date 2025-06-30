import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
        <div className="flex items-center space-x-2">
          <Checkbox
            id="applyScrambleRotationToPreviewCheckbox"
            checked={settings.applyScrambleRotationToPreview}
            onCheckedChange={(checked) => {
              setSettings((prev) => ({
                ...prev,
                applyScrambleRotationToPreview: !!checked, // Ensure boolean value
              }));
            }}
          />
          <Label
            htmlFor="applyScrambleRotationToPreviewCheckbox"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Apply scramble rotations to preview
          </Label>
        </div>
        <p className="text-sm text-muted-foreground">
          If enabled, the preview will rotate according to the scramble
          rotations. For example, if the scramble is "Fw", the preview will also
          rotate with "z" move.
        </p>
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
