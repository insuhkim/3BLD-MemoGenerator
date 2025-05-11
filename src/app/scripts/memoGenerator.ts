import { solvedCube, Cube, Color } from "react-rubiks-cube-utils";

export type Speffz =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "W"
  | "X";
type Edge = Exclude<
  `${Color}${Color}`,
  | "WY"
  | "YW"
  | "OR"
  | "RO"
  | "GB"
  | "BG"
  | "WW"
  | "YY"
  | "RR"
  | "GG"
  | "BB"
  | "OO"
>;

type Corner = "";

export function SpeffzToKoreanEdge(speffz: Speffz, isEdge: boolean) {}

export function EdgeToSpeffz(edge: Edge) {
  const edgeMap = {
    WB: "A",
    BW: "Q",
    WR: "B",
    RW: "M",
    WG: "C",
    GW: "I",
    WO: "D",
    OW: "E",
    BO: "R",
    OB: "H",
    GO: "L",
    OG: "F",
    GR: "J",
    RG: "P",
    BR: "T",
    RB: "N",
    YG: "U",
    GY: "K",
    YR: "V",
    RY: "O",
    YB: "W",
    BY: "S",
    YO: "X",
    OY: "G",
  };
  return edgeMap[edge as keyof typeof edgeMap] as Speffz;
}
function SpeffzToColor(cube: Cube, c: Speffz) {
  const CubeMap = {
    A: cube.U[0][1],
    B: cube.U[1][2],
    C: cube.U[2][1],
    D: cube.U[1][0],
    E: cube.L[0][1],
    F: cube.L[1][2],
    G: cube.L[2][1],
    H: cube.L[1][0],
    I: cube.F[0][1],
    J: cube.F[1][2],
    K: cube.F[2][1],
    L: cube.F[1][0],
    M: cube.R[0][1],
    N: cube.R[1][2],
    O: cube.R[2][1],
    P: cube.R[1][0],
    Q: cube.B[0][1],
    R: cube.B[1][2],
    S: cube.B[2][1],
    T: cube.B[1][0],
    U: cube.D[0][1],
    V: cube.D[1][2],
    W: cube.D[2][1],
    X: cube.D[1][0],
  };
  return CubeMap[c as keyof typeof CubeMap];
}
function FlipEdge(c: Speffz) {
  const flipMap = {
    A: "Q",
    B: "M",
    C: "I",
    D: "E",
    E: "D",
    F: "L",
    G: "X",
    H: "R",
    I: "C",
    J: "P",
    K: "U",
    L: "F",
    M: "B",
    N: "T",
    O: "V",
    P: "J",
    Q: "A",
    R: "H",
    S: "W",
    T: "N",
    U: "K",
    V: "O",
    W: "S",
    X: "G",
  };
  return flipMap[c as keyof typeof flipMap] as Speffz;
}

function SpeffzToEdge(cube: Cube, c: Speffz) {
  return `${SpeffzToColor(cube, c)}${SpeffzToColor(cube, FlipEdge(c))}` as Edge;
}
export function solveEdge(cube: Cube, buffer: Speffz) {
  const solved = solvedCube({ type: "3x3" });
  const soonseo: Speffz[] = [
    "A",
    "B",
    "C",
    "D",
    "L",
    "J",
    "T",
    "R",
    "U",
    "V",
    "W",
    "X",
  ];
  const unsolvedEdge = soonseo.filter(
    (c) => SpeffzToEdge(cube, c) !== SpeffzToEdge(solved, c)
  );

  let isBlocked = (c: Speffz, start: Speffz) => {
    if (c === start || c === FlipEdge(start)) return true;
    else return false;
  };

  const nextTarget = (c: Speffz) => EdgeToSpeffz(SpeffzToEdge(cube, c));
  let getCycle = (c: Speffz, start: Speffz): Speffz[] => {
    if (isBlocked(c, start)) return [];
    const targetBlock = SpeffzToEdge(cube, c);
    const targetLocation = EdgeToSpeffz(targetBlock);
    return [c, ...getCycle(targetLocation, start)];
  };

  console.log("getCycle", getCycle(nextTarget(buffer), buffer));
}
