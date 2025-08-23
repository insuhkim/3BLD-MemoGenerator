import { Cube, solvedCube } from "react-rubiks-cube-utils";
import { Speffz } from "../types/Speffz";
import {
  edgeToSpeffz,
  flipSpeffzEdge,
  isSameEdgeSpeffz,
  speffzToCubeEdge,
} from "./edgeHelper";

export function makeEdgeMemo(
  cube: Cube,
  buffer: Speffz,
  priority: Speffz[] = [],
  memoSwap: Speffz = buffer // Think memoSwap as buffer, buffer as memoSwap
) {
  const solved = solvedCube({ type: "3x3" });
  // prettier-ignore
  const allOrientedEdges: Speffz[] = [
    "A", "B", "C", "D",
    "L", "J", "T", "R",
    "U", "V", "W", "X",
  ];

  const toVisit: Speffz[] = [
    ...new Set([...priority, ...allOrientedEdges]),
  ].filter((edge) => !isSameEdgeSpeffz(edge, buffer));

  // A function that finds where current piece belongs
  const currentBelongs = (cube: Cube, current: Speffz) =>
    edgeToSpeffz(speffzToCubeEdge(cube, current));

  const nextTarget = (cube: Cube, current: Speffz) => {
    const edgeBelongs = currentBelongs(cube, current);
    return isSameEdgeSpeffz(edgeBelongs, memoSwap)
      ? edgeBelongs === memoSwap
        ? buffer
        : flipSpeffzEdge(buffer)
      : isSameEdgeSpeffz(edgeBelongs, buffer)
      ? edgeBelongs === buffer
        ? memoSwap
        : flipSpeffzEdge(memoSwap)
      : edgeBelongs;
  };

  const getCycle = (target: Speffz, cycleStart: Speffz): Speffz[] =>
    target === cycleStart || target === flipSpeffzEdge(cycleStart)
      ? [target]
      : [target, ...getCycle(nextTarget(cube, target), cycleStart)];

  let unsolvedEdges = toVisit.filter((c) => {
    const edge = speffzToCubeEdge(cube, c);
    const solvedEdge = speffzToCubeEdge(solved, c);
    return edge[0] !== solvedEdge[0] || edge[1] !== solvedEdge[1];
  });

  const bufferBlocked =
    speffzToCubeEdge(cube, buffer)[0] === speffzToCubeEdge(solved, memoSwap)[0];

  let firstCycle: Speffz[] = [];
  if (!bufferBlocked) {
    firstCycle = getCycle(nextTarget(cube, buffer), buffer);
    unsolvedEdges = unsolvedEdges.filter((c) =>
      firstCycle.every((c1) => !isSameEdgeSpeffz(c, c1))
    );
  } else {
    unsolvedEdges = unsolvedEdges.filter((c) => !isSameEdgeSpeffz(c, memoSwap));
  }

  function solveAll(unsolved: Speffz[]): Speffz[][] {
    if (unsolved.length === 0) return [];
    const start = unsolved[0];
    const target = nextTarget(cube, start);
    const cycle = getCycle(target, start);
    const remaining = unsolved.filter(
      (c) =>
        cycle.every((c1) => !isSameEdgeSpeffz(c, c1)) &&
        !isSameEdgeSpeffz(c, memoSwap)
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
