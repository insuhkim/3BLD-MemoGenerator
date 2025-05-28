import { Alg } from "cubing/alg";
import { cube3x3x3 } from "cubing/puzzles";

export default function simplifyScramble(scramble: string): string {
  const TEST_ONE_MOVE = /^[RLUDFB]w?(\d+)?'?$/;

  try {
    const alg = Alg.fromString(scramble).experimentalSimplify({
      puzzleLoader: cube3x3x3,
      cancel: { puzzleSpecificModWrap: "canonical-positive" },
    });
    return alg.toString();
  } catch (error) {
    console.error("Error simplifying scramble:", error);
    return scramble; // Return the original scramble if simplification fails
  }
}
