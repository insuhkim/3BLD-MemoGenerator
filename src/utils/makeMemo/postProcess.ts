import { Speffz } from "../types/Speffz";
import {
  isSameCornerSpeffz,
  rotateSpeffzCorner,
  speffzToCorner,
} from "./cornerHelper";
import { flipSpeffzEdge, isSameEdgeSpeffz } from "./edgeHelper";

function flipAllEdges(cycle: Speffz[]) {
  return cycle.map((c) => flipSpeffzEdge(c));
}

function rotateAllCorners(cycle: Speffz[], CW: boolean = true) {
  return cycle.map((c) => rotateSpeffzCorner(c, CW));
}

function getAllVisitingEdges(cycle: Speffz[]) {
  // return sorted unique edges
  return Array.from(new Set([...cycle, ...flipAllEdges(cycle)])).sort();
}

function getAllVisitingCorners(cycle: Speffz[]) {
  // return sorted unique corners
  return Array.from(
    new Set([
      ...cycle,
      ...rotateAllCorners(cycle, true),
      ...rotateAllCorners(cycle, false),
    ])
  ).sort();
}

function shiftCycleEdge(cycle: Speffz[], newCycleStart: Speffz) {
  const last = cycle.at(-1) as Speffz;
  const start = cycle[0];
  if (!isSameEdgeSpeffz(start, last)) return cycle; // not a cycle

  if (isSameEdgeSpeffz(last, newCycleStart))
    return start === newCycleStart ? cycle : flipAllEdges(cycle);

  const isOrientedCycle = start === last;
  const startIdx = cycle.indexOf(newCycleStart);
  if (startIdx !== -1)
    return [
      ...cycle.slice(startIdx, -1),
      ...cycle.slice(0, startIdx),
      isOrientedCycle ? newCycleStart : flipSpeffzEdge(newCycleStart),
    ];

  const flippedStartIdx = cycle.indexOf(flipSpeffzEdge(newCycleStart));
  if (flippedStartIdx !== -1) {
    const flippedCycle = flipAllEdges(cycle);
    return [
      ...flippedCycle.slice(flippedStartIdx),
      ...flippedCycle.slice(0, flippedStartIdx),
      isOrientedCycle ? newCycleStart : flipSpeffzEdge(newCycleStart),
    ];
  }

  return cycle; // cycleStart not found
}

function shiftCycleCorner(cycle: Speffz[], cycleStart: Speffz) {
  const start = cycle[0];
  const last = cycle.at(-1) as Speffz;
  if (!isSameEdgeSpeffz(start, last)) return cycle; // not a cycle

  if (isSameCornerSpeffz(last, cycleStart))
    return start === cycleStart
      ? cycle
      : rotateSpeffzCorner(start, true) === cycleStart
      ? rotateAllCorners(cycle, true)
      : rotateAllCorners(cycle, false);

  const cycleRotation =
    (speffzToCorner(cycleStart)[1] - speffzToCorner(start)[1] + 3) % 3;
  const startIdx = cycle.indexOf(cycleStart);
  if (startIdx !== -1)
    return [
      ...cycle.slice(startIdx, -1),
      ...cycle.slice(0, startIdx),
      cycleRotation === 0
        ? cycleStart
        : cycleRotation === 1
        ? rotateSpeffzCorner(cycleStart, true)
        : rotateSpeffzCorner(cycleStart, false),
    ];
  const rotatedCWStartIdx = cycle.indexOf(rotateSpeffzCorner(cycleStart, true));
  if (rotatedCWStartIdx !== -1) {
    const rotatedCycle = rotateAllCorners(cycle, true);
    return [
      ...rotatedCycle.slice(rotatedCWStartIdx, -1),
      ...rotatedCycle.slice(0, rotatedCWStartIdx),
      cycleRotation === 0
        ? cycleStart
        : cycleRotation === 1
        ? rotateSpeffzCorner(cycleStart, true)
        : rotateSpeffzCorner(cycleStart, false),
    ];
  }
  const rotatedCCWStartIdx = cycle.indexOf(
    rotateSpeffzCorner(cycleStart, false)
  );
  if (rotatedCCWStartIdx !== -1) {
    const rotatedCycle = rotateAllCorners(cycle, false);
    return [
      ...rotatedCycle.slice(rotatedCCWStartIdx, -1),
      ...rotatedCycle.slice(0, rotatedCCWStartIdx),
      cycleRotation === 0
        ? cycleStart
        : cycleRotation === 1
        ? rotateSpeffzCorner(cycleStart, true)
        : rotateSpeffzCorner(cycleStart, false),
    ];
  }
  return cycle; // cycleStart not found
}
