export type OrientedEdge =
  | "UR"
  | "UF"
  | "UL"
  | "UB"
  | "DF"
  | "DR"
  | "DL"
  | "DB"
  | "FR"
  | "FL"
  | "BL"
  | "BR";

export type Edge = [OrientedEdge, boolean];
