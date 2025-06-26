import { speffzToCorner } from "../makeMemo/makeCornerMemo";
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
