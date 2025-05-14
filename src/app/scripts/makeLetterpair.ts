import { Speffz } from "./Speffz";

export default function makeLetterpair(
  memo: Speffz[][],
  seperator: string = ", ",
  showCycle: boolean = true
): [string, boolean] {
  let memoString = "";
  let count = 0;
  for (let i = 0; i < memo.length; i++) {
    if (showCycle) memoString += "(";
    for (let j = 0; j < memo[i].length; j++) {
      if (j > 0 && count % 2 === 0) memoString += seperator;
      memoString += memo[i][j];
      count++;
    }
    if (showCycle) memoString += ")";
  }
  const isParity = count % 2 === 1;
  return [memoString, isParity];
}
