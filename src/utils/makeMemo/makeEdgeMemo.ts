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
  memoSwap: Speffz = buffer,
  memoSwap2: Speffz = buffer,
) {
  const solved = solvedCube({ type: "3x3" });
  const swap = (c: Speffz) =>
    isSameEdgeSpeffz(c, memoSwap)
      ? c === memoSwap
        ? memoSwap2
        : flipSpeffzEdge(memoSwap2)
      : isSameEdgeSpeffz(c, memoSwap2)
        ? c === memoSwap2
          ? memoSwap
          : flipSpeffzEdge(memoSwap)
        : c;

  // A function that finds where current piece belongs
  const currentBelongs = (current: Speffz) =>
    edgeToSpeffz(speffzToCubeEdge(cube, current));

  const nextTarget = (current: Speffz) => swap(currentBelongs(current));

  const getCycleHelper = (target: Speffz, cycleStart: Speffz): Speffz[] =>
    target === cycleStart || target === flipSpeffzEdge(cycleStart)
      ? [target]
      : [target, ...getCycleHelper(nextTarget(target), cycleStart)];

  const getCycle = (cycleStart: Speffz) =>
    getCycleHelper(nextTarget(cycleStart), cycleStart);

  // prettier-ignore
  const allOrientedEdges: Speffz[] = [
    "A", "B", "C", "D",
    "L", "J", "T", "R",
    "U", "V", "W", "X",
  ];

  let unsolvedEdges = [...new Set([...priority, ...allOrientedEdges])]
    .filter((edge) => !isSameEdgeSpeffz(edge, buffer))
    .filter((c) => {
      const edge = speffzToCubeEdge(cube, swap(c));
      const solvedEdge = speffzToCubeEdge(solved, c);
      return edge[0] !== solvedEdge[0] || edge[1] !== solvedEdge[1];
    });

  const isBufferBlocked =
    speffzToCubeEdge(cube, buffer)[0] ===
    speffzToCubeEdge(solved, swap(buffer))[0];

  let firstCycle: Speffz[] = [];
  if (!isBufferBlocked) {
    firstCycle = getCycle(buffer);
    firstCycle.pop();
    unsolvedEdges = unsolvedEdges.filter((c) =>
      firstCycle.every((c1) => !isSameEdgeSpeffz(c, c1)),
    );
  } else {
    unsolvedEdges = unsolvedEdges.filter(
      (c) => !isSameEdgeSpeffz(c, swap(buffer)),
    );
  }

  let result: Speffz[][] = isBufferBlocked ? [] : [firstCycle];
  while (unsolvedEdges.length > 0) {
    const start = unsolvedEdges[0];
    const cycle = getCycle(start);
    unsolvedEdges = unsolvedEdges.filter(
      (c) =>
        cycle.every((c1) => !isSameEdgeSpeffz(c, c1)) &&
        !isSameEdgeSpeffz(c, swap(buffer)),
    );
    result.push([start, ...cycle]);
  }

  return result;
}
