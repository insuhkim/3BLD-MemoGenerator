import { Speffz } from "../types/Speffz";
import { SpeffzCornerToPosition } from "./CornerToURL";
import { SpeffzEdgeToPosition } from "./EdgeToURL";

export function ParityURL(
  edge1: Speffz,
  edge2: Speffz,
  corner1: Speffz,
  corner2: Speffz,
): string {
  // This function generates a URL for parity in the BLDDB database.
  // See https://v2.blddb.net/parity for more details.

  // example URL:
  // https://v2.blddb.net/parity?position=UF-*-UFR-FDL&mode=manmade
  return `https://v2.blddb.net/parity?position=${SpeffzEdgeToPosition(
    edge1,
  )}-${SpeffzEdgeToPosition(edge2)}-${SpeffzCornerToPosition(
    corner1,
  )}-${SpeffzCornerToPosition(corner2)}&mode=manmade`;
}
