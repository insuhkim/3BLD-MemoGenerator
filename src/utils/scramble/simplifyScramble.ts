import { isValidScramble } from "./isValidScramble";

// Cache the dynamically imported modules so they are only loaded once.
let algModule: typeof import("cubing/alg") | null = null;
let puzzlesModule: typeof import("cubing/puzzles") | null = null;

async function loadCubingModules() {
  if (!algModule || !puzzlesModule) {
    [algModule, puzzlesModule] = await Promise.all([
      import("cubing/alg"),
      import("cubing/puzzles"),
    ]);
  }
  return { Alg: algModule.Alg, cube3x3x3: puzzlesModule.cube3x3x3 };
}

export default async function simplifyScramble(
  scramble: string,
): Promise<string> {
  if (isValidScramble(scramble) === false) {
    console.warn("Invalid scramble provided for simplification:", scramble);
    return scramble;
  }

  try {
    const { Alg, cube3x3x3 } = await loadCubingModules();
    const alg = Alg.fromString(scramble).experimentalSimplify({
      puzzleLoader: cube3x3x3,
      cancel: { puzzleSpecificModWrap: "canonical-centered" },
    });
    return alg.toString();
  } catch (error) {
    console.error("Error simplifying scramble:", error);
    return scramble;
  }
}
