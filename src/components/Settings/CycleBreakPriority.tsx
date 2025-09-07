import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SettingsContext } from "@/context/SettingsContext";
import { Speffz } from "@/utils/types/Speffz";
import { useContext } from "react";
import { X } from "lucide-react";
import { SpeffzEdgeToPosition } from "@/utils/BLDDB/EdgeToURL";
import { SpeffzCornerToPosition } from "@/utils/BLDDB/CornerToURL";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { speffzToScheme } from "@/utils/scheme/speffzToScheme";

const SPEFFZ_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWX".split("") as Speffz[];

interface PriorityTableProps {
  type: "edge" | "corner";
  priority: Speffz[];
  onToggleLetter: (letter: Speffz) => void;
  onClear: () => void;
  scheme: string;
}

function PriorityTable({
  type,
  priority,
  onToggleLetter,
  onClear,
  scheme,
}: PriorityTableProps) {
  const getPriorityIndex = (letter: Speffz) => {
    const index = priority.indexOf(letter);
    return index === -1 ? null : index + 1;
  };

  const isSelected = (letter: Speffz) => priority.includes(letter);

  // Organize letters into rows of 4
  const rows = [];
  for (let i = 0; i < SPEFFZ_LETTERS.length; i += 4)
    rows.push(SPEFFZ_LETTERS.slice(i, i + 4));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">
          {type === "edge" ? "Edge Priority" : "Corner Priority"}
        </Label>
        <Button
          variant="outline"
          size="sm"
          onClick={onClear}
          disabled={priority.length === 0}
        >
          Clear All
        </Button>
      </div>

      <div className="border rounded-lg p-4">
        <Table>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((letter) => {
                  const priorityIndex = getPriorityIndex(letter);
                  const selected = isSelected(letter);

                  return (
                    <TableCell key={letter} className="p-1">
                      <Tooltip>
                        <TooltipContent>
                          {type === "edge"
                            ? SpeffzEdgeToPosition(letter)
                            : SpeffzCornerToPosition(letter)}
                        </TooltipContent>
                        <TooltipTrigger asChild>
                          <Button
                            variant={selected ? "default" : "outline"}
                            size="sm"
                            className={`w-8 h-12 relative ${
                              selected
                                ? "bg-primary text-primary-foreground"
                                : ""
                            }`}
                            onClick={() => onToggleLetter(letter)}
                          >
                            <span className="text-lg font-bold">
                              {speffzToScheme(scheme, letter, type)}
                            </span>
                            {priorityIndex && (
                              <span className="absolute -top-1 -right-1 bg-background text-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center border">
                                {priorityIndex}
                              </span>
                            )}
                          </Button>
                        </TooltipTrigger>
                      </Tooltip>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {priority.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Current Priority Order:
          </Label>
          <div className="flex flex-wrap gap-2">
            {priority.map((letter, index) => (
              <Tooltip key={`${letter}-${index}`}>
                <TooltipContent>
                  {type === "edge"
                    ? SpeffzEdgeToPosition(letter)
                    : SpeffzCornerToPosition(letter)}
                </TooltipContent>
                <TooltipTrigger asChild>
                  <div className="flex items-center bg-primary text-primary-foreground px-2 py-1 rounded-md text-sm">
                    <span className="font-bold">{index + 1}.</span>
                    <span className="ml-1 font-bold">
                      {speffzToScheme(scheme, letter, type)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-auto p-0 hover:bg-primary-foreground/20"
                      onClick={() => onToggleLetter(letter)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </TooltipTrigger>
              </Tooltip>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CycleBreakPriority() {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("SettingsPanel must be used within a SettingsProvider");

  const { settings, setSettings } = context;

  const handleToggleLetter = (type: "edge" | "corner", letter: Speffz) => {
    const priorityKey = type === "edge" ? "edgePriority" : "cornerPriority";
    const currentPriority = settings[priorityKey];

    setSettings((prev) => {
      if (currentPriority.includes(letter)) {
        // Remove the letter
        return {
          ...prev,
          [priorityKey]: currentPriority.filter((l) => l !== letter),
        };
      } else {
        // Add the letter to the end
        return {
          ...prev,
          [priorityKey]: [...currentPriority, letter],
        };
      }
    });
  };

  const handleClear = (type: "edge" | "corner") => {
    const priorityKey = type === "edge" ? "edgePriority" : "cornerPriority";
    setSettings((prev) => ({
      ...prev,
      [priorityKey]: [],
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cycle Break Priority</CardTitle>
        <CardDescription>
          Click on letters to set priority order for cycle breaking after the
          buffer is blocked. Letters will be visited in the order you select
          them. After visiting all selected locations, the rest will be visited
          in oriented, alphabetical Speffz order.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <PriorityTable
            type="edge"
            priority={settings.edgePriority}
            onToggleLetter={(letter) => handleToggleLetter("edge", letter)}
            onClear={() => handleClear("edge")}
            scheme={settings.letteringScheme}
          />
          <PriorityTable
            type="corner"
            priority={settings.cornerPriority}
            onToggleLetter={(letter) => handleToggleLetter("corner", letter)}
            onClear={() => handleClear("corner")}
            scheme={settings.letteringScheme}
          />
        </div>
      </CardContent>
    </Card>
  );
}
