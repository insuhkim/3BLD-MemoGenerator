import { Color, Cube, solvedCube } from "react-rubiks-cube-utils";
import { Speffz } from "../types/Speffz";
import { Corner } from "../types/Corner";

export function cornerToSpeffz(corner: Corner) {
  const cornerMap = {
    ULB: "AER",
    UBR: "BQN",
    URF: "CMJ",
    UFL: "DIF",
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
  const cornerMap = ["AER", "BQN", "CMJ", "DIF", "UGL", "VKP", "WOT", "XSH"];

  for (let i = 0; i < cornerMap.length; i++) {
    if (cornerMap[i].includes(speffz)) {
      const orientation = cornerMap[i].indexOf(speffz);
      return cornerMap[i][(orientation + (CW ? 1 : 2)) % 3] as Speffz;
    }
  }
  throw new Error(
    "rotateSpeffzCorner: speffz not found in cornerMap: " + speffz
  );
}

export function speffzToCorner(speffz: Speffz) {
  const cornerMap = {
    A: "ULB",
    B: "UBR",
    C: "URF",
    D: "UFL",
    U: "DLF",
    V: "DFR",
    W: "DRB",
    X: "DBL",
  };
  const CWorientations = "EQMIGKOS";
  const orientation = Object.keys(cornerMap).includes(speffz)
    ? 0
    : CWorientations.includes(speffz)
    ? 1
    : 2;
  const orientedSpeffz = (
    orientation === 0 ? speffz : rotateSpeffzCorner(speffz, orientation === 2)
  ) as keyof typeof cornerMap;

  const orientedCorner = cornerMap[orientedSpeffz];
  return [orientedCorner, orientation] as Corner;
}

function speffzToCubeColorCorner(cube: Cube, speffz: Speffz) {
  const cubeMap = {
    A: cube.U[0][0],
    B: cube.U[0][2],
    C: cube.U[2][2],
    D: cube.U[2][0],
    ///////////////
    E: cube.L[0][0],
    F: cube.L[0][2],
    G: cube.L[2][2],
    H: cube.L[2][0],
    ///////////////
    I: cube.F[0][0],
    J: cube.F[0][2],
    K: cube.F[2][2],
    L: cube.F[2][0],
    ///////////////
    M: cube.R[0][0],
    N: cube.R[0][2],
    O: cube.R[2][2],
    P: cube.R[2][0],
    ///////////////
    Q: cube.B[0][0],
    R: cube.B[0][2],
    S: cube.B[2][2],
    T: cube.B[2][0],
    ///////////////
    U: cube.D[0][0],
    V: cube.D[0][2],
    W: cube.D[2][2],
    X: cube.D[2][0],
  };
  return cubeMap[speffz as keyof typeof cubeMap];
}

function colorsToCorner(colors: [Color, Color, Color]) {
  // colors[0]: primary color
  // colors[1], colors[2]: secondary colors in CW order
  const colorToFace = {
    W: "U",
    G: "F",
    B: "B",
    R: "R",
    O: "L",
    Y: "D",
  };
  const idx = colors.findIndex((c) => c === "W" || c === "Y");
  if (idx === -1) throw new Error("No W or Y in colors" + colors);
  const orientedColors = colors.slice(idx).concat(colors.slice(0, idx));
  const orientedFaces = orientedColors.map((color) => colorToFace[color]);
  const corner = [orientedFaces.join(""), (3 - idx) % 3] as Corner;
  if (corner === undefined) throw new Error("corner is undefined");
  return corner;
}

function speffzToCubeCorner(cube: Cube, speffz: Speffz) {
  const color1 = speffzToCubeColorCorner(cube, speffz);
  const color2 = speffzToCubeColorCorner(cube, rotateSpeffzCorner(speffz));
  const color3 = speffzToCubeColorCorner(
    cube,
    rotateSpeffzCorner(speffz, false)
  );
  return colorsToCorner([color1, color2, color3]);
}

export function isSameCornerSpeffz(c1: Speffz, c2: Speffz) {
  const corner1 = speffzToCorner(c1);
  const corner2 = speffzToCorner(c2);
  return corner1[0] === corner2[0];
}

export default function makeCornerMemo(
  cube: Cube,
  buffer: Speffz,
  priority: Speffz[] = []
) {
  const solved = solvedCube({ type: "3x3" });
  const allOrientedCorners: Speffz[] = ["A", "B", "C", "D", "U", "V", "W", "X"];
  const to_visit: Speffz[] = priority.concat(allOrientedCorners);
  const nextTarget = (cube: Cube, current: Speffz) =>
    cornerToSpeffz(speffzToCubeCorner(cube, current));

  const getCycle = (target: Speffz, cycleStart: Speffz): Speffz[] =>
    speffzToCorner(target)[0] === speffzToCorner(cycleStart)[0]
      ? [target]
      : [target, ...getCycle(nextTarget(cube, target), cycleStart)];

  let unsolvedCorners = to_visit.filter((c) => {
    const corner = speffzToCubeCorner(cube, c);
    const solvedCorner = speffzToCubeCorner(solved, c);
    return corner[0] !== solvedCorner[0] || corner[1] !== solvedCorner[1];
  });

  // const unorientedCorners = speffzCorners.filter((c) => {
  //   const corner = speffzToCubeCorner(cube, c);
  //   const solvedCorner = speffzToCubeCorner(solved, c);
  //   return corner[0] === solvedCorner[0] && corner[1] !== solvedCorner[1];
  // });

  const bufferBlocked =
    speffzToCubeCorner(cube, buffer)[0] ===
    speffzToCubeCorner(solved, buffer)[0];

  let firstCycle: Speffz[] = [];
  if (!bufferBlocked) {
    firstCycle = getCycle(nextTarget(cube, buffer), buffer);
    unsolvedCorners = unsolvedCorners.filter(
      (c) => firstCycle.every((c1) => !isSameCornerSpeffz(c, c1)) // remove the cycle from unsolved corners
    );
  } else
    unsolvedCorners = unsolvedCorners.filter(
      (c) => !isSameCornerSpeffz(c, buffer) // remove the buffer from unsolved corners
    );

  const solveAll = (unsolvedEdge: Speffz[]): Speffz[][] => {
    if (unsolvedEdge.length === 0) return [];
    const start = unsolvedEdge[0];
    const target = nextTarget(cube, start);
    const cycle = getCycle(target, start);
    unsolvedEdge = unsolvedEdge.filter(
      (c) => cycle.every((c1) => !isSameCornerSpeffz(c, c1)) // remove the cycle from unsolved corners
    );
    cycle.unshift(start);
    return [cycle, ...solveAll(unsolvedEdge)];
  };

  let result = solveAll(unsolvedCorners);
  if (!bufferBlocked) {
    firstCycle.pop();
    result.unshift(firstCycle);
  }
  return result;
}
