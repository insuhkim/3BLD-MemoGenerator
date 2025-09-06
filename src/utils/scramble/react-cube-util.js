// code from https://github.com/UmerKazi/react-rubiks-cube-utils

const UP = "U";
const RIGHT = "R";
const DOWN = "D";
const LEFT = "L";
const FRONT = "F";
const BACK = "B";

const INITIAL_FACES = {
  [UP]: "W",
  [DOWN]: "Y",
  [LEFT]: "O",
  [RIGHT]: "R",
  [FRONT]: "G",
  [BACK]: "B",
};

const TOP_EDGE = { axis: "y", opposite: false };
const RIGHT_EDGE = { axis: "x", opposite: true };
const BOTTOM_EDGE = { axis: "y", opposite: true };
const LEFT_EDGE = { axis: "x", opposite: false };

const DIRECTIONS = [UP, DOWN, RIGHT, LEFT, FRONT, BACK];

const FACE_EDGE_MAP = {
  [UP]: [
    { face: FRONT, edge: TOP_EDGE },
    { face: LEFT, edge: TOP_EDGE },
    { face: BACK, edge: TOP_EDGE },
    { face: RIGHT, edge: TOP_EDGE },
  ],
  [DOWN]: [
    { face: BACK, edge: BOTTOM_EDGE },
    { face: LEFT, edge: BOTTOM_EDGE },
    { face: FRONT, edge: BOTTOM_EDGE },
    { face: RIGHT, edge: BOTTOM_EDGE },
  ],
  [LEFT]: [
    { face: UP, edge: LEFT_EDGE, reversed: true },
    { face: FRONT, edge: LEFT_EDGE },
    { face: DOWN, edge: LEFT_EDGE },
    { face: BACK, edge: RIGHT_EDGE, reversed: true },
  ],
  [RIGHT]: [
    { face: UP, edge: RIGHT_EDGE },
    { face: BACK, edge: LEFT_EDGE, reversed: true },
    { face: DOWN, edge: RIGHT_EDGE, reversed: true },
    { face: FRONT, edge: RIGHT_EDGE },
  ],
  [FRONT]: [
    { face: UP, edge: BOTTOM_EDGE, reversed: true },
    { face: RIGHT, edge: LEFT_EDGE },
    { face: DOWN, edge: TOP_EDGE, reversed: true },
    { face: LEFT, edge: RIGHT_EDGE },
  ],
  [BACK]: [
    { face: UP, edge: TOP_EDGE },
    { face: LEFT, edge: LEFT_EDGE, reversed: true },
    { face: DOWN, edge: BOTTOM_EDGE },
    { face: RIGHT, edge: RIGHT_EDGE, reversed: true },
  ],
};

function splitScramble(str) {
  return str
    .split(" ")
    .map((str) => str.trim())
    .filter(Boolean);
}

function parseMove(move) {
  const direction = DIRECTIONS.reduce(
    (finalDirection, direction) =>
      move.indexOf(direction) > -1 ? direction : finalDirection,
    "",
  );

  const depth = move.indexOf("w") === -1 ? 1 : Number(move.slice(0, 1)) || 2;
  const reversed = move.indexOf("'") > 0;
  const twice = move.indexOf("2") > 0;

  return { direction, reversed, depth, twice };
}

function generateArr(n) {
  let arr = new Array(n);

  for (let i = 0; i < n; i++) arr[i] = i;

  return arr;
}

function convertCube(cube) {
  function convertSide(side) {
    const size = Math.sqrt(side.length);
    const converted = Array.from({ length: size }, () => Array(size).fill(""));

    for (let cell of side) converted[cell.y][cell.x] = cell.color;

    return converted;
  }

  const convertedCube = {};

  for (let sideKey in cube) {
    if (cube.hasOwnProperty(sideKey)) {
      convertedCube[sideKey] = convertSide(cube[sideKey]);
    }
  }

  return convertedCube;
}

function convertTypeToNumber(type) {
  const num = parseInt(type[0], 10);

  if (num >= 2 && num <= 7) return num;

  throw new Error("Invalid type provided.");
}

function convertXYZMoves(scramble) {
  return (
    scramble
      // rotation moves
      .replace(/\bx2\b/g, "Rw2 L2")
      .replace(/\by2\b/g, "Uw2 D2")
      .replace(/\bz2\b/g, "Fw2 B2")
      .replace(/\bx'/g, "Rw' L")
      .replace(/\by'/g, "Uw' D")
      .replace(/\bz'/g, "Fw' B")
      .replace(/\bx\b/g, "Rw L'")
      .replace(/\by\b/g, "Uw D'")
      .replace(/\bz\b/g, "Fw B'")
      // slice moves
      .replace(/\bM\b/g, "Rw' R")
      .replace(/\bS\b/g, "Fw F'")
      .replace(/\bE\b/g, "Uw' U")
      .replace(/\bM'\b/g, "Rw R'")
      .replace(/\bS'\b/g, "Fw' F")
      .replace(/\bE'\b/g, "Uw U'")
      .replace(/\bM2\b/g, "Rw2 R2")
      .replace(/\bS2\b/g, "Fw2 F2")
      .replace(/\bE2\b/g, "Uw2 U2")
  );
}

export function applyScrambleHelper({ type, scramble, initialCube }) {
  const size = convertTypeToNumber(type);

  scramble = convertXYZMoves(scramble);
  const moves = splitScramble(scramble).map(parseMove);

  const validMoves = moves.every(
    (move) => move.depth <= size && DIRECTIONS.includes(move.direction),
    // move.depth <= Math.floor(size / 2) && DIRECTIONS.includes(move.direction),
  );

  if (!validMoves) return null;

  const cube = moves.reduce(
    (cube, move) => {
      const { direction, depth, reversed, twice } = move;
      return generateArr(twice ? 2 : reversed ? 3 : 1).reduce(
        (scrambledCube) => rotate(scrambledCube, direction, depth),
        cube,
      );
    },
    initialCube || createCube(size),
  );

  return convertCube(cube);
}

function createCube(size) {
  const createFace = (size, color) =>
    generateArr(size).reduce(
      (cube, y) => [
        ...cube,
        ...generateArr(size).map((x) => ({ x, y, color })),
      ],
      [],
    );

  return Object.keys(INITIAL_FACES).reduce(
    (state, face) => ({
      ...state,
      [face]: createFace(size, INITIAL_FACES[face]),
    }),
    {},
  );
}

function rotate(cube, face, depth) {
  const cycleEdges = (edgeMap, cube, depth) =>
    edgeMap.reduce((nextCube, target, index) => {
      const source = getPreviousItem(edgeMap, index);

      return {
        ...nextCube,
        [target.face]: generateArr(depth).reduce((nextFace, offset) => {
          const row = getEdge(cube[source.face], source.edge, offset);
          const colors = getRowColors(
            sortRowBy(row, getOppositeAxis(source.edge.axis)),
          );

          return replaceEdgeColors(
            nextFace,
            target.edge,
            colors,
            offset,
            target.reversed,
          );
        }, cube[target.face]),
      };
    }, {});

  return {
    ...cube,
    ...cycleEdges(FACE_EDGE_MAP[face], cube, depth),
    [face]: cube[face].map(({ color, x, y }) => ({
      x: reverseIndex(y, getCubeSize(cube[face])),
      y: x,
      color,
    })),
  };
}

function replaceEdgeColors(face, edge, colors, offset, reversed = false) {
  const colorQueue = reversed ? [...colors].reverse() : colors;
  const { axis, index } = getEdgeValues(edge, getCubeSize(face), offset);
  const oppositeAxis = getOppositeAxis(axis);

  return face.map((tile) =>
    tile[axis] === index
      ? { ...tile, color: colorQueue[tile[oppositeAxis]] }
      : tile,
  );
}

function getRowColors(row) {
  return row.map(({ color }) => color);
}

function createAscSorter(property) {
  return (a, b) => {
    if (a[property] < b[property]) {
      return -1;
    }

    if (a[property] > b[property]) {
      return 1;
    }

    return 0;
  };
}

function sortRowBy(row, axis) {
  return [...row].sort(createAscSorter(axis));
}

function getEdge(face, edge, offset) {
  const { axis, index } = getEdgeValues(edge, getCubeSize(face), offset);
  return face.filter((tile) => tile[axis] === index);
}

function getEdgeValues(edge, size, offset) {
  const { axis, opposite } = edge;
  const index = opposite ? size - 1 - offset : offset;
  return { axis, index };
}

function reverseIndex(index, size) {
  return size - index - 1;
}

function getCubeSize(face) {
  return Math.sqrt(face.length);
}

function getPreviousItem(array, index) {
  return index === 0 ? array[array.length - 1] : array[index - 1];
}

function getOppositeAxis(axis) {
  return axis === "x" ? "y" : "x";
}
