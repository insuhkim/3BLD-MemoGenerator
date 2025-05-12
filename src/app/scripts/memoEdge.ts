import { solvedCube, Cube, Color } from "react-rubiks-cube-utils";

import { Speffz } from "./Speffz";

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

  const unsolvedEdge = speffzEdges.filter((c) => {
    const edge = speffzToCubeEdge(cube, c);
    const solvedEdge = speffzToCubeEdge(solved, c);
    return edge[0] !== solvedEdge[0] || edge[1] !== solvedEdge[1];
  });
  console.log("unsolvedEdge", unsolvedEdge);

  const flippedEdge = speffzEdges.filter((c) => {
    const edge = speffzToCubeEdge(cube, c);
    const solvedEdge = speffzToCubeEdge(solved, c);
    return edge[0] === solvedEdge[0] && edge[1] !== solvedEdge[1];
  });
  console.log("flippedEdge", flippedEdge);
  //////////////////////////////////////////////////

  // TODO: complete solveEdges function
  const bufferBlocked =
    unsolvedEdge.includes(buffer) ||
    unsolvedEdge.includes(flipSpeffzEdge(buffer));
  let isBlocked = (c: Speffz, start: Speffz) => {
    if (c === start || c === flipEdge(start)) return true;
    else return false;
  };
  if (!bufferBlocked) {
    const getCycle = (c: Speffz, start: Speffz): Speffz[] => {
      if (c === start || c) return [c];
      // if (c === start) return [c];

      const targetBlock = speffzToEdge(cube, c);
      const targetLocation = edgeToSpeffz(targetBlock);
      return [c, ...getCycle(targetLocation, start)];
    };
  }

  return;
  // let isBlocked = (c: Speffz, start: Speffz) => {
  //   if (c === start || c === flipEdge(start)) return true;
  //   else return false;
  // };
  // for (const c of unsolvedEdge) {
  //   if (isBlocked(c, buffer)) continue;
  // }

  // const nextTarget = (c: Speffz) => edgeToSpeffz(speffzToEdge(cube, c));
  // const getCycle = (c: Speffz, start: Speffz): Speffz[] => {
  //   if (isBlocked(c, start)) return [c];
  //   // if (c === start) return [c];

  //   const targetBlock = speffzToEdge(cube, c);
  //   const targetLocation = edgeToSpeffz(targetBlock);
  //   return [c, ...getCycle(targetLocation, start)];
  // };
  // let bufferBlocked = false;

  // const solveAll = (remaining: Speffz[]): Speffz[][] => {
  //   if (remaining.length === 0) return [];

  //   const target = remaining[0];

  //   // check if the buffer is blocked
  //   if (bufferBlocked === false) bufferBlocked = isBlocked(target, buffer);
  //   console.log("buffer", bufferBlocked);

  //   let cycle = getCycle(nextTarget(target), target);

  //   // if buffer is blocked, remove the last element from the cycle
  //   if (bufferBlocked === false) cycle.pop();

  //   console.log("cycle", cycle);
  //   console.log("bufferBlocked", bufferBlocked);
  //   console.log(
  //     "remaining",
  //     remaining.filter((c) => {
  //       return !cycle.includes(c) && !cycle.includes(flipEdge(c));
  //     })
  //   );
  //   return [
  //     cycle,
  //     ...solveAll(
  //       remaining.filter((c) => {
  //         return !cycle.includes(c) && !cycle.includes(flipEdge(c));
  //       })
  //     ),
  //   ];
  // };
  // console.log("solveAll", solveAll(unsolvedEdge));
  // // console.log("getCycle", getCycle(nextTarget(buffer), buffer));
}
