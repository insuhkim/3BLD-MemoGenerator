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

  // prettier-ignore
  const allOrientedEdges: Speffz[] = [
    "A", "B", "C", "D",
    "L", "J", "T", "R",
    "U", "V", "W", "X",
  ];

  let unsolvedEdges = [...new Set([...priority, ...allOrientedEdges])]
    .filter(
      (edge) =>
        !isSameEdgeSpeffz(edge, buffer) && !isSameEdgeSpeffz(edge, memoSwap)
    )
    .filter((c) => {
      const edge = speffzToCubeEdge(cube, c);
      const solvedEdge = speffzToCubeEdge(solved, c);
      return edge[0] !== solvedEdge[0] || edge[1] !== solvedEdge[1];
    });

  const isBufferBlocked =
    speffzToCubeEdge(cube, buffer)[0] === speffzToCubeEdge(solved, memoSwap)[0];

  let firstCycle: Speffz[] = [];
  if (!isBufferBlocked) {
    firstCycle = getCycle(nextTarget(cube, buffer), buffer);
    firstCycle.pop();
    unsolvedEdges = unsolvedEdges.filter((c) =>
      firstCycle.every((c1) => !isSameEdgeSpeffz(c, c1))
    );
  } else {
    unsolvedEdges = unsolvedEdges.filter((c) => !isSameEdgeSpeffz(c, memoSwap));
  }

  let result: Speffz[][] = isBufferBlocked ? [] : [firstCycle];
  while (unsolvedEdges.length > 0) {
    const start = unsolvedEdges[0];
    const target = nextTarget(cube, start);
    const cycle = getCycle(target, start);
    unsolvedEdges = unsolvedEdges.filter(
      (c) =>
        cycle.every((c1) => !isSameEdgeSpeffz(c, c1)) &&
        !isSameEdgeSpeffz(c, memoSwap)
    );
    result.push([start, ...cycle]);
  }

  return result;
}
