import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { SettingsContext } from "@/context/SettingsContext";
import { ChevronsUpDown, Edit } from "lucide-react";
import { useContext, useEffect, useMemo, useState } from "react";
import { applyScramble } from "@/utils/scramble/applyScramble";

import { makeCornerMemo } from "@/utils/makeMemo/makeCornerMemo";
import { makeEdgeMemo } from "@/utils/makeMemo/makeEdgeMemo";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import MemoResultCorner from "./MemoResultCorner";
import MemoResultEdge from "./MemoResultEdge";
import QuickModify from "./QuickModify";
import { invertRotation, orientationToRotation } from "@/utils/orientation";
import { Cube } from "react-rubiks-cube-utils";

export default function MemoResult({ cube }: { cube: Cube }) {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("SettingsPanel must be used within a SettingsProvider");

  const { settings } = context;
  const [isResultOpen, setIsResultOpen] = useState(true);

  if (!cube) {
    return (
      <div className="mt-2 bg-card text-card-foreground rounded-xl p-3 shadow-md max-w-[600px] mx-auto text-center">
        <h2 className="text-xl font-semibold text-muted-foreground">
          Invalid Scramble
        </h2>
        <p className="text-sm text-muted-foreground">
          Please enter a valid scramble in standard notation.
        </p>
      </div>
    );
  }

  const { corner, edge, hasCornerParity, memoSwap } = useMemo(() => {
    const cornerMemo = makeCornerMemo(
      cube,
      settings.cornerBuffer,
      settings.cornerPriority,
    );
    const hasParity = (memo: string[][]) =>
      memo.reduce((sum, cycle) => sum + cycle.length, 0) % 2 === 1;
    const cornerParity = hasParity(cornerMemo);
    const swap =
      cornerParity && settings.memoSwap !== "none"
        ? settings.memoSwap
        : settings.edgeBuffer;

    const edgeMemo = makeEdgeMemo(
      cube,
      settings.edgeBuffer,
      settings.edgePriority,
      swap,
    );

    return {
      corner: cornerMemo,
      edge: edgeMemo,
      hasCornerParity: cornerParity,
      memoSwap: swap,
    };
  }, [
    cube,
    settings.cornerBuffer,
    settings.cornerPriority,
    settings.memoSwap,
    settings.edgeBuffer,
    settings.edgePriority,
  ]);

  const [edgeMemo, setEdgeMemo] = useState(edge);
  const [cornerMemo, setCornerMemo] = useState(corner);

  useEffect(() => {
    setEdgeMemo(edge);
    setCornerMemo(corner);
  }, [edge, corner]);

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
                <Sheet>
                  <SheetTrigger>
                    <h2 className="text-xl font-semibold text-muted-foreground flex items-center justify-center gap-2 cursor-pointer mb-2 rounded-md hover:bg-accent">
                      Edge
                      <Edit className="h-4 w-4" />
                    </h2>
                  </SheetTrigger>
                  <SheetContent
                    className="overflow-y-auto max-w-2xl mx-auto"
                    side="bottom"
                  >
                    <SheetTitle> Quick Modify Edge Cycle </SheetTitle>
                    <QuickModify
                      memoResult={edgeMemo}
                      setMemoResult={setEdgeMemo}
                      type="edge"
                      scheme={settings.letteringScheme}
                    />
                  </SheetContent>
                </Sheet>
                <MemoResultEdge
                  memo={edgeMemo}
                  showFlippedEdge={settings.showFlippedEdge}
                  buffer={settings.edgeBuffer}
                  cycleStyle={settings.cycleStyle}
                  scheme={settings.letteringScheme}
                  useCustomLetterPairsEdge={settings.useCustomLetterPairsEdge}
                  useSeparateEdgeLetterPairs={settings.separateLetterPairs}
                />
              </div>
            )}
            {edge.length > 0 && corner.length > 0 && (
              <Separator className="my-3 w-3/5 mx-auto" />
            )}
            {corner.length > 0 && (
              <div className="mb-2">
                <Sheet>
                  <SheetTrigger>
                    <h2 className="text-xl font-semibold text-muted-foreground flex items-center justify-center gap-2 cursor-pointer mb-2 rounded-md hover:bg-accent">
                      Corner
                      <Edit className="h-4 w-4" />
                    </h2>
                  </SheetTrigger>
                  <SheetContent className="max-w-2xl mx-auto" side="bottom">
                    <SheetTitle> Quick Modify Corner Cycle</SheetTitle>
                    <QuickModify
                      memoResult={cornerMemo}
                      setMemoResult={setCornerMemo}
                      type="corner"
                      scheme={settings.letteringScheme}
                    />
                  </SheetContent>
                </Sheet>
                <MemoResultCorner
                  memo={cornerMemo}
                  showFlippedCorner={settings.showFlippedCorner}
                  buffer={settings.cornerBuffer}
                  cycleStyle={settings.cycleStyle}
                  edgeBuffer={settings.edgeBuffer}
                  memoSwap={settings.memoSwap === "none" ? undefined : memoSwap}
                  scheme={settings.letteringScheme}
                  useCustomLetterPairsCorner={
                    settings.useCustomLetterPairsCorner
                  }
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
