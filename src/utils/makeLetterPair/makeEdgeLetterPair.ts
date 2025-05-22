import {
  edgeToSpeffz,
  isSameEdgeSpeffz,
  speffzToEdge,
} from "../makeMemo/makeEdgeMemo";
import { Edge } from "../types/Edge";
import { CycleNotationStyle, FlippedEdgeStyle } from "../types/Settings";
import { Speffz } from "../types/Speffz";
import makeLetterpair from "./makeLetterpair";

export default function makeLetterpairEdge(
  memo: Speffz[][],
  separator: string = ", ",
  cycleStyle: CycleNotationStyle = "parenthesis",
  flippedEdgeStyle: FlippedEdgeStyle = "none"
): string {
  if (flippedEdgeStyle === "none") {
    return makeLetterpair(memo, separator, cycleStyle);
  }

  const isFlippedEdge = (cycle: Speffz[]) =>
    cycle.length === 2 && isSameEdgeSpeffz(cycle[0], cycle[1]);

  const flippedEdge = memo.filter(isFlippedEdge);
  const nonFlippedEdge = memo.filter((cycle) => !isFlippedEdge(cycle));

  const flippedEdgeString = flippedEdge
    .map((cycle) => {
      const edge = speffzToEdge(cycle[0]);
      const showingEdge = [edge[0], flippedEdgeStyle === "unoriented"] as Edge;
      return ` [${edgeToSpeffz(showingEdge)}]`;
    })
    .join("");

  return (
    makeLetterpair(nonFlippedEdge, separator, cycleStyle) + flippedEdgeString
  );
}
