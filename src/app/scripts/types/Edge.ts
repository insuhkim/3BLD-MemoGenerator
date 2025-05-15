type orientedEdge =
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
type flipped = boolean;
export type Edge = [orientedEdge, flipped];
