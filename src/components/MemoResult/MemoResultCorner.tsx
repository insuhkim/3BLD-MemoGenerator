import {
  cornerToSpeffz,
  isSameCornerSpeffz,
  speffzToCorner,
} from "@/utils/makeMemo/makeCornerMemo";
import { Corner } from "@/utils/types/Corner";
import { CycleNotationStyle, FlippedCornerStyle } from "@/utils/types/Settings";
import { Speffz } from "@/utils/types/Speffz";
import { JSX } from "react";
import MemoPair from "./MemoPair";

function getFlippedCornerStringRepresentation(
  cycle: Speffz[],
  flippedCornerStyle: FlippedCornerStyle
): string {
  const cornerFrom = speffzToCorner(cycle[0]);
  const cornerTo = speffzToCorner(cycle[1]);

  const isClockwiseTwist = (cornerFrom[1] - cornerTo[1] + 3) % 3 === 1;

  let stickerOrientationToShow: 1 | 2;
  if (flippedCornerStyle === "W/Y") {
    stickerOrientationToShow = isClockwiseTwist ? 1 : 2;
  } else {
    // flippedCornerStyle === "top/bottom"
    stickerOrientationToShow = isClockwiseTwist ? 2 : 1;
  }

  const showingCorner: Corner = [cornerFrom[0], stickerOrientationToShow];
  return ` [${cornerToSpeffz(showingCorner)}]`;
}

export default function MemoResultCorner({
  memo,
  showFlippedCorner,
  buffer,
  cycleStyle,
}: {
  memo: Speffz[][];
  showFlippedCorner: FlippedCornerStyle;
  buffer: Speffz;
  cycleStyle: CycleNotationStyle;
}) {
  if (memo.length === 0) return null;

  const components: JSX.Element[] = [];

  const isFlipped = (cycle: Speffz[]) =>
    cycle.length === 2 && isSameCornerSpeffz(cycle[0], cycle[1]);

  const flippedCycles = memo.filter(isFlipped);
  const nonFlippedCycles = memo.filter((cycle) => !isFlipped(cycle));

  const cycleBreakIndices = (
    showFlippedCorner === "none" ? memo : nonFlippedCycles
  ).reduce(
    (acc, cycle) => {
      if (cycle.length === 0) return acc;
      const lastIndex = acc.length > 0 ? acc[acc.length - 1] : -1;
      acc.push(lastIndex + cycle.length);
      return acc;
    },
    [-1]
  );

  const allTargets =
    showFlippedCorner === "none" ? memo.flat() : nonFlippedCycles.flat();

  for (let i = 0; i < allTargets.length; i += 2) {
    const cycleBreakMiddle = cycleBreakIndices.includes(i);
    const cycleBreakEnd = cycleBreakIndices.includes(i + 1);
    const cycleBreakStart = cycleBreakIndices.includes(i - 1);

    const infix = cycleBreakMiddle
      ? cycleStyle === "parenthesis"
        ? ")("
        : cycleStyle === "vertical"
        ? "|"
        : ""
      : "";
    const prefix = cycleBreakStart && cycleStyle === "parenthesis" ? "(" : "";
    const suffix = cycleBreakEnd && cycleStyle === "parenthesis" ? ")" : "";

    if (cycleBreakStart && cycleStyle === "vertical" && i > 0) {
      components.push(
        <span key={`cycle-break-start-${i}`} className="p-0.5">
          |
        </span>
      );
    }

    components.push(
      <MemoPair
        key={`pair-corner-${i}`}
        pieceType="corner"
        buffer={buffer}
        target1={allTargets[i]}
        target2={allTargets[i + 1]}
        infix={infix}
        prefix={prefix}
        suffix={suffix}
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
      {components}
    </div>
  );
}
