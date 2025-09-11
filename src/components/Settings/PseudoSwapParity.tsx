import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SettingsContext } from "@/context/SettingsContext";
import { SpeffzEdgeToPosition } from "@/utils/BLDDB/EdgeToURL";
import { speffzToScheme } from "@/utils/scheme/speffzToScheme";
import { Speffz } from "@/utils/types/Speffz";
import { useContext } from "react";

export default function PseudoSwap() {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("SettingsPanel must be used within a SettingsProvider");

  const { settings, setSettings } = context;

  const AtoX = "ABCDEFGHIJKLMNOPQRSTUVWX";

  // Sort alphabet by the scheme-transformed letters
  const sortedAlphabet = AtoX.split("").sort((a, b) =>
    speffzToScheme(settings.letteringScheme, a as Speffz, "edge").localeCompare(
      speffzToScheme(settings.letteringScheme, b as Speffz, "edge"),
    ),
  );

  const applyPreset = (speffz: Speffz) =>
    `${speffzToScheme(settings.letteringScheme, speffz, "edge")} (${SpeffzEdgeToPosition(speffz)})`;

  const handleValueChange = (value: string) => {
    setSettings((prev) => ({
      ...prev,
      memoSwap: value as Speffz | "none",
    }));
  };

  const handleValue2Change = (value: string) => {
    setSettings((prev) => ({
      ...prev,
      memoSwap2: value as Speffz | "buffer",
    }));
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pseudo Swap for Parity</CardTitle>
        <CardDescription>
          Choose two edge pieces to swap when parity occurs. This solves the
          parity of edge permutation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6 sm:flex-row sm:gap-8 items-center">
          <Select value={settings.memoSwap} onValueChange={handleValueChange}>
            <SelectTrigger
              id="memoSwapSelect"
              className="w-full sm:w-[200px] font-mono shadow-md"
            >
              <SelectValue placeholder="Select memo swap target" />
            </SelectTrigger>
            <SelectContent className="font-mono">
              <SelectItem value="none">None</SelectItem>
              {sortedAlphabet.map((letter) => (
                <SelectItem key={letter} value={letter}>
                  {applyPreset(letter as Speffz)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={settings.memoSwap2} onValueChange={handleValue2Change}>
            <SelectTrigger
              id="memoSwap2Select"
              className="w-full sm:w-[200px] font-mono shadow-md"
              disabled={settings.memoSwap === "none"}
            >
              <SelectValue placeholder="Select memo swap 2 target" />
            </SelectTrigger>
            <SelectContent className="font-mono">
              <SelectItem value="buffer">Buffer</SelectItem>
              {sortedAlphabet
                .filter((letter) => letter !== settings.edgeBuffer)
                .map((letter) => (
                  <SelectItem key={letter} value={letter}>
                    {applyPreset(letter as Speffz)}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
