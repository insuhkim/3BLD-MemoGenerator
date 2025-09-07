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

const CUBE_PREVIEW_STYLE_OPTIONS: {
  value: "2D" | "3D";
  label: string;
}[] = [
  { value: "2D", label: "2D" },
  { value: "3D", label: "3D" },
];

const ORIENTATION_OPTIONS: {
  value: Orientation;
  label: string;
}[] = [
  { value: "wg", label: "White-Green (WG)" },
  { value: "wr", label: "White-Red (WR)" },
  { value: "wb", label: "White-Blue (WB)" },
  { value: "wo", label: "White-Orange (WO)" },
  { value: "yg", label: "Yellow-Green (YG)" },
  { value: "yr", label: "Yellow-Red (YR)" },
  { value: "yb", label: "Yellow-Blue (YB)" },
  { value: "yo", label: "Yellow-Orange (YO)" },
  { value: "ob", label: "Orange-Blue (OB)" },
  { value: "ow", label: "Orange-White (OW)" },
  { value: "oy", label: "Orange-Yellow (OY)" },
  { value: "og", label: "Orange-Green (OG)" },
  { value: "rb", label: "Red-Blue (RB)" },
  { value: "rw", label: "Red-White (RW)" },
  { value: "ry", label: "Red-Yellow (RY)" },
  { value: "rg", label: "Red-Green (RG)" },
  { value: "go", label: "Green-Orange (GO)" },
  { value: "gy", label: "Green-Yellow (GY)" },
  { value: "gw", label: "Green-White (GW)" },
  { value: "gr", label: "Green-Red (GR)" },
  { value: "bo", label: "Blue-Orange (BO)" },
  { value: "by", label: "Blue-Yellow (BY)" },
  { value: "bw", label: "Blue-White (BW)" },
  { value: "br", label: "Blue-Red (BR)" },
];

export default function PreviewStyle() {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("SettingsPanel must be used within a SettingsProvider");

  const { settings, setSettings } = context;

  const colorName = (color: string) => {
    //prettier-ignore
    switch (color) {
      case "w": return "White";
      case "r": return "Red";
      case "o": return "Orange";
      case "g": return "Green";
      case "b": return "Blue";
      case "y": return "Yellow";
    }
  };

  //prettier-ignore
  const orientations = [
    "wg", "wr", "wb", "wo",
    "yg", "yr", "yb", "yo",
    "ob", "ow", "oy", "og",
    "rb", "rw", "ry", "rg",
    "go", "gy", "gw", "gr",
    "bo", "by", "bw", "br",
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cube Preview</CardTitle>
        <CardDescription>
          Customize the appearance and behavior of the cube preview.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
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
