import { speffzToCorner } from "../makeMemo/cornerHelper";
import { Speffz } from "../types/Speffz";

export function SpeffzCornerToPosition(corner: Speffz): string {
  const [orientedCorner, rotation] = speffzToCorner(corner);
  const face = orientedCorner[rotation];
  const face1 = orientedCorner[(rotation + 1) % 3];
  const face2 = orientedCorner[(rotation + 2) % 3];
  const priority: Record<"U" | "D" | "F" | "B" | "R" | "L", number> = {
    U: 0,
    D: 0,
    F: 1,
    B: 1,
    R: 2,
    L: 2,
  };
  return (
    face +
    (priority[face1 as keyof typeof priority] <
    priority[face2 as keyof typeof priority]
      ? face1 + face2
      : face2 + face1)
  );
}

function positionIndex(position: string): number {
  // This function converts a corner position string to an index.
  // The order of the corners is UFR, UFL, UBR, UBL, DFR, DFL, DBR, DBL.
  const positions = ["UFR", "UBR", "UFL", "UBL", "DFR", "DBR", "DFL", "DBL"];
  return positions.indexOf(position);
}

export function CornerTwistURL(
  position1: Speffz,
  cw1: boolean,
  position2: Speffz,
  cw2: boolean
): string {
  // This function takes two side non W/Y speffz
  // and generates a URL for corner twists in the BLDDB database.
  // See https://v2.blddb.net/twists for more details.
  const i1 = SpeffzCornerToPosition(position1);
  const i2 = SpeffzCornerToPosition(position2);

  let arr = ["", "", "", "", "", "", "", ""];
  arr[positionIndex(i1)] = cw1 ? "cw" : "ccw";
  arr[positionIndex(i2)] = cw2 ? "cw" : "ccw";
  const position = arr.join("-");

  //https://v2.blddb.net/twists?position=--cw-ccw----&mode=manmade
  return `https://v2.blddb.net/twists?position=${position}&mode=manmade`;
}

export function CornerToURL(
  buffer: Speffz,
  position1: Speffz,
  position2: Speffz
): string {
  return `https://v2.blddb.net/corner?position=${SpeffzCornerToPosition(
    buffer
  )}-${SpeffzCornerToPosition(position1)}-${SpeffzCornerToPosition(
    position2
  )}&mode=manmade`;
}
