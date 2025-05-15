import { Speffz } from "./types/Speffz";
import { CycleNotationStyle } from "./types/Settings";

export function hasParity(memo: Speffz[][]): boolean {
  let count = 0;
  for (let i = 0; i < memo.length; i++) count += memo[i].length;
  return count % 2 === 1;
}

export default function makeLetterpair(
  memo: Speffz[][],
  seperator: string = ", ",
  cycleStyle: CycleNotationStyle = "parenthesis"
): string {
  let cycleMemo: string[] = [];
  let count = 0;
  for (let cycle of memo) {
    let cycleString = "";
    for (let j = 0; j < cycle.length; j++) {
      if ((j > 0 || cycleStyle === "none") && count % 2 === 0 && count !== 0)
        cycleString += seperator;
      cycleString += cycle[j];
      count++;
    }
    cycleMemo.push(cycleString);
  }

  const joinString =
    cycleStyle === "parenthesis" ? ")(" : cycleStyle === "vertical" ? "|" : "";
  let result = cycleMemo.join(joinString);
  if (cycleStyle === "parenthesis") {
    result = "(" + result + ")";
  }

  return result;
}
