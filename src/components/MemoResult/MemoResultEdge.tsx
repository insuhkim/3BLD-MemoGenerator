import { getFlippedEdgeStringRepresentation } from "@/utils/makeLetterPair/makeEdgeLetterPair";
import { isSameEdgeSpeffz } from "@/utils/makeMemo/makeEdgeMemo";
import { FlippedEdgeStyle } from "@/utils/types/Settings";
import { Speffz } from "@/utils/types/Speffz";
import { JSX } from "react";
import MemoPair from "./MemoPair";

export default function MemoResultEdge({
  memo,
  showFlippedEdge,
  buffer,
}: {
  memo: Speffz[][];
  showFlippedEdge: FlippedEdgeStyle;
  buffer: Speffz;
}) {
  const components: JSX.Element[] = [];
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
  return (
    <div className="flex flex-wrap gap-x-1 justify-center font-mono text-xl md:text-2xl">
      {components.map((component, index) => (
        <span key={index} className="p-0.5">
          {component}
        </span>
      ))}
    </div>
  );
}
