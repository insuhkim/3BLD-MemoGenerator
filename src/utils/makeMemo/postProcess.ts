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
    ]),
  ).sort();
}

function shiftCycleEdge(cycle: Speffz[], newCycleStart: Speffz) {
  const last = cycle.at(-1) as Speffz;
  const start = cycle[0];
  if (!isSameEdgeSpeffz(start, last)) return cycle; // not a cycle

  if (isSameEdgeSpeffz(last, newCycleStart))
    return start === newCycleStart ? cycle : flipAllEdges(cycle);

  const isOrientedCycle = start === last;
  const startIdx = cycle.findIndex((speffz) =>
    isSameEdgeSpeffz(speffz, newCycleStart),
  );
  if (startIdx === -1) return cycle; // cycleStart not found
  const newCycle = [
    ...cycle.slice(startIdx),
    ...(isOrientedCycle ? cycle : flipAllEdges(cycle)).slice(1, startIdx + 1),
  ];
  return cycle[startIdx] === newCycleStart ? newCycle : flipAllEdges(newCycle);
}

function shiftCycleCorner(cycle: Speffz[], newCycleStart: Speffz) {
  const start = cycle[0];
  const last = cycle.at(-1) as Speffz;
  if (!isSameCornerSpeffz(start, last)) return cycle; // not a cycle

  if (isSameCornerSpeffz(last, newCycleStart))
    return start === newCycleStart
      ? cycle
      : rotateSpeffzCorner(start, true) === newCycleStart
        ? rotateAllCorners(cycle, true)
        : rotateAllCorners(cycle, false);

  const cycleRotation =
    (speffzToCorner(last)[1] - speffzToCorner(start)[1] + 3) % 3;

  const startIdx = cycle.findIndex((speffz) =>
    isSameCornerSpeffz(speffz, newCycleStart),
  );
  if (startIdx === -1) return cycle;

  const newCycle = [
    ...cycle.slice(startIdx),
    ...(cycleRotation === 0
      ? cycle
      : cycleRotation === 1
        ? rotateAllCorners(cycle, true)
        : rotateAllCorners(cycle, false)
    ).slice(1, startIdx + 1),
  ];
  return newCycleStart === cycle[startIdx]
    ? newCycle
    : rotateAllCorners(
        newCycle,
        rotateSpeffzCorner(newCycleStart, true) !== cycle[startIdx],
      );
}

export {
  flipAllEdges,
  rotateAllCorners,
  getAllVisitingCorners,
  getAllVisitingEdges,
  shiftCycleCorner,
  shiftCycleEdge,
};
