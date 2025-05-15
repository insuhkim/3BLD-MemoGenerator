export type CycleNotationStyle = "parenthesis" | "vertical" | "none";
import { Speffz } from "./Speffz";
export type Settings = {
  edgePriority: Speffz[];
  cornerPriority: Speffz[];
  edgeBuffer: Speffz;
  cornerBuffer: Speffz;
  resultSeparator: string;
  cycleStyle: CycleNotationStyle;
};
