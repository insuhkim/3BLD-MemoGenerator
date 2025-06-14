import {
  cornerToSpeffz,
  isSameCornerSpeffz,
  speffzToCorner,
} from "../makeMemo/makeCornerMemo";
import { Corner } from "../types/Corner";
import { CycleNotationStyle, FlippedCornerStyle } from "../types/Settings";
import { Speffz } from "../types/Speffz";
import makeLetterpair from "./makeLetterpair";

function getFlippedCornerStringRepresentation(
  cycle: Speffz[],
  flippedCornerStyle: FlippedCornerStyle
): string {
  const cornerFrom = speffzToCorner(cycle[0]);
  const cornerTo = speffzToCorner(cycle[1]);

  // Determine if the twist is clockwise
  // (cornerFrom[1] - cornerTo[1] + 3) % 3 gives:
  // 1 for Clockwise (e.g., 0 -> 2, 1 -> 0, 2 -> 1)
  // 2 for Counter-Clockwise (e.g., 0 -> 1, 1 -> 2, 2 -> 0)
  const isClockwiseTwist = (cornerFrom[1] - cornerTo[1] + 3) % 3 === 1;

  let stickerOrientationToShow: 1 | 2;
  if (flippedCornerStyle === "W/Y") {
    stickerOrientationToShow = isClockwiseTwist ? 1 : 2;
  } else {
    // flippedCornerStyle === "top/bottom"
    stickerOrientationToShow = isClockwiseTwist ? 2 : 1;
  }

  const showingCorner: Corner = [cornerFrom[0], stickerOrientationToShow];
  return ` [${cornerToSpeffz(showingCorner)}]`;
}

export default function makeCornerLetterPair(
  memo: Speffz[][],
  separator: string = ", ",
  cycleStyle: CycleNotationStyle = "parenthesis",
  flippedCornerStyle: FlippedCornerStyle = "none"
): string {
  if (memo.length === 0) {
    return "";
  }

  if (flippedCornerStyle === "none") {
    return makeLetterpair(memo, separator, cycleStyle);
  }

  const isFlippedCorner = (cycle: Speffz[]) =>
    cycle.length === 2 && isSameCornerSpeffz(cycle[0], cycle[1]);

  const flippedCornerCycles = memo.filter(isFlippedCorner);
  const nonFlippedCornerCycles = memo.filter(
    (cycle) => !isFlippedCorner(cycle)
  );

  const flippedCornersString = flippedCornerCycles
    .map((cycle) =>
      getFlippedCornerStringRepresentation(cycle, flippedCornerStyle)
    )
    .join("");

  return (
    makeLetterpair(nonFlippedCornerCycles, separator, cycleStyle) +
    flippedCornersString
  );
}
