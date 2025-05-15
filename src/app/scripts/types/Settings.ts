export type CycleNotationStyle = "parenthesis" | "vertical" | "none";
export type Settings = {
  edgePriority: string;
  cornerPriority: string;
  edgeBuffer: string;
  cornerBuffer: string;
  resultSeparator: string;
  cycleStyle: CycleNotationStyle;
};
