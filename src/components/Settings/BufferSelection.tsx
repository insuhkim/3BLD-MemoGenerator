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
import { Speffz } from "@/utils/types/Speffz";
import { useContext } from "react";

function BufferSelectionBox({
  buffer,
  setBuffer,
}: {
  buffer: Speffz;
  setBuffer: (buffer: Speffz) => void;
}) {
  const AtoX = "ABCDEFGHIJKLMNOPQRSTUVWX";

  return (
    <Select
      value={buffer}
      onValueChange={(value) => setBuffer(value as Speffz)}
    >
      <SelectTrigger className="w-full mt-1">
        <SelectValue placeholder="Select buffer" />
      </SelectTrigger>
      <SelectContent>
        {AtoX.split("").map((letter) => (
          <SelectItem key={letter} value={letter}>
            {letter}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

const presets = [
  { method: "M2/R2", edge: "U", corner: "V" },
  { method: "Old Pochmann", edge: "B", corner: "A" },
  { method: "3-Style", edge: "C", corner: "C" },
];

export default function BufferSelection() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("SettingsPanel must be used within a SettingsProvider");
  }

  const { settings, setSettings } = context;
  return (
    <div className="space-y-6">
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
                  <TableCell className="text-center">{preset.edge}</TableCell>
                  <TableCell className="text-center">{preset.corner}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
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
              <BufferSelectionBox
                buffer={settings.edgeBuffer}
                setBuffer={(buffer) =>
                  setSettings((prev) => ({
                    ...prev,
                    edgeBuffer: buffer,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="cornerBufferSelect"
                className="text-sm font-medium"
              >
                Corner Buffer
              </Label>
              <BufferSelectionBox
                buffer={settings.cornerBuffer}
                setBuffer={(buffer) =>
                  setSettings((prev) => ({
                    ...prev,
                    cornerBuffer: buffer,
                  }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
