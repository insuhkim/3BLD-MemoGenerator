export type CycleNotationStyle = "parenthesis" | "vertical" | "none";
export type FlippedEdgeStyle = "none" | "oriented" | "unoriented";
export type FlippedCornerStyle = "none" | "top/bottom" | "W/Y";
// prettier-ignore
export type Orientation =
    "wg"| "wr"| "wb"| "wo"|
    "yg"| "yr"| "yb"| "yo"|
    "ob"| "ow"| "oy"| "og"|
    "rb"| "rw"| "ry"| "rg"|
    "go"| "gy"| "gw"| "gr"|
    "bo"| "by"| "bw"| "br"
export type CubePreviewStyle = "2D" | "3D";

import { Speffz } from "./Speffz";

export type Settings = {
  edgePriority: Speffz[];
  cornerPriority: Speffz[];
  edgeBuffer: Speffz;
  cornerBuffer: Speffz;
  cycleStyle: CycleNotationStyle;
  showFlippedEdge: FlippedEdgeStyle;
  showFlippedCorner: FlippedCornerStyle;
  cubePreviewStyle: CubePreviewStyle;
  memoSwap: "none" | Speffz;
  memoSwap2: "buffer" | Speffz;
  orientation: Orientation;
  scrambleOrientation: Orientation;
  letteringScheme: string;
  letterPairs: { [key: string]: string };
  useCustomLetterPairsEdge: boolean;
  useCustomLetterPairsCorner: boolean;

  separateLetterPairs: boolean;
  letterPairsEdge: { [key: string]: string };
};
