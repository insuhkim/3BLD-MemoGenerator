import { Color, Cube } from "react-rubiks-cube-utils";
import { Edge } from "../types/Edge";
import { Speffz } from "../types/Speffz";

function edgeToSpeffz(edge: Edge): Speffz {
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

function flipSpeffzEdge(speffz: Speffz): Speffz {
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

function speffzToEdge(speffz: Speffz): Edge {
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

function isSameEdgeSpeffz(c1: Speffz, c2: Speffz) {
  const edge1 = speffzToEdge(c1);
  const edge2 = speffzToEdge(c2);
  return edge1[0] === edge2[0];
}

export {
  colorsToEdge,
  edgeToSpeffz,
  flipEdge,
  flipSpeffzEdge,
  isSameEdgeSpeffz,
  speffzToCubeColorEdge,
  speffzToCubeEdge,
  speffzToEdge,
};
