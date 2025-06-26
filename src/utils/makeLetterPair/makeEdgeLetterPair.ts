import {
  edgeToSpeffz,
  isSameEdgeSpeffz,
  speffzToEdge,
} from "../makeMemo/makeEdgeMemo";
import { Edge } from "../types/Edge";
import { CycleNotationStyle, FlippedEdgeStyle } from "../types/Settings";
import { Speffz } from "../types/Speffz";
import makeLetterpair from "./makeLetterpair";

export function getFlippedEdgeStringRepresentation(
  cycle: Speffz[],
  flippedEdgeStyle: FlippedEdgeStyle
): string {
  const edgePiece = speffzToEdge(cycle[0])[0]; // Get the piece identifier, e.g., "UF"

  // Determine the orientation to use for the letter pair representation.
  // This logic should align with how edgeToSpeffz expects the orientation.
  // If flippedEdgeStyle is "unoriented", this will be true.
  // Otherwise (e.g., "oriented_sticker"), this will be false.
  const orientationValueForShowingEdge: boolean =
    flippedEdgeStyle === "unoriented";

  const showingEdge: Edge = [edgePiece, orientationValueForShowingEdge];
  return ` [${edgeToSpeffz(showingEdge)}]`;
}

export default function makeEdgeLetterPair(
  memo: Speffz[][],
  separator: string = ", ",
  cycleStyle: CycleNotationStyle = "parenthesis",
  flippedEdgeStyle: FlippedEdgeStyle = "none"
): string {
  if (memo.length === 0) {
    return "";
  }

  if (flippedEdgeStyle === "none") {
    return makeLetterpair(memo, separator, cycleStyle);
  }

  const isFlippedEdge = (cycle: Speffz[]) =>
    cycle.length === 2 && isSameEdgeSpeffz(cycle[0], cycle[1]);

  const flippedEdgeCycles = memo.filter(isFlippedEdge);
  const nonFlippedEdgeCycles = memo.filter((cycle) => !isFlippedEdge(cycle));

  const flippedEdgeRepresentationsString = flippedEdgeCycles
    .map((cycle) => getFlippedEdgeStringRepresentation(cycle, flippedEdgeStyle))
    .join("");

  return (
    makeLetterpair(nonFlippedEdgeCycles, separator, cycleStyle) +
    flippedEdgeRepresentationsString
  );
}
