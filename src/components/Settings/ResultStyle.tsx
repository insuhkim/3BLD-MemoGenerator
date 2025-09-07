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
import { SettingsContext } from "@/context/SettingsContext";
import {
  CycleNotationStyle,
  FlippedCornerStyle,
  FlippedEdgeStyle,
} from "@/utils/types/Settings";
import { useContext } from "react";

const CYCLE_STYLE_OPTIONS: { value: CycleNotationStyle; label: string }[] = [
  { value: "parenthesis", label: "Parenthesis" },
  { value: "vertical", label: "Vertical" },
  { value: "none", label: "None" },
];

const FLIPPED_EDGE_OPTIONS: { value: FlippedEdgeStyle; label: string }[] = [
  { value: "none", label: "None" },
  { value: "unoriented", label: "Unoriented Edge (e.g. (VO) to [V])" },
  { value: "oriented", label: "Oriented Edge (e.g. (VO) to [O])" },
];

const FLIPPED_CORNER_OPTIONS: {
  value: FlippedCornerStyle;
  label: string;
}[] = [
  { value: "none", label: "None" },
  {
    value: "top/bottom",
    label: "Where the non W/Y face is(e.g. (XH) to [H])",
  },
  { value: "W/Y", label: "Where the W/Y face is (e.g. (XH) to [S])" },
];

export default function ResultStyle() {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("SettingsPanel must be used within a SettingsProvider");
  const { settings, setSettings } = context;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Result Style</CardTitle>
        <CardDescription>
          Customize how the generated memo for cycles, flips, and twists is
          displayed.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="cycleStyleSelect" className="text-sm font-medium">
            Cycle Break Style
          </Label>
          <p className="text-sm text-muted-foreground">
            Choose how cycle breaks are displayed. Note that when using custom
            letter pairs, cycle breaks between letter pairs will not be shown.
          </p>
          <Select
            value={settings.cycleStyle}
            onValueChange={(value) => {
              setSettings((prev) => ({
                ...prev,
                cycleStyle: value as CycleNotationStyle,
              }));
            }}
          >
            <SelectTrigger
              id="cycleStyleSelect"
              className="w-full sm:w-[200px]"
            >
              <SelectValue placeholder="Select cycle style" />
            </SelectTrigger>
            <SelectContent>
              {CYCLE_STYLE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Show Flipped Edge/Corners Separately
            </Label>
            <p className="text-sm text-muted-foreground">
              Display flipped pieces as single letters in brackets.
            </p>
          </div>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label
                htmlFor="flippedEdgeSelect"
                className="text-sm font-medium"
              >
                Edges
              </Label>
              <Select
                value={settings.showFlippedEdge}
                onValueChange={(value) => {
                  setSettings((prev) => ({
                    ...prev,
                    showFlippedEdge: value as FlippedEdgeStyle,
                  }));
                }}
              >
                <SelectTrigger id="flippedEdgeSelect" className="w-full">
                  <SelectValue placeholder="Select flipped edge style" />
                </SelectTrigger>
                <SelectContent>
                  {FLIPPED_EDGE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="flippedCornerSelect"
                className="text-sm font-medium"
              >
                Corners
              </Label>
              <Select
                value={settings.showFlippedCorner}
                onValueChange={(value) => {
                  setSettings((prev) => ({
                    ...prev,
                    showFlippedCorner: value as FlippedCornerStyle,
                  }));
                }}
              >
                <SelectTrigger id="flippedCornerSelect" className="w-full">
                  <SelectValue placeholder="Select flipped corner style" />
                </SelectTrigger>
                <SelectContent>
                  {FLIPPED_CORNER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
