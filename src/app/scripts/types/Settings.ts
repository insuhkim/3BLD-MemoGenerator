export type CycleNotationStyle = "parenthesis" | "vertical" | "none";
export type flippedEdgeStyle = "none" | "oriented" | "unoriented";
export type flippedCornerStyle = "none" | "top/bottom" | "W/Y";

import { Speffz } from "./Speffz";
export type Settings = {
  edgePriority: Speffz[];
  cornerPriority: Speffz[];
  edgeBuffer: Speffz;
  cornerBuffer: Speffz;
  resultSeparator: string;
  cycleStyle: CycleNotationStyle;
  showFlippedEdge: flippedEdgeStyle;
  showFlippedCorner: flippedCornerStyle;
};
