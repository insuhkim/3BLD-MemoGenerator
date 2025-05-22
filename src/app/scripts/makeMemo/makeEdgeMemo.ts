import { solvedCube, Cube, Color } from "react-rubiks-cube-utils";
import { Speffz } from "../types/Speffz";
import { Edge } from "../types/Edge";

export function edgeToSpeffz(edge: Edge): Speffz {
  const edgeMap = {
    UB: "AQ",
    UR: "BM",
    UF: "CI",
    UL: "DE",
    FL: "LF",
    FR: "JP",
    BR: "TN",
    BL: "RH",
    DF: "UK",
    DR: "VO",
    DB: "WS",
    DL: "XG",
  };
  return edgeMap[edge[0] as keyof typeof edgeMap][edge[1] ? 1 : 0] as Speffz;
}

function flipEdge(edge: Edge): Edge {
  return [edge[0], !edge[1]] as Edge;
}

export function flipSpeffzEdge(speffz: Speffz): Speffz {
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
  return flipMap[speffz as keyof typeof flipMap] as Speffz;
}

export function speffzToEdge(speffz: Speffz): Edge {
  const edgeMap = {
    A: "UB",
    B: "UR",
    C: "UF",
    D: "UL",
    J: "FR",
    L: "FL",
    T: "BR",
    R: "BL",
    U: "DF",
    V: "DR",
    W: "DB",
    X: "DL",
  };
  const isFlipped = !Object.keys(edgeMap).includes(speffz);
  return [
    edgeMap[
      (isFlipped ? flipSpeffzEdge(speffz) : speffz) as keyof typeof edgeMap
    ],
    isFlipped,
  ] as Edge;
}

function speffzToCubeColorEdge(cube: Cube, speffz: Speffz): Color {
  const cubeMap = {
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
  return cubeMap[speffz as keyof typeof cubeMap];
}

function colorsToEdge(colors: [Color, Color]): Edge {
  const getPrecedence = (color: Color) => {
    switch (color) {
      case "W":
      case "Y":
        return 0;
      case "G":
      case "B":
        return 1;
      case "R":
      case "O":
        return 2;
    }
  };
  const isFlipped = getPrecedence(colors[0]) > getPrecedence(colors[1]);
  const orientedColors = isFlipped ? colors.slice().reverse() : colors;
  const colorToFace = {
    W: "U",
    G: "F",
    B: "B",
    R: "R",
    O: "L",
    Y: "D",
  };
  const orientedFaces = orientedColors.map((color) => colorToFace[color]);
  return [orientedFaces.join(""), isFlipped] as Edge;
}

function speffzToCubeEdge(cube: Cube, speffz: Speffz): Edge {
  const color1 = speffzToCubeColorEdge(cube, speffz);
  const color2 = speffzToCubeColorEdge(cube, flipSpeffzEdge(speffz));
  return colorsToEdge([color1, color2]);
}

export function isSameEdgeSpeffz(c1: Speffz, c2: Speffz) {
  const edge1 = speffzToEdge(c1);
  const edge2 = speffzToEdge(c2);
  return edge1[0] === edge2[0];
}

export default function makeEdgeMemo(
  cube: Cube,
  buffer: Speffz,
  priority: Speffz[] = []
) {
  const solved = solvedCube({ type: "3x3" });
  const allOrientedEdges: Speffz[] = [
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
  const toVisit: Speffz[] = [...new Set([...priority, ...allOrientedEdges])];

  const nextTarget = (cube: Cube, current: Speffz) =>
    edgeToSpeffz(speffzToCubeEdge(cube, current));

  function getCycle(target: Speffz, cycleStart: Speffz): Speffz[] {
    if (target === cycleStart || target === flipSpeffzEdge(cycleStart)) {
      return [target];
    }
    return [target, ...getCycle(nextTarget(cube, target), cycleStart)];
  }

  let unsolvedEdges = toVisit.filter((c) => {
    const edge = speffzToCubeEdge(cube, c);
    const solvedEdge = speffzToCubeEdge(solved, c);
    return edge[0] !== solvedEdge[0] || edge[1] !== solvedEdge[1];
  });

  const bufferBlocked =
    speffzToCubeEdge(cube, buffer)[0] === speffzToCubeEdge(solved, buffer)[0];

  let firstCycle: Speffz[] = [];
  if (!bufferBlocked) {
    firstCycle = getCycle(nextTarget(cube, buffer), buffer);
    unsolvedEdges = unsolvedEdges.filter((c) =>
      firstCycle.every((c1) => !isSameEdgeSpeffz(c, c1))
    );
  } else {
    unsolvedEdges = unsolvedEdges.filter((c) => !isSameEdgeSpeffz(c, buffer));
  }

  function solveAll(unsolved: Speffz[]): Speffz[][] {
    if (unsolved.length === 0) return [];
    const start = unsolved[0];
    const target = nextTarget(cube, start);
    const cycle = getCycle(target, start);
    const remaining = unsolved.filter((c) =>
      cycle.every((c1) => !isSameEdgeSpeffz(c, c1))
    );
    return [[start, ...cycle], ...solveAll(remaining)];
  }

  const result = solveAll(unsolvedEdges);
  if (!bufferBlocked && firstCycle.length > 0) {
    firstCycle.pop();
    result.unshift(firstCycle);
  }
  return result;
}
