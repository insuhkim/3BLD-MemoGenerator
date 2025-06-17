import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Rotation } from "@/utils/types/Settings";
import { useContext } from "react";
import { SettingsContext } from "../../context/SettingsContext";

const NO_ROTATION_UI_VALUE = "__NO_ROTATION__"; // Unique key for UI representation of empty string

const POST_ROTATION_OPTIONS: { value: string; label: string }[] = [
  { value: NO_ROTATION_UI_VALUE, label: "(UF)" }, // Use the unique key
  { value: "y", label: "(UR) y" },
  { value: "y2", label: "(UB) y2" },
  { value: "y'", label: "(UL) y'" },
  { value: "z2", label: "(DF) z2" },
  { value: "z2 y", label: "(DL) z2 y" },
  { value: "z2 y2", label: "(DB) z2 y2" },
  { value: "z2 y'", label: "(DR) z2 y'" },
  { value: "z'", label: "(RF) z'" },
  { value: "z' y", label: "(RD) z' y" },
  { value: "z' y2", label: "(RB) z' y2" },
  { value: "z' y'", label: "(RU) z' y'" },
  { value: "z", label: "(LF) z" },
  { value: "z y", label: "(LU) z y" },
  { value: "z y2", label: "(LB) z y2" },
  { value: "z y'", label: "(LD) z y'" },
  { value: "x'", label: "(BU) x'" },
  { value: "x' y", label: "(BR) x' y" },
  { value: "x' y2", label: "(BD) x' y2" },
  { value: "x' y'", label: "(BL) x' y'" },
  { value: "x", label: "(FD) x" },
  { value: "x y", label: "(FR) x y" },
  { value: "x y2", label: "(FU) x y2" },
  { value: "x y'", label: "(FL) x y'" },
];

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
        <Label htmlFor="postRotationSelect" className="text-sm font-medium">
          Post rotations after scramble
        </Label>
        <p className="text-sm text-muted-foreground">
          Apply rotations after applying the scramble in white top and green
          front. Only works with 3D preview. <br /> For example, if you use Blue
          top and Red front, you can select "(BR) x' y" option.
        </p>
        <Select
          value={
            settings.postRotation === ""
              ? NO_ROTATION_UI_VALUE
              : settings.postRotation
          }
          onValueChange={(selectedValue) => {
            const actualValue =
              selectedValue === NO_ROTATION_UI_VALUE ? "" : selectedValue;
            setSettings((prev) => ({
              ...prev,
              postRotation: actualValue as Rotation,
            }));
          }}
        >
          <SelectTrigger
            id="postRotationSelect"
            className="w-full sm:w-[180px]"
          >
            <SelectValue placeholder="Select post rotation" />
          </SelectTrigger>
          <SelectContent>
            {POST_ROTATION_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
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
