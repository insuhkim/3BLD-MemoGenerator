import { Speffz } from "./Speffz";
import { flipSpeffzEdge } from "./memoEdge";

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
  let unorientedEdge = koreanMap[speffz as keyof typeof koreanMap];
  if (!Object.keys(koreanMap).includes(speffz)) unorientedEdge += "+종";
  return unorientedEdge;
}
