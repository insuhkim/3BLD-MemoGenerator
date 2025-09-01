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
import { speffzToScheme } from "@/utils/scheme/speffzToScheme";
import { Speffz } from "@/utils/types/Speffz";
import { useContext } from "react";

export default function PseudoSwap() {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("SettingsPanel must be used within a SettingsProvider");

  const { settings, setSettings } = context;

  const AtoX = "ABCDEFGHIJKLMNOPQRSTUVWX";

  const isSpeffz =
    settings.letteringScheme ===
    "AABD BDCCEEFH FHGGIIJL JLKKMMNP NPOOQQRT RTSSUUVX VXWW";

  const applyPreset = (speffz: Speffz) =>
    isSpeffz
      ? speffz
      : `${speffzToScheme(
          settings.letteringScheme,
          speffz,
          "edge"
        )} (${speffz})`;

  const handleValueChange = (value: string) => {
    setSettings((prev) => ({
      ...prev,
      memoSwap: value as Speffz | "none",
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pseudo Swap for Parity</CardTitle>
        <CardDescription>
          Choose a target to swap with your buffer piece when parity occurs.
          This solves the parity of edge permutation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Select value={settings.memoSwap} onValueChange={handleValueChange}>
          <SelectTrigger id="memoSwapSelect" className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select memo swap target" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {AtoX.split("").map((letter) => (
              <SelectItem key={letter} value={letter}>
                {applyPreset(letter as Speffz)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
