import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SettingsContext } from "@/context/SettingsContext";
import { Speffz } from "@/utils/types/Speffz";
import { useContext } from "react";

export default function MemoSwap() {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("SettingsPanel must be used within a SettingsProvider");

  const { settings, setSettings } = context;

  const AtoX = "ABCDEFGHIJKLMNOPQRSTUVWX";

  const handleValueChange = (value: string) => {
    setSettings((prev) => ({
      ...prev,
      memoSwap: value as Speffz | "none",
    }));
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Choose Memo Swapping for edge when parity occurs. For example, if parity
        occurs and "B" is chosen, swap those two edges (buffer and "B") and
        “solve” them into the wrong positions.
      </p>
      <div className="space-y-1">
        <Select value={settings.memoSwap} onValueChange={handleValueChange}>
          <SelectTrigger id="memoSwapSelect" className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select memo swap target" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {AtoX.split("").map((letter) => (
              <SelectItem key={letter} value={letter}>
                {letter}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
