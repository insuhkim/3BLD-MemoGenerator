import { applyScrambleHelper } from "./react-cube-util";

type Color = "W" | "Y" | "G" | "B" | "R" | "O";
type Face = Color[][];
type Cube = {
  U: Face;
  D: Face;
  L: Face;
  R: Face;
  F: Face;
  B: Face;
};

interface ApplyScrambleProps {
  type: string;
  scramble: string;
  initialCube?: Cube;
}

function applyScramble({ type, scramble, initialCube }: ApplyScrambleProps) {
  return applyScrambleHelper({ type, scramble, initialCube }) as Cube;
}

export type { Cube, Color, Face };
export { applyScramble };
