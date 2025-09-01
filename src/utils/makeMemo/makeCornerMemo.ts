import { Cube, solvedCube } from "react-rubiks-cube-utils";
import { Speffz } from "../types/Speffz";
import {
  cornerToSpeffz,
  isSameCornerSpeffz,
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
    isSameCornerSpeffz(target, cycleStart)
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

  let result: Speffz[][] = isBufferBlocked ? [] : [firstCycle];

  while (unsolvedCorners.length > 0) {
    const start = unsolvedCorners[0];
    const target = nextTarget(start);
    const cycle = getCycle(target, start);
    unsolvedCorners = unsolvedCorners.filter((c) =>
      cycle.every((c1) => !isSameCornerSpeffz(c, c1))
    );
    result.push([start, ...cycle]);
  }

  return result;
}
