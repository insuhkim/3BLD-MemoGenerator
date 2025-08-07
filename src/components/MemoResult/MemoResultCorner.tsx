import { CornerToURL, CornerTwistURL } from "@/utils/BLDDB/CornerToURL";
import { ParityURL } from "@/utils/BLDDB/ParityURL";
import {
  cornerToSpeffz,
  isSameCornerSpeffz,
  speffzToCorner,
} from "@/utils/makeMemo/makeCornerMemo";
import { speffzToLocation } from "@/utils/speffzToLocation";
import { Corner } from "@/utils/types/Corner";
import { CycleNotationStyle, FlippedCornerStyle } from "@/utils/types/Settings";
import { Speffz } from "@/utils/types/Speffz";
import { JSX } from "react";
import MemoPair from "./MemoPair";

export default function MemoResultCorner({
  memo,
  buffer,
  showFlippedCorner,
  cycleStyle,
  memoSwap,
  edgeBuffer,
  scheme,
}: {
  memo: Speffz[][];
  showFlippedCorner: FlippedCornerStyle;
  buffer: Speffz;
  cycleStyle: CycleNotationStyle;
  edgeBuffer: Speffz;
  scheme: string;
  memoSwap?: Speffz;
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
    const suffix =
      ((cycleBreakMiddle && i + 2 > allTargets.length) || cycleBreakEnd) &&
      cycleStyle === "parenthesis"
        ? ")"
        : "";

    if (cycleBreakStart && cycleStyle === "vertical" && i > 0) {
      components.push(
        <span key={`cycle-break-start-${i}`} className="p-0.5">
          |
        </span>
      );
    }

    const isLastParity = !!allTargets[i + 1];
    const url = isLastParity
      ? CornerToURL(buffer, allTargets[i], allTargets[i + 1])
      : memoSwap
      ? ParityURL(edgeBuffer, memoSwap, buffer, allTargets[i])
      : undefined;

    const target2 = allTargets[i + 1];
    const target2Character = target2
      ? speffzToLocation(scheme, target2, "corner")
      : undefined;

    components.push(
      <MemoPair
        key={`pair-corner-${i}`}
        url={url}
        target1={allTargets[i]}
        target2={target2}
        target1Character={speffzToLocation(scheme, allTargets[i], "corner")}
        target2Character={target2Character}
        infix={infix}
        prefix={prefix}
        suffix={suffix}
      />
    );
  }

  if (showFlippedCorner !== "none") {
    flippedCycles.forEach((cycle, index) => {
      const cornerFrom = speffzToCorner(cycle[0]);
      const cornerTo = speffzToCorner(cycle[1]);

      const isCW = (cornerFrom[1] - cornerTo[1] + 3) % 3 === 1;
      let stickerOrientationToShow: 1 | 2;
      if (showFlippedCorner === "W/Y") {
        stickerOrientationToShow = isCW ? 1 : 2;
      } else {
        // flippedCornerStyle === "top/bottom"
        stickerOrientationToShow = isCW ? 2 : 1;
      }

      const showingCorner: Corner = [cornerFrom[0], stickerOrientationToShow];
      const representation = ` [${cornerToSpeffz(showingCorner)}]`;
      components.push(
        <MemoPair
          key={`flipped-${index}`}
          url={CornerTwistURL(buffer, !isCW, cycle[0], isCW)}
          target1={cycle[0]}
          target2={cycle[1]}
          target1Character={speffzToLocation(scheme, cycle[0], "corner")}
          target2Character={speffzToLocation(scheme, cycle[1], "corner")}
          entireString={representation}
        />
      );
    });
  }
  return (
    <div className="flex flex-wrap gap-x-1 justify-center font-mono text-xl md:text-2xl">
      {components}
    </div>
  );
}
