import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { SettingsContext } from "@/context/SettingsContext";
import makeCornerMemo from "@/utils/makeMemo/makeCornerMemo";
import makeEdgeMemo from "@/utils/makeMemo/makeEdgeMemo";
import { ChevronsUpDown } from "lucide-react";
import { useContext, useState } from "react";
import { applyScramble } from "react-rubiks-cube-utils";

import { convertMoves } from "@/utils/scramble/translateRotation";
import MemoResultCorner from "./MemoResultCorner";
import MemoResultEdge from "./MemoResultEdge";

export default function MemoResult({ scramble }: { scramble: string }) {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("SettingsPanel must be used within a SettingsProvider");

  const { settings } = context;
  const [isResultOpen, setIsResultOpen] = useState(true);

  const [simpleMoves, rotations] = convertMoves(scramble.split(" "));
  const cube = applyScramble({ type: "3x3", scramble: simpleMoves });
  if (!cube) {
    return (
      <div className="mt-2 bg-card text-card-foreground rounded-xl p-3 shadow-md max-w-[600px] mx-auto text-center">
        <h2 className="text-xl font-semibold text-muted-foreground">
          Invalid Scramble {scramble}
        </h2>
        <p className="text-sm text-muted-foreground">
          Please enter a valid scramble in standard notation.
        </p>
      </div>
    );
  }
  const corner = makeCornerMemo(
    cube,
    settings.cornerBuffer,
    settings.cornerPriority
  );
  const hasParity = (memo: string[][]) =>
    memo.reduce((sum, cycle) => sum + cycle.length, 0) % 2 === 1;
  const hasCornerParity = hasParity(corner);
  const memoSwap =
    hasCornerParity && settings.memoSwap !== "none"
      ? settings.memoSwap
      : settings.edgeBuffer;

  const edge = makeEdgeMemo(
    cube,
    settings.edgeBuffer,
    settings.edgePriority,
    memoSwap
  );

  return (
    <div className="mt-2 bg-card text-card-foreground rounded-xl p-3 shadow-md max-w-[600px] mx-auto text-center break-words">
      <Collapsible open={isResultOpen} onOpenChange={setIsResultOpen}>
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between space-x-4 px-1 cursor-pointer">
            <h2 className="text-xl font-semibold text-muted-foreground">
              Result
            </h2>
            {/* The Button is now part of the trigger area but visually distinct */}
            <Button variant="ghost" size="sm" className="w-9 p-0" asChild>
              {/* Using a span or div inside button if `asChild` is used, or just the icon */}
              <div>
                <ChevronsUpDown className="h-4 w-4" />
                <span className="sr-only">Toggle Result</span>
              </div>
            </Button>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="break-words pt-2">
            {edge.length > 0 && (
              <div className="mb-2">
                <h2 className="text-lg font-semibold text-muted-foreground">
                  Edge
                </h2>
                <MemoResultEdge
                  memo={edge}
                  showFlippedEdge={settings.showFlippedEdge}
                  buffer={settings.edgeBuffer}
                  cycleStyle={settings.cycleStyle}
                />
              </div>
            )}
            {edge.length > 0 && corner.length > 0 && (
              <Separator className="my-3 w-3/5 mx-auto" />
            )}
            {corner.length > 0 && (
              <div className="mb-2">
                <h2 className="text-lg font-semibold text-muted-foreground">
                  Corner
                </h2>
                <MemoResultCorner
                  memo={corner}
                  showFlippedCorner={settings.showFlippedCorner}
                  buffer={settings.cornerBuffer}
                  cycleStyle={settings.cycleStyle}
                />
              </div>
            )}
            <Separator className="my-3 w-3/5 mx-auto" />
            <h2
              className={`text-3xl tracking-wide ${
                hasCornerParity
                  ? "font-extrabold text-destructive"
                  : "font-bold text-muted-foreground"
              }`}
            >
              {hasCornerParity ? "Parity" : "No Parity"}
            </h2>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
