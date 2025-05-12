import { solvedCube, Cube, Color } from "react-rubiks-cube-utils";

import { Speffz } from "./Speffz";
import { get } from "http";
import next from "next";

type orientedEdge =
  | "UR"
  | "UF"
  | "UL"
  | "UB"
  | "DF"
  | "DR"
  | "DL"
  | "DB"
  | "FR"
  | "FL"
  | "BL"
  | "BR";
type flipped = boolean;
type Edge = [orientedEdge, flipped];
// WB // WR // WG // WO // GO // GR // BO // BR // YG // YR // YB // YO

/**
 * Converts an edge to its corresponding Speffz notation.
 *
 * @param {Edge} edge - The edge to convert.
 * @returns {Speffz} The Speffz notation for the edge.
 */
function edgeToSpeffz(edge: Edge) {
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

/**
 * Flips the orientation of an edge.
 *
 * @param {Edge} edge - The edge to flip.
 * @returns {Edge} The flipped edge.
 */
function flipEdge(edge: Edge) {
  return [edge[0], !edge[1]] as Edge;
}

/**
 * Flips the orientation of a Speffz edge.
 *
 * @param {Speffz} speffz - The Speffz edge to flip.
 * @returns {Speffz} The flipped Speffz edge.
 */
function flipSpeffzEdge(speffz: Speffz) {
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

/**
 * Converts a Speffz notation to its corresponding edge.
 *
 * @param {Speffz} speffz - The Speffz notation to convert.
 * @returns {Edge} The corresponding edge.
 */
function speffzToEdge(speffz: Speffz) {
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

/**
 * Retrieves the color of a cube face corresponding to a Speffz notation.
 *
 * @param {Cube} cube - The cube to retrieve the color from.
 * @param {Speffz} speffz - The Speffz notation.
 * @returns {Color} The color of the cube face.
 */
function speffzToCubeColor(cube: Cube, speffz: Speffz) {
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

/**
 * Converts two colors to their corresponding edge.
 *
 * @param {[Color, Color]} colors - The two colors to convert.
 * @returns {Edge} The corresponding edge.
 */
function colorsToEdge(colors: [Color, Color]) {
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
  const orientedColors = isFlipped ? colors.reverse() : colors;
  const colorToFace = {
    W: "U",
    G: "F",
    B: "B",
    R: "R",
    O: "L",
    Y: "D",
  };
  const orientedFaces = orientedColors.map(
    (color) => colorToFace[color as keyof typeof colorToFace]
  );
  return [orientedFaces.join("") as orientedEdge, isFlipped] as Edge;
}

/**
 * Converts a Speffz notation to its corresponding edge on the cube.
 *
 * @param {Cube} cube - The cube to retrieve the edge from.
 * @param {Speffz} speffz - The Speffz notation.
 * @returns {Edge} The corresponding edge on the cube.
 */
function speffzToCubeEdge(cube: Cube, speffz: Speffz) {
  const color1 = speffzToCubeColor(cube, speffz);
  const color2 = speffzToCubeColor(cube, flipSpeffzEdge(speffz));
  // console.log("speffzToCubeEdge", speffz, color1, color2);
  return colorsToEdge([color1, color2]);
}

/**
 * Solves the edges of a cube starting from a buffer position.
 *
 * @param {Cube} cube - The cube to solve.
 * @param {Speffz} buffer - The buffer position to start solving from.
 */
export function solveEdges(cube: Cube, buffer: Speffz) {
  const solved = solvedCube({ type: "3x3" });
  const speffzEdges: Speffz[] = [
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

  const nextTarget = (cube: Cube, current: Speffz) => {
    return edgeToSpeffz(speffzToCubeEdge(cube, current));
  };

  const getCycle = (target: Speffz, cycleStart: Speffz): Speffz[] => {
    if (target === cycleStart || target === flipSpeffzEdge(cycleStart))
      return [target];

    const nextTargetBlock = speffzToCubeEdge(cube, target);
    const nextTargetLocation = edgeToSpeffz(nextTargetBlock);
    return [target, ...getCycle(nextTargetLocation, cycleStart)];
  };

  let unsolvedEdge = speffzEdges.filter((c) => {
    const edge = speffzToCubeEdge(cube, c);
    const solvedEdge = speffzToCubeEdge(solved, c);
    return edge[0] !== solvedEdge[0] || edge[1] !== solvedEdge[1];
  });

  const flippedEdge = speffzEdges.filter((c) => {
    const edge = speffzToCubeEdge(cube, c);
    const solvedEdge = speffzToCubeEdge(solved, c);
    return edge[0] === solvedEdge[0] && edge[1] !== solvedEdge[1];
  });

  const bufferBlocked =
    speffzToCubeEdge(cube, buffer)[0] === speffzToCubeEdge(solved, buffer)[0];
  console.log("bufferBlocked", bufferBlocked);

  let firstCycle: Speffz[] = [];
  if (!bufferBlocked) {
    firstCycle = getCycle(nextTarget(cube, buffer), buffer);
    console.log("cycle1", firstCycle);
    unsolvedEdge = unsolvedEdge.filter(
      (c) => !firstCycle.includes(c) && !firstCycle.includes(flipSpeffzEdge(c))
    );
  }

  const solveAll = (unsolvedEdge: Speffz[]): Speffz[][] => {
    if (unsolvedEdge.length === 0) return [];
    const start = unsolvedEdge[0];
    const target = nextTarget(cube, start);
    const cycle = getCycle(target, start);
    unsolvedEdge = unsolvedEdge.filter(
      (c) => !cycle.includes(c) && !cycle.includes(flipSpeffzEdge(c))
    );
    cycle.unshift(start);
    console.log("unsolvedEdge", unsolvedEdge);
    return [cycle, ...solveAll(unsolvedEdge)];
  };

  let result = solveAll(unsolvedEdge);
  if (!bufferBlocked) {
    firstCycle.pop();
    result.unshift(firstCycle);
  }
  return result;
}
