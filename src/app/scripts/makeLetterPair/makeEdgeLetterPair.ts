import {
  edgeToSpeffz,
  isSameEdgeSpeffz,
  speffzToEdge,
} from "../makeMemo/makeEdgeMemo";
import { Edge } from "../types/Edge";
import { CycleNotationStyle, flippedEdgeStyle } from "../types/Settings";
import { Speffz } from "../types/Speffz";
import makeLetterpair from "./makeLetterpair";

export default function makeLetterpairEdge(
  memo: Speffz[][],
  seperator: string = ", ",
  cycleStyle: CycleNotationStyle = "parenthesis",
  flippedEdgeStyle: flippedEdgeStyle = "none"
): string {
  if (flippedEdgeStyle === "none")
    return makeLetterpair(memo, seperator, cycleStyle);

  const isFlippedEdge = (cycle: Speffz[]) =>
    cycle.length === 2 && isSameEdgeSpeffz(cycle[0], cycle[1]);

  const flippedEdge = memo.filter(isFlippedEdge);
  const nonFlippedEdge = memo.filter((cycle) => !isFlippedEdge(cycle));

  let flippedEdgeString = "";
  for (let cycle of flippedEdge) {
    const edge = speffzToEdge(cycle[0]);
    const showingEdge = [edge[0], flippedEdgeStyle === "unoriented"] as Edge;
    flippedEdgeString += " [" + edgeToSpeffz(showingEdge) + "]";
  }

  return (
    makeLetterpair(nonFlippedEdge, seperator, cycleStyle) + flippedEdgeString
  );
}
