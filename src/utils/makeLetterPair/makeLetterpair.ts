import { Speffz } from "../types/Speffz";
import { CycleNotationStyle } from "../types/Settings";

export function hasParity(memo: Speffz[][]): boolean {
  const count = memo.reduce((sum, cycle) => sum + cycle.length, 0);
  return count % 2 === 1;
}

export default function makeLetterpair(
  memo: Speffz[][],
  separator: string = ", ",
  cycleStyle: CycleNotationStyle = "parenthesis"
): string {
  if (memo.length === 0) return "";
  const cycleMemo: string[] = [];
  let count = 0;
  for (const cycle of memo) {
    let cycleString = "";
    for (let j = 0; j < cycle.length; j++) {
      if ((j > 0 || cycleStyle === "none") && count % 2 === 0 && count !== 0)
        cycleString += separator;
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
