import { Speffz } from "./Speffz";
import { Color, Cube, solvedCube } from "react-rubiks-cube-utils";
type orientedCorner =
  | "UFL"
  | "ULB"
  | "UBR"
  | "URF"
  | "DLF"
  | "DBL"
  | "DRB"
  | "DFR";
type orientation = 0 | 1 | 2; // 0: normal, 1: CW, 2: CCW
type Corner = [orientedCorner, orientation];

function cornerToSpeffz(corner: Corner) {
  const cornerMap = {
    ULB: "AER",
    UBR: "BQN",
    UFL: "CIF",
    URF: "DMJ",
    DLF: "UGL",
    DFR: "VKP",
    DRB: "WOT",
    DBL: "XSH",
  };
  return cornerMap[corner[0] as keyof typeof cornerMap][corner[1]] as Speffz;
}

function rotateCorner(corner: Corner, CW: boolean = true) {
  return [corner[0], (corner[1] + (CW ? 1 : 2)) % 3] as Corner;
}

function rotateSpeffzCorner(speffz: Speffz, CW: boolean = true): Speffz {
  const cornerMap = ["CIF", "AER", "BQN", "DMJ", "UGL", "XSH", "WOT", "VKP"];
  for (let i = 0; i < cornerMap.length; i++) {
    if (cornerMap[i].includes(speffz)) {
      const orientation = cornerMap[i].indexOf(speffz);
      return cornerMap[i][(orientation + (CW ? 1 : 2)) % 3] as Speffz;
    }
  }
  return speffz; //never happens
}

function speffzToCorner(speffz: Speffz) {
  const cornerMap = {
    A: "ULB",
    B: "UBR",
    C: "UFL",
    D: "URF",
    U: "DLF",
    V: "DFR",
    W: "DRB",
    X: "DBL",
  };
  const CWorientations = "EQIMGKOS";
  const orientation = Object.keys(cornerMap).includes(speffz)
    ? 0
    : CWorientations.includes(speffz)
    ? 1
    : 2;
  const orientedCorner =
    cornerMap[
      (orientation === 0
        ? speffz
        : rotateSpeffzCorner(
            speffz,
            orientation === 2
          )) as keyof typeof cornerMap
    ];
  return [orientedCorner, orientation] as Corner;
}

function speffzToCubeColorCorner(cube: Cube, speffz: Speffz) {
  const cubeMap = {
    A: cube.U[0][0],
    B: cube.U[0][2],
    C: cube.U[2][2],
    D: cube.U[2][0],
    E: cube.L[0][0],
    F: cube.L[0][2],
    G: cube.L[2][2],
    H: cube.L[2][0],
    I: cube.F[0][0],
    J: cube.F[0][2],
    K: cube.F[2][2],
    L: cube.F[2][0],
    M: cube.R[0][0],
    N: cube.R[0][2],
    O: cube.R[2][2],
    P: cube.R[2][0],
    Q: cube.B[0][0],
    R: cube.B[0][2],
    S: cube.B[2][2],
    T: cube.B[2][0],
    U: cube.D[0][0],
    V: cube.D[0][2],
    W: cube.D[2][2],
    X: cube.D[2][0],
  };
  return cubeMap[speffz as keyof typeof cubeMap];
}

///////////////////////////////////
// TODO: implement section below
///////////////////////////////////

function colorsToCorner(colors: [Color, Color, Color]) {}

function speffzToCubeCorner(cube: Cube, speffz: Speffz) {}

function solveCorners(cube: Cube, corner: Corner) {
  const solved = solvedCube({ type: "3x3" });
}
