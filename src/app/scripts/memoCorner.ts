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

function rotateSpeffzCorner(speffz: Speffz, CW: boolean = true) {
  const cornerMap = ["CIF", "AER", "BQN", "DMJ", "UGL", "XSH", "WOT", "VKP"];
  for (let i = 0; i < cornerMap.length; i++) {
    if (cornerMap[i].includes(speffz)) {
      const orientation = cornerMap[i].indexOf(speffz);
      return cornerMap[i][(orientation + (CW ? 1 : 2)) % 3] as Speffz;
    }
  }
}

///////////////////////////////////
// TODO: implement section below
///////////////////////////////////
function speffzToCorner(speffz: Speffz) {}

function speffzToCubeColor(cube: Cube, speffz: Speffz) {}

function colorsToCorner(colors: [Color, Color, Color]) {}

function speffzToCubeCorner(cube: Cube, speffz: Speffz) {}

function solveCorners(cube: Cube, corner: Corner) {
  const solved = solvedCube({ type: "3x3" });
}
