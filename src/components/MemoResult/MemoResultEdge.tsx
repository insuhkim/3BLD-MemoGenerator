import { EdgeFlipURL, EdgeToURL } from "@/utils/BLDDB/EdgeToURL";
import {
  edgeToSpeffz,
  isSameEdgeSpeffz,
  speffzToEdge,
} from "@/utils/makeMemo/edgeHelper";
import { speffzToScheme } from "@/utils/scheme/speffzToScheme";
import { Edge } from "@/utils/types/Edge";
import { CycleNotationStyle, FlippedEdgeStyle } from "@/utils/types/Settings";
import { Speffz } from "@/utils/types/Speffz";
import { JSX } from "react";
import MemoPair from "./MemoPair";

export default function MemoResultEdge({
  memo,
  showFlippedEdge,
  buffer,
  cycleStyle,
  scheme,
  useCustomLetterPairsEdge,
}: {
  memo: Speffz[][];
  showFlippedEdge: FlippedEdgeStyle;
  buffer: Speffz;
  cycleStyle: CycleNotationStyle;
  scheme: string;
  useCustomLetterPairsEdge: boolean;
}) {
  if (memo.length === 0) return null;

  const components: JSX.Element[] = [];

  const isFlipped = (cycle: Speffz[]) =>
    cycle.length === 2 && isSameEdgeSpeffz(cycle[0], cycle[1]);

  const flippedCycles = memo.filter(isFlipped);
  const nonFlippedCycles = memo.filter((cycle) => !isFlipped(cycle));

  const allTargets =
    showFlippedEdge === "none" ? memo.flat() : nonFlippedCycles.flat();

  const cycleBreakIndices = (
    showFlippedEdge === "none" ? memo : nonFlippedCycles
  ).reduce(
    (acc, cycle) => {
      if (cycle.length === 0) return acc;
      const lastIndex = acc.length > 0 ? acc[acc.length - 1] : -1;
      acc.push(lastIndex + cycle.length);
      return acc;
    },
    [-1],
  );

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
        <span key={`cycle-break-start-${i}`} className="p-0">
          |
        </span>,
      );
    }
    const url = allTargets[i + 1]
      ? isSameEdgeSpeffz(allTargets[i], allTargets[i + 1])
        ? EdgeFlipURL(buffer, allTargets[i])
        : EdgeToURL(buffer, allTargets[i], allTargets[i + 1])
      : undefined;

    const target2 = allTargets[i + 1];
    const target2Character = target2
      ? speffzToScheme(scheme, target2, "edge")
      : undefined;

    components.push(
      <MemoPair
        key={`pair-corner-${i}`}
        url={url}
        target1={allTargets[i]}
        target2={target2}
        target1Character={speffzToScheme(scheme, allTargets[i], "edge")}
        target2Character={target2Character}
        infix={infix}
        prefix={prefix}
        suffix={suffix}
        useCustomLetterPairs={useCustomLetterPairsEdge}
      />,
    );
  }

  // Render flipped pieces separately if required
  if (showFlippedEdge !== "none") {
    flippedCycles.forEach((cycle, index) => {
      const edgePiece = speffzToEdge(cycle[0])[0]; // Get the piece identifier, e.g., "UF"

      const orientationValueForShowingEdge: boolean =
        showFlippedEdge === "unoriented";

      const showingEdge: Edge = [edgePiece, orientationValueForShowingEdge];
      const representation = edgeToSpeffz(showingEdge);
      components.push(
        <MemoPair
          key={`flipped-${index}`}
          url={EdgeFlipURL(buffer, cycle[0])}
          target1={cycle[0]}
          target2={cycle[1]}
          target1Character={speffzToScheme(scheme, cycle[0], "edge")}
          target2Character={speffzToScheme(scheme, cycle[1], "edge")}
          entireString={` [${speffzToScheme(scheme, representation, "edge")}]`}
          useCustomLetterPairs={useCustomLetterPairsEdge}
        />,
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
