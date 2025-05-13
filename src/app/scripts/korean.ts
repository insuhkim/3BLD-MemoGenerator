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

  const oriented = Object.keys(koreanMap).includes(speffz);
  if (!oriented) speffz = flipSpeffzEdge(speffz);
  return koreanMap[speffz as keyof typeof koreanMap] + (oriented ? "" : "+종");
}
