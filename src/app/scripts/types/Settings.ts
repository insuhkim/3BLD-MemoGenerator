export type CycleNotationStyle = "parenthesis" | "vertical" | "none";
export type FlippedEdgeStyle = "none" | "oriented" | "unoriented";
export type FlippedCornerStyle = "none" | "top/bottom" | "W/Y";

import { Speffz } from "./Speffz";

export type Settings = {
  edgePriority: Speffz[];
  cornerPriority: Speffz[];
  edgeBuffer: Speffz;
  cornerBuffer: Speffz;
  resultSeparator: string;
  cycleStyle: CycleNotationStyle;
  showFlippedEdge: FlippedEdgeStyle;
  showFlippedCorner: FlippedCornerStyle;
};
