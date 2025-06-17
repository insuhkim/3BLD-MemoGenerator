type isInverse = boolean;
export type baseRotation = "x" | "y" | "z" | "none";
export type simpleRotation = [baseRotation, isInverse];
export type baseMove = "U" | "D" | "L" | "R" | "F" | "B";
export type move = [baseMove, isInverse];

function shift(
  move: baseMove,
  arr: baseMove[],
  inverse: boolean = false
): baseMove {
  const idx = arr.indexOf(move);
  if (idx === -1) return move;
  return arr[(idx + (inverse ? -1 : 1) + arr.length) % arr.length];
}

// Translate [move] after applying [rotation].
// For example, x' U is equivalent to B,
// so translateRotation(["x", true], "U") returns "B".
function applyRotationToMove(rotation: simpleRotation, move: move): move {
  const inverse = rotation[1];
  let arr: baseMove[] = [];
  switch (rotation[0]) {
    case "none":
      return move;
    case "x":
      arr = ["U", "F", "D", "B"];
      break;
    case "y":
      arr = ["F", "R", "B", "L"];
      break;
    case "z":
      arr = ["U", "L", "D", "R"];
      break;
  }
  return [shift(move[0], arr, inverse), move[1]];
}

type wideMove = "Uw" | "Dw" | "Lw" | "Rw" | "Fw" | "Bw";

// Updated to ensure Lw U -> R F + x (Lw is R + x rotation)
// Standard definitions:
// Uw = D y, Dw = U y'
// Rw = L x, Lw = R x' (This was original, Lw U -> R B + x')
// To match Lw U -> R F + x, Lw must be R x.
// So, Lw: [["R", false], ["x", false]]
function decomposeWideMove(move: wideMove): [move, simpleRotation] {
  switch (move) {
    case "Uw": // D, y
      return [
        ["D", false],
        ["y", false],
      ];
    case "Dw": // U, y'
      return [
        ["U", false],
        ["y", true],
      ];
    case "Rw": // L, x
      return [
        ["L", false],
        ["x", false],
      ];
    case "Lw": // R, x'
      return [
        ["R", false],
        ["x", true],
      ];
    case "Fw": // B, z
      return [
        ["B", false],
        ["z", false],
      ];
    case "Bw": // F, z'
      return [
        ["F", false],
        ["z", true],
      ];
  }
}

type sliceMove = "M" | "E" | "S";

// Updated to standard definitions:
// M = R L' x'
// E = U D' y'
// S = B F' z
function decomposeSliceMove(move: sliceMove): [move[], simpleRotation] {
  switch (move) {
    case "M": // R L' x'
      return [
        [
          ["R", false],
          ["L", true],
        ],
        ["x", true],
      ];
    case "E": // U D' y'
      return [
        [
          ["U", false],
          ["D", true],
        ],
        ["y", true],
      ];
    case "S": // B F' z
      return [
        [
          ["B", false],
          ["F", true],
        ],
        ["z", false],
      ];
  }
}

function parseMoveString(moveStr: string): [move[], simpleRotation[]] {
  if (!moveStr) {
    return [[], []];
  } // Handle empty move string
  moveStr = moveStr.trim();

  // Regex to capture:
  // 1. Base part of the move (e.g., "U", "Lw", "M", "x")
  // 2. Optional count (e.g., "2")
  // 3. Optional prime symbol
  const movePattern = /^([RLUDFB]w?|[MESxyz])(\d*)('?)$/;
  const match = moveStr.match(movePattern);

  if (!match) throw new Error(`Invalid move format: "${moveStr}"`);

  const basePart = match[1]; // e.g., "U", "Lw", "M", "x"
  const countStr = match[2]; // e.g., "", "2"
  const primeStr = match[3]; // e.g., "", "'"

  const moveCount = countStr === "" ? 1 : parseInt(countStr);
  if (isNaN(moveCount) || moveCount <= 0) {
    throw new Error(`Invalid move count in "${moveStr}"`);
  }

  const isInverseFromPrime = primeStr === "'";

  let componentMoves: move[] = []; // Base physical moves for the operation
  let associatedRotations: simpleRotation[] = []; // Rotation of frame of reference

  if (["x", "y", "z"].includes(basePart)) {
    // Pure rotation (x, y, z)
    componentMoves = []; // No physical moves
    associatedRotations = [[basePart as baseRotation, false]];
  } else if (["M", "E", "S"].includes(basePart)) {
    // Slice move
    const [sliceBaseMoves, sliceRotation] = decomposeSliceMove(
      basePart as sliceMove
    );
    componentMoves = sliceBaseMoves;
    associatedRotations = [sliceRotation];
  } else if (basePart.endsWith("w")) {
    // Wide move
    const [wideBaseMove, wideRotation] = decomposeWideMove(
      basePart as wideMove
    );
    componentMoves = [wideBaseMove];
    associatedRotations = [wideRotation];
  } else if (["U", "D", "L", "R", "F", "B"].includes(basePart)) {
    // Basic face turn
    componentMoves = [[basePart as baseMove, false]]; // Inverse handled below
    associatedRotations = [];
  } else {
    // Should not be reached if regex is correct
    throw new Error(`Unknown move base part: "${basePart}"`);
  }

  // Apply inversion to component moves if it's not a pure rotation.
  // For pure rotations, inversion is already part of associatedRotation.
  // For Lw', M', U', etc., the prime inverts the physical moves, but the
  // associated cube rotation (like x for Lw) remains the same.
  const finalUnitMoves: move[] = componentMoves.map((m) => [
    m[0],
    m[1] !== isInverseFromPrime, // XOR with base inverse state
  ]);
  const finalUnitRotations: simpleRotation[] = associatedRotations.map((r) => [
    r[0],
    r[1] !== isInverseFromPrime, // XOR with base inverse state
  ]);

  // Apply moveCount by repeating the unit moves
  const resultingMoves: move[] = [];
  const resultingRotations: simpleRotation[] = [];

  for (let i = 0; i < moveCount; i++) {
    resultingMoves.push(...finalUnitMoves);
    resultingRotations.push(...finalUnitRotations);
  }

  return [resultingMoves, resultingRotations];
}

function stringOfRotation(rotation: simpleRotation): string {
  const [base, inverse] = rotation;
  return inverse ? `${base}'` : base;
}

function stringOfMove(move: move): string {
  const [base, inverse] = move;
  return inverse ? `${base}'` : base;
}

export function convertMoves(moves: string[]): [string, string] {
  const allMoves: move[] = [];
  const allRotations: simpleRotation[] = [];

  for (const move of moves) {
    const [unitMoves, rotations] = parseMoveString(move);
    const translatedMoves = unitMoves.map((m) => {
      for (const r of allRotations) m = applyRotationToMove(r, m);
      return m;
    });
    allMoves.push(...translatedMoves);
    allRotations.push(...rotations);
  }

  const moveStr = allMoves.map(stringOfMove).join(" ");
  const rotationStr = allRotations.map(stringOfRotation).join(" ");

  return [moveStr, rotationStr];
}
