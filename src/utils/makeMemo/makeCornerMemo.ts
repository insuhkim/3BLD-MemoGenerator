import { Cube, solvedCube } from "react-rubiks-cube-utils";
import { Speffz } from "../types/Speffz";
import {
  cornerToSpeffz,
  isSameCornerSpeffz,
  speffzToCorner,
  speffzToCubeCorner,
} from "./cornerHelper";

export function makeCornerMemo(
  cube: Cube,
  buffer: Speffz,
  priority: Speffz[] = []
) {
  const solved = solvedCube({ type: "3x3" });

  const nextTarget = (current: Speffz) =>
    cornerToSpeffz(speffzToCubeCorner(cube, current));

  const getCycle = (target: Speffz, cycleStart: Speffz): Speffz[] =>
    speffzToCorner(target)[0] === speffzToCorner(cycleStart)[0]
      ? [target]
      : [target, ...getCycle(nextTarget(target), cycleStart)];

  const allOrientedCorners: Speffz[] = ["A", "B", "C", "D", "U", "V", "W", "X"];
  let unsolvedCorners = [...new Set([...priority, ...allOrientedCorners])]
    .filter((corner) => !isSameCornerSpeffz(corner, buffer))
    .filter((c) => {
      const corner = speffzToCubeCorner(cube, c);
      const solvedCorner = speffzToCubeCorner(solved, c);
      return corner[0] !== solvedCorner[0] || corner[1] !== solvedCorner[1];
    });

  const isBufferBlocked =
    speffzToCubeCorner(cube, buffer)[0] ===
    speffzToCubeCorner(solved, buffer)[0];

  let firstCycle: Speffz[] = [];
  if (!isBufferBlocked) {
    firstCycle = getCycle(nextTarget(buffer), buffer);
    firstCycle.pop();
    unsolvedCorners = unsolvedCorners.filter((c) =>
      firstCycle.every((c1) => !isSameCornerSpeffz(c, c1))
    );
  }

  function solveAll(unsolved: Speffz[]): Speffz[][] {
    if (unsolved.length === 0) return [];
    const start = unsolved[0];
    const target = nextTarget(start);
    const cycle = getCycle(target, start);
    const remaining = unsolved.filter((c) =>
      cycle.every((c1) => !isSameCornerSpeffz(c, c1))
    );
    return [[start, ...cycle], ...solveAll(remaining)];
  }

  const result = solveAll(unsolvedCorners);
  if (!isBufferBlocked) result.unshift(firstCycle);

  return result;
}
