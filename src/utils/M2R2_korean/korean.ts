// Korean translation for Speffz notation (M2R2 method: U for edge, V for corner buffer)

import { flipSpeffzEdge } from "../makeMemo/makeEdgeMemo";
import { Speffz } from "../types/Speffz";

const koreanEdgeMap: Partial<Record<Speffz, string>> = {
  D: "가",
  A: "나",
  B: "다",
  C: "라",
  L: "마",
  R: "바",
  T: "사",
  J: "아",
  X: "자",
  W: "차",
  V: "카",
  ////////
  U: "타",
};

export function SpeffzToKoreanEdge(speffz: Speffz): string {
  const oriented = speffz in koreanEdgeMap;
  const key = oriented ? speffz : flipSpeffzEdge(speffz);
  return koreanEdgeMap[key as Speffz] + (oriented ? "" : "+종");
}

const koreanCornerMap: Record<Speffz, string> = {
  F: "가",
  E: "나",
  N: "다",
  M: "라",
  G: "마",
  H: "바",
  O: "사",
  ////////
  D: "고",
  A: "노",
  B: "도",
  C: "로",
  U: "모",
  X: "보",
  W: "소",
  ////////
  I: "가+종",
  R: "나+종",
  Q: "다+종",
  J: "라+종",
  L: "마+종",
  S: "바+종",
  T: "사+종",
  ////////
  P: "아",
  V: "오",
  K: "오+종",
};

export function SpeffzToKoreanCorner(speffz: Speffz): string | undefined {
  return koreanCornerMap[speffz];
}
