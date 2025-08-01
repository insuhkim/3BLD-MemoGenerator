export type CycleNotationStyle = "parenthesis" | "vertical" | "none";
export type FlippedEdgeStyle = "none" | "oriented" | "unoriented";
export type FlippedCornerStyle = "none" | "top/bottom" | "W/Y";
export type Rotation =
  | ""
  | "y"
  | "y2"
  | "y'"
  | "z2"
  | "z2 y"
  | "z2 y2"
  | "z2 y'"
  | "z'"
  | "z' y"
  | "z' y2"
  | "z' y'"
  | "z"
  | "z y"
  | "z y2"
  | "z y'"
  | "x'"
  | "x' y"
  | "x' y2"
  | "x' y'"
  | "x"
  | "x y"
  | "x y2"
  | "x y'";
export type CubePreviewStyle = "2D" | "3D";

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
  postRotation: Rotation;
  cubePreviewStyle: CubePreviewStyle;
  memoSwap: "none" | Speffz;
  applyScrambleRotationToPreview: boolean;
};
