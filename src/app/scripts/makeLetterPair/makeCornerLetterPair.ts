import {
  cornerToSpeffz,
  isSameCornerSpeffz,
  speffzToCorner,
} from "../makeMemo/makeCornerMemo";
import { Corner } from "../types/Corner";
import { CycleNotationStyle, flippedCornerStyle } from "../types/Settings";
import { Speffz } from "../types/Speffz";
import makeLetterpair from "./makeLetterpair";

export default function makeCornerLetterPair(
  memo: Speffz[][],
  seperator: string = ", ",
  cycleStyle: CycleNotationStyle = "parenthesis",
  flippedCornerStyle: flippedCornerStyle = "none"
): string {
  if (flippedCornerStyle === "none")
    return makeLetterpair(memo, seperator, cycleStyle);

  const isFlippedCorner = (cycle: Speffz[]) =>
    cycle.length === 2 && isSameCornerSpeffz(cycle[0], cycle[1]);

  const flippedCorner = memo.filter(isFlippedCorner);
  const nonFlippedCorner = memo.filter((cycle) => !isFlippedCorner(cycle));

  let flippedCornerString = "";
  for (let cycle of flippedCorner) {
    const cornerFrom = speffzToCorner(cycle[0]);
    const cornerTo = speffzToCorner(cycle[1]);
    const CW = (cornerFrom[1] - cornerTo[1] + 3) % 3 === 1;
    const orientation =
      (CW && flippedCornerStyle === "W/Y") ||
      (!CW && flippedCornerStyle === "top/bottom")
        ? 1
        : 2;

    const showingCorner = [cornerFrom[0], orientation] as Corner;
    flippedCornerString += " [" + cornerToSpeffz(showingCorner) + "]";
  }

  return (
    makeLetterpair(nonFlippedCorner, seperator, cycleStyle) +
    flippedCornerString
  );
}
