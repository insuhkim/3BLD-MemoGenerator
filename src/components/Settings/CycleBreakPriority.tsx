import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SettingsContext } from "@/context/SettingsContext";
import { Speffz } from "@/utils/types/Speffz";
import { useContext } from "react";

export default function CycleBreakPriority() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("SettingsPanel must be used within a SettingsProvider");
  }

  const { settings, setSettings } = context;
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Cycle Break Priority</Label>
        <p className="text-sm text-muted-foreground">
          Choose which cycle to break first after the buffer is blocked. After
          visiting all provided locations, the rest will be visited in oriented,
          alphabetical Speffz order.
        </p>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
        <div className="flex-1 space-y-2">
          <Label htmlFor="edgePriority" className="text-sm font-medium">
            Edge Priority
          </Label>
          <Input
            id="edgePriority"
            type="text"
            placeholder="e.g. ABC"
            value={settings.edgePriority.join(" ")} // Join array for display
            onChange={(e) => {
              const value = e.target.value;
              const arr = [...value.toUpperCase()].filter(
                (v) => "A" <= v && v <= "X"
              );
              // Ensure unique characters
              const uniqueArr = Array.from(new Set(arr));
              setSettings((prev) => ({
                ...prev,
                edgePriority: uniqueArr as Speffz[],
              }));
            }}
          />
        </div>
        <div className="flex-1 space-y-2">
          <Label htmlFor="cornerPriority" className="text-sm font-medium">
            Corner Priority
          </Label>
          <Input
            id="cornerPriority"
            type="text"
            placeholder="e.g. ABC"
            value={settings.cornerPriority.join(" ")} // Join array for display
            onChange={(e) => {
              const value = e.target.value;
              const arr = [...value.toUpperCase()].filter(
                (v) => "A" <= v && v <= "X"
              );
              // Ensure unique characters
              const uniqueArr = Array.from(new Set(arr));
              setSettings((prev) => ({
                ...prev,
                cornerPriority: uniqueArr as Speffz[],
              }));
            }}
          />
        </div>
      </div>
    </div>
  );
}
