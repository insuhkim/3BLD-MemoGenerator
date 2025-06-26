import { getFlippedCornerStringRepresentation } from "@/utils/makeLetterPair/makeCornerLetterPair";
import { isSameCornerSpeffz } from "@/utils/makeMemo/makeCornerMemo";
import { FlippedCornerStyle } from "@/utils/types/Settings";
import { Speffz } from "@/utils/types/Speffz";
import { JSX } from "react";
import MemoPair from "./MemoPair";

export default function MemoResultCorner({
  memo,
  showFlippedCorner,
  buffer,
}: {
  memo: Speffz[][];
  showFlippedCorner: FlippedCornerStyle;
  buffer: Speffz;
}) {
  const components: JSX.Element[] = [];
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
