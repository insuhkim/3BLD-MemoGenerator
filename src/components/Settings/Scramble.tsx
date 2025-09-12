import { SettingsContext } from "@/context/SettingsContext";
import { orientations, colorName } from "@/utils/orientation";
import { Orientation } from "@/utils/types/Settings";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useContext } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";

export default function Scramble() {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("SettingsPanel must be used within a SettingsProvider");
  const {
    settings: { scrambleOrientation },
    setSettings,
  } = context;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scramble Orientation</CardTitle>
        <CardDescription>
          Choose the orientation of the cube when scramble starts.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Select
          value={scrambleOrientation}
          onValueChange={(value) => {
            setSettings((prev) => ({
              ...prev,
              scrambleOrientation: value as Orientation,
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
            {orientations.map((orientation) => (
              <SelectItem key={orientation} value={orientation}>
                {colorName(orientation[0])}-{colorName(orientation[1])} (
                {orientation.toUpperCase()})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
