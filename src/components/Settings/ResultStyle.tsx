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

const NO_SEPARATOR_UI_VALUE = "__NO_SEPARATOR__"; // Unique key for UI representation of empty string separator

const CYCLE_STYLE_OPTIONS: { value: CycleNotationStyle; label: string }[] = [
  { value: "parenthesis", label: "Parenthesis" },
  { value: "vertical", label: "Vertical" },
  { value: "none", label: "None" },
];

const SEPARATOR_OPTIONS: { value: string; label: string }[] = [
  { value: ",", label: "Comma" },
  { value: ", ", label: "Comma + Space" },
  { value: " ", label: "Space" },
  { value: NO_SEPARATOR_UI_VALUE, label: "None" },
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
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="cycleStyleSelect" className="text-sm font-medium">
          Cycle Break Style
        </Label>
        <Select
          value={settings.cycleStyle}
          onValueChange={(value) => {
            setSettings((prev) => ({
              ...prev,
              cycleStyle: value as CycleNotationStyle,
            }));
          }}
        >
          <SelectTrigger id="cycleStyleSelect" className="w-full sm:w-[200px]">
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

      <div className="space-y-2">
        <Label htmlFor="resultSeparatorSelect" className="text-sm font-medium">
          Separator
        </Label>
        <Select
          value={
            settings.resultSeparator === ""
              ? NO_SEPARATOR_UI_VALUE
              : settings.resultSeparator
          }
          onValueChange={(selectedValue) => {
            const actualValue =
              selectedValue === NO_SEPARATOR_UI_VALUE ? "" : selectedValue;
            setSettings((prev) => ({
              ...prev,
              resultSeparator: actualValue,
            }));
          }}
        >
          <SelectTrigger
            id="resultSeparatorSelect"
            className="w-full sm:w-[200px]"
          >
            <SelectValue placeholder="Select separator" />
          </SelectTrigger>
          <SelectContent>
            {SEPARATOR_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Show Flipped Edge/Corners Separately
        </Label>
        <div className="space-y-4 pl-2">
          <div className="space-y-1">
            <Label
              htmlFor="flippedEdgeSelect"
              className="text-xs text-muted-foreground"
            >
              Edges:
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
              <SelectTrigger
                id="flippedEdgeSelect"
                className="w-full sm:w-[320px]"
              >
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
          <div className="space-y-1">
            <Label
              htmlFor="flippedCornerSelect"
              className="text-xs text-muted-foreground"
            >
              Corners:
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
              <SelectTrigger
                id="flippedCornerSelect"
                className="w-full sm:w-[320px]"
              >
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
    </div>
  );
}
