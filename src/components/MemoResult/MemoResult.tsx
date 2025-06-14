import { Separator } from "@/components/ui/separator";
import { SettingsContext } from "@/context/SettingsContext";
import makeCornerLetterPair from "@/utils/makeLetterPair/makeCornerLetterPair";
import makeEdgeLetterPair from "@/utils/makeLetterPair/makeEdgeLetterPair";
import { hasParity } from "@/utils/makeLetterPair/makeLetterpair";
import makeCornerMemo from "@/utils/makeMemo/makeCornerMemo";
import makeEdgeMemo from "@/utils/makeMemo/makeEdgeMemo";
import { useContext } from "react";
import { applyScramble } from "react-rubiks-cube-utils";

export default function MemoResult({ scramble }: { scramble: string }) {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("SettingsPanel must be used within a SettingsProvider");
  }
  const { settings } = context;

  const cube = applyScramble({ type: "3x3", scramble });
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
  const edgeString = makeEdgeLetterPair(
    edge,
    settings.resultSeparator,
    settings.cycleStyle,
    settings.showFlippedEdge
  );
  const cornerString = makeCornerLetterPair(
    corner,
    settings.resultSeparator,
    settings.cycleStyle,
    settings.showFlippedCorner
  );

  return (
    <div className="mt-2 bg-card text-card-foreground rounded-xl p-3 shadow-md max-w-[600px] mx-auto text-center break-words">
      <div className="text-xl md:text-2xl break-words">
        {edgeString && (
          <div className="mb-2">
            <h2 className="text-lg font-semibold text-muted-foreground">
              Edge
            </h2>
            <h3 className="font-mono">{edgeString}</h3>
          </div>
        )}
        {edgeString && cornerString && (
          <Separator className="my-3 w-3/5 mx-auto" />
        )}
        {cornerString && (
          <div className="mt-2">
            <h2 className="text-lg font-semibold text-muted-foreground">
              Corner
            </h2>
            <h3 className="font-mono">{cornerString}</h3>
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
    </div>
  );
}
