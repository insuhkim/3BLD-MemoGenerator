import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { SettingsContext } from "@/context/SettingsContext";
import { getFlippedCornerStringRepresentation } from "@/utils/makeLetterPair/makeCornerLetterPair";
import { getFlippedEdgeStringRepresentation } from "@/utils/makeLetterPair/makeEdgeLetterPair";
import { hasParity } from "@/utils/makeLetterPair/makeLetterpair";
import makeCornerMemo, {
  isSameCornerSpeffz,
} from "@/utils/makeMemo/makeCornerMemo";
import makeEdgeMemo, { isSameEdgeSpeffz } from "@/utils/makeMemo/makeEdgeMemo";
import { ChevronsUpDown } from "lucide-react";
import { JSX, useContext, useState } from "react";
import { applyScramble } from "react-rubiks-cube-utils";

import MemoPair from "@/components/MemoPair";
import { convertMoves } from "@/utils/scramble/translateRotation";
import { Speffz } from "@/utils/types/Speffz";

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

  const renderPairs = (
    pieceType: "edge" | "corner",
    memo: Speffz[][],
    buffer: Speffz
  ) => {
    const { showFlippedEdge, showFlippedCorner } = settings;
    const components: JSX.Element[] = [];

    if (pieceType === "edge") {
      const isFlipped = (cycle: Speffz[]) =>
        cycle.length === 2 && isSameEdgeSpeffz(cycle[0], cycle[1]);

      const flippedCycles = memo.filter(isFlipped);
      const nonFlippedCycles = memo.filter((cycle) => !isFlipped(cycle));

      let allTargets = nonFlippedCycles.flat();

      // If not showing flipped separately, treat them as normal pairs
      if (showFlippedEdge === "none") {
        allTargets = allTargets.concat(flippedCycles.flat());
      }

      for (let i = 0; i < allTargets.length; i += 2) {
        components.push(
          <MemoPair
            key={`pair-edge-${i}`}
            pieceType="edge"
            buffer={buffer}
            target1={allTargets[i]}
            target2={allTargets[i + 1]}
          />
        );
      }

      // Render flipped pieces separately if required
      if (showFlippedEdge !== "none") {
        flippedCycles.forEach((cycle, index) => {
          const representation = getFlippedEdgeStringRepresentation(
            cycle,
            showFlippedEdge
          );
          components.push(
            <span
              key={`flipped-edge-${index}`}
              className="p-1 text-muted-foreground"
            >
              {representation}
            </span>
          );
        });
      }
    } else {
      // pieceType === "corner"
      const isFlipped = (cycle: Speffz[]) =>
        cycle.length === 2 && isSameCornerSpeffz(cycle[0], cycle[1]);

      const flippedCycles = memo.filter(isFlipped);
      const nonFlippedCycles = memo.filter((cycle) => !isFlipped(cycle));

      let allTargets = nonFlippedCycles.flat();

      if (showFlippedCorner === "none") {
        allTargets = allTargets.concat(flippedCycles.flat());
      }

      for (let i = 0; i < allTargets.length; i += 2) {
        components.push(
          <MemoPair
            key={`pair-corner-${i}`}
            pieceType="corner"
            buffer={buffer}
            target1={allTargets[i]}
            target2={allTargets[i + 1]}
          />
        );
      }

      if (showFlippedCorner !== "none") {
        flippedCycles.forEach((cycle, index) => {
          const representation = getFlippedCornerStringRepresentation(
            cycle,
            showFlippedCorner
          );
          components.push(
            <span
              key={`flipped-corner-${index}`}
              className="p-1 text-muted-foreground"
            >
              {representation}
            </span>
          );
        });
      }
    }

    return (
      <div className="flex flex-wrap gap-x-1 justify-center font-mono text-xl md:text-2xl">
        {components}
      </div>
    );
  };

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
                {renderPairs("edge", edge, settings.edgeBuffer)}
              </div>
            )}
            {edge.length > 0 && corner.length > 0 && (
              <Separator className="my-3 w-3/5 mx-auto" />
            )}
            {corner.length > 0 && (
              <div className="mt-2">
                <h2 className="text-lg font-semibold text-muted-foreground">
                  Corner
                </h2>
                {renderPairs("corner", corner, settings.cornerBuffer)}
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
