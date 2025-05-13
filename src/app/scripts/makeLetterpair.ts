import { Speffz } from "./Speffz";

export default function makeLetterpair(
  memo: Speffz[][],
  seperator: string = ","
): [string, boolean] {
  let memoString = "";
  let count = 0;
  for (let i = 0; i < memo.length; i++) {
    memoString += "(";
    for (let j = 0; j < memo[i].length; j++) {
      if (j > 0 && count % 2 === 0) memoString += seperator;
      memoString += memo[i][j];
      count++;
    }
    memoString += ")";
  }
  const isParity = count % 2 === 1;
  return [memoString, isParity];
}
