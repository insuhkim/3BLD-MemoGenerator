import { speffzToEdge } from "../makeMemo/makeEdgeMemo";
import { Speffz } from "../types/Speffz";

function SpeffzEdgeToPosition(edge: Speffz): string {
  const [orientedEdge, isFlipped] = speffzToEdge(edge);
  return isFlipped ? orientedEdge.split("").reverse().join("") : orientedEdge;
}

export function Edge2URL(
  buffer: Speffz,
  position1: Speffz,
  position2: Speffz
): string {
  return `https://v2.blddb.net/edge?position=${SpeffzEdgeToPosition(
    buffer
  )}-${SpeffzEdgeToPosition(position1)}-${SpeffzEdgeToPosition(
    position2
  )}&mode=manmade`;
}
