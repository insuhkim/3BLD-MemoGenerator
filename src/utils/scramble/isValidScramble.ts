import { Alg } from "cubing/alg";

export function isValidScramble(scramble: string): boolean {
  const TEST_ONE_MOVE = /^[RLUDFB]w?(\d+)?'?$/;
  try {
    const alg = Alg.fromString(scramble).experimentalSimplify();
    for (const node of alg.childAlgNodes()) {
      const move = node.toString().trim();
      if (!TEST_ONE_MOVE.test(move)) return false;
    }
    return true;
  } catch (error) {
    return false;
  }
}
