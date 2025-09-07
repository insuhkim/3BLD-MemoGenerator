import { speffzToEdge } from "../makeMemo/edgeHelper";
import { Speffz } from "../types/Speffz";

export function SpeffzEdgeToPosition(edge: Speffz): string {
  const [orientedEdge, isFlipped] = speffzToEdge(edge);
  return isFlipped ? orientedEdge.split("").reverse().join("") : orientedEdge;
}

export function EdgeFlipURL(position1: Speffz, position2: Speffz): string {
  return `https://v2.blddb.net/flips?position=${SpeffzEdgeToPosition(
    position1,
  )}-${SpeffzEdgeToPosition(position2)}&mode=manmade`;
}

export function EdgeToURL(
  buffer: Speffz,
  position1: Speffz,
  position2: Speffz,
): string {
  return `https://v2.blddb.net/edge?position=${SpeffzEdgeToPosition(
    buffer,
  )}-${SpeffzEdgeToPosition(position1)}-${SpeffzEdgeToPosition(
    position2,
  )}&mode=manmade`;
}
