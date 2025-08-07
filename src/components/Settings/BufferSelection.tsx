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
      <SelectTrigger className="w-full mt-1 sm:w-[120px]">
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

export default function BufferSelection() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("SettingsPanel must be used within a SettingsProvider");
  }

  const { settings, setSettings } = context;
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">
          Common buffer pieces for popular blindfolded methods.
        </p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Method</TableHead>
              <TableHead className="text-center">Edge</TableHead>
              <TableHead className="text-center">Corner</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>M2/R2</TableCell>
              <TableCell className="text-center">U</TableCell>
              <TableCell className="text-center">V</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Old Pochmann</TableCell>
              <TableCell className="text-center">B</TableCell>
              <TableCell className="text-center">A</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>3-Style</TableCell>
              <TableCell className="text-center">C</TableCell>
              <TableCell className="text-center">C</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Custom Buffer</Label>
          <p className="text-sm text-muted-foreground">
            Select your own buffer pieces for edges and corners.
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <div className="flex-1 space-y-2">
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
          <div className="flex-1 space-y-2">
            <Label htmlFor="cornerBufferSelect" className="text-sm font-medium">
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
      </div>
    </div>
  );
}
