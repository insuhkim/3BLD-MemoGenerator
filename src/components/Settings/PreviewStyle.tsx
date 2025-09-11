import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Orientation } from "../../utils/types/Settings";
import { colorName, orientations } from "@/utils/orientation";

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
    <Card>
      <CardHeader>
        <CardTitle>Cube Preview</CardTitle>
        <CardDescription>
          Customize the appearance and behavior of the cube preview.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border p-4">
          <div className="space-y-2">
            <Label
              htmlFor="cubePreviewStyleSelect"
              className="text-sm font-medium"
            >
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

        <div className="rounded-lg border p-4">
          <div className="space-y-2">
            <Label htmlFor="orientationSelect" className="text-sm font-medium">
              Cube Orientation
            </Label>
            <Select
              value={settings.orientation}
              onValueChange={(value) => {
                setSettings((prev) => ({
                  ...prev,
                  orientation: value as Orientation,
                }));
              }}
            >
              <SelectTrigger
                id="orientationSelect"
                className="w-full sm:w-[200px]"
              >
                <SelectValue placeholder="Select orientation" />
              </SelectTrigger>
              <SelectContent>
                {orientations.map((orientation) => (
                  <SelectItem key={orientation} value={orientation}>
                    {colorName(orientation[0])}-{colorName(orientation[1])} (
                    {orientation.toUpperCase()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
