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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SettingsContext } from "@/context/SettingsContext";
import { SpeffzCornerToPosition } from "@/utils/BLDDB/CornerToURL";
import { SpeffzEdgeToOrientedPosition } from "@/utils/BLDDB/EdgeToURL";
import { speffzToScheme } from "@/utils/scheme/speffzToScheme";
import { Speffz } from "@/utils/types/Speffz";
import { useContext } from "react";

export default function BufferSelection() {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("SettingsPanel must be used within a SettingsProvider");

  const AtoX = "ABCDEFGHIJKLMNOPQRSTUVWX";

  const {
    settings: { edgeBuffer, cornerBuffer, letteringScheme },
    setSettings,
  } = context;

  // Sort alphabet by the scheme-transformed letters
  const sortedAlphabetForEdges = AtoX.split("").sort((a, b) =>
    speffzToScheme(letteringScheme, a as Speffz, "edge").localeCompare(
      speffzToScheme(letteringScheme, b as Speffz, "edge"),
    ),
  );

  const sortedAlphabetForCorners = AtoX.split("").sort((a, b) =>
    speffzToScheme(letteringScheme, a as Speffz, "corner").localeCompare(
      speffzToScheme(letteringScheme, b as Speffz, "corner"),
    ),
  );

  const applyEdgePreset = (speffz: Speffz) =>
    `${speffzToScheme(letteringScheme, speffz, "edge")} (${SpeffzEdgeToOrientedPosition(speffz)})`;
  const applyCornerPreset = (speffz: Speffz) =>
    `${speffzToScheme(letteringScheme, speffz, "corner")} (${SpeffzCornerToPosition(speffz)})`;

  const presets = [
    { method: "M2/R2", edge: "U", corner: "V" },
    { method: "Old Pochmann", edge: "B", corner: "A" },
    { method: "3-Style", edge: "C", corner: "C" },
  ];

  return (
    <div className="space-y-6">
      {/* Presets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Presets</CardTitle>
          <CardDescription>
            Select a common buffer set for popular blindfolded methods.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Method</TableHead>
                <TableHead className="text-center">Edge</TableHead>
                <TableHead className="text-center">Corner</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {presets.map((preset) => (
                <TableRow
                  key={preset.method}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() =>
                    setSettings((prev) => ({
                      ...prev,
                      edgeBuffer: preset.edge as Speffz,
                      cornerBuffer: preset.corner as Speffz,
                    }))
                  }
                >
                  <TableCell className="font-medium">{preset.method}</TableCell>
                  <TableCell className="text-center">
                    {applyEdgePreset(preset.edge as Speffz)}
                  </TableCell>
                  <TableCell className="text-center">
                    {applyCornerPreset(preset.corner as Speffz)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Custom Buffer Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Buffer</CardTitle>
          <CardDescription>
            Select your own buffer pieces for edges and corners.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edgeBufferSelect" className="text-sm font-medium">
                Edge Buffer
              </Label>
              <Select
                value={edgeBuffer}
                onValueChange={(value) =>
                  setSettings((prev) => ({
                    ...prev,
                    edgeBuffer: value as Speffz,
                  }))
                }
              >
                <SelectTrigger className="w-full mt-1 font-mono">
                  <SelectValue placeholder="Select buffer" />
                </SelectTrigger>
                <SelectContent className="font-mono">
                  {sortedAlphabetForEdges.map((letter) => (
                    <SelectItem key={letter} value={letter}>
                      {applyEdgePreset(letter as Speffz)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="cornerBufferSelect"
                className="text-sm font-medium"
              >
                Corner Buffer
              </Label>
              <Select
                value={cornerBuffer}
                onValueChange={(value) =>
                  setSettings((prev) => ({
                    ...prev,
                    cornerBuffer: value as Speffz,
                  }))
                }
              >
                <SelectTrigger className="w-full mt-1 font-mono">
                  <SelectValue placeholder="Select buffer" />
                </SelectTrigger>
                <SelectContent className="font-mono">
                  {sortedAlphabetForCorners.map((letter) => (
                    <SelectItem key={letter} value={letter}>
                      {applyCornerPreset(letter as Speffz)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
