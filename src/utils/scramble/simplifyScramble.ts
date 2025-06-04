import { Alg } from "cubing/alg";
import { cube3x3x3 } from "cubing/puzzles";
import { isValidScramble } from "./isValidScramble";

export default function simplifyScramble(scramble: string): string {
  if (isValidScramble(scramble) === false) {
    console.warn("Invalid scramble provided for simplification:", scramble);
    return scramble; // Return the original scramble if it's invalid
  }

  try {
    const alg = Alg.fromString(scramble).experimentalSimplify({
      puzzleLoader: cube3x3x3,
      cancel: { puzzleSpecificModWrap: "canonical-centered" },
    });
    return alg.toString();
  } catch (error) {
    console.error("Error simplifying scramble:", error);
    return scramble; // Return the original scramble if simplification fails
  }
}
