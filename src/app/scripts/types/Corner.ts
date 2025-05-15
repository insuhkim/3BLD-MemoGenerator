type orientedCorner =
  | "ULB"
  | "UBR"
  | "URF"
  | "UFL"
  | "DLF"
  | "DFR"
  | "DRB"
  | "DBL";
type orientation = 0 | 1 | 2; // 0: normal, 1: CW, 2: CCW
export type Corner = [orientedCorner, orientation];
