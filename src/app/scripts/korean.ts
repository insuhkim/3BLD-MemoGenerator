// Korean translation for Speffz notation
// who uses M2R2 method (U for edge, V for corner buffer)

import { Speffz } from "./types/Speffz";
import { flipSpeffzEdge } from "./makeEdgeMemo";

export function SpeffzToKoreanEdge(speffz: Speffz) {
  const koreanMap = {
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
  };

  const oriented = Object.keys(koreanMap).includes(speffz);
  if (!oriented) speffz = flipSpeffzEdge(speffz);
  return koreanMap[speffz as keyof typeof koreanMap] + (oriented ? "" : "+종");
}

export function SpeffzToKoreanCorner(speffz: Speffz) {
  const koreanMap = {
    F: "가",
    E: "나",
    N: "다",
    M: "라",
    G: "마",
    H: "바",
    O: "사",
    ///////
    D: "고",
    A: "노",
    B: "도",
    C: "로",
    U: "모",
    X: "보",
    W: "소",
    ///////
    I: "가+종",
    R: "나+종",
    Q: "다+종",
    J: "라+종",
    L: "마+종",
    S: "바+종",
    T: "사+종",
  };
  return koreanMap[speffz as keyof typeof koreanMap];
}
