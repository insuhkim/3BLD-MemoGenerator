export type OrientedCorner =
  | "ULB"
  | "UBR"
  | "URF"
  | "UFL"
  | "DLF"
  | "DFR"
  | "DRB"
  | "DBL";

export type CornerOrientation = 0 | 1 | 2; // 0: normal, 1: CW, 2: CCW

export type Corner = [OrientedCorner, CornerOrientation];
