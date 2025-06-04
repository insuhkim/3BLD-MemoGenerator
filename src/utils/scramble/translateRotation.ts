export type baseRotation = "x" | "y" | "z";
export type rotation = [baseRotation, boolean];
export type move = "U" | "D" | "L" | "R" | "F" | "B";

function shift(move: move, arr: move[], inverse: boolean = false): move {
  const idx = arr.indexOf(move);
  if (idx === -1) return move;
  return arr[(idx + (inverse ? -1 : 1) + arr.length) % arr.length];
}

// Translate [move] after applying [rotation].
// For example, x' U is equivalent to B,
// so translateRotation(["x", true], "U") returns "B".
export function translateRotation(rotation: rotation, move: move): move {
  const inverse = rotation[1];
  let arr: move[] = [];
  switch (rotation[0]) {
    case "x":
      arr = ["U", "F", "D", "B"];
    case "y":
      arr = ["F", "R", "B", "L"];
    case "z":
      arr = ["U", "L", "D", "R"];
  }
  return shift(move, arr, inverse);
}
