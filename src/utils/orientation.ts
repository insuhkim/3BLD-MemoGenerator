import { Orientation } from "./types/Settings";

//prettier-ignore
type Rotation =
  | "" | "y" | "y2" | "y'"
  | "z2" | "z2 y" | "z2 y2" | "z2 y'"
  | "z'" | "z' y" | "z' y2" | "z' y'"
  | "z" | "z y" | "z y2" | "z y'"
  | "x'" | "x' y" | "x' y2" | "x' y'"
  | "x" | "x y" | "x y2" | "x y'";

//prettier-ignore
const orientations : Orientation[] = [
  "wg", "wr", "wb", "wo",
  "yg", "yr", "yb", "yo",
  "ob", "ow", "oy", "og",
  "rb", "rw", "ry", "rg",
  "go", "gy", "gw", "gr",
  "bo", "by", "bw", "br",
];

const colorName = (color: string) => {
  //prettier-ignore
  switch (color) {
    case "w": return "White";
    case "r": return "Red";
    case "o": return "Orange";
    case "g": return "Green";
    case "b": return "Blue";
    case "y": return "Yellow";
  }
};
function orientationToRotation(orientation: Orientation): Rotation {
  //prettier-ignore
  switch (orientation) {
    case "wg": return "";
    case "wr": return "y";
    case "wb": return "y2";
    case "wo": return "y'";
    case "yg": return "z2";
    case "yr": return "z2 y'";
    case "yb": return "z2 y2";
    case "yo": return "z2 y";
    case "ob": return "z y2";
    case "ow": return "z y";
    case "oy": return "z y'";
    case "og": return "z";
    case "rb": return "z' y2";
    case "rw": return "z' y'";
    case "ry": return "z' y";
    case "rg": return "z'";
    case "go": return "x y'";
    case "gy": return "x";
    case "gw": return "x y2";
    case "gr": return "x y";
    case "bo": return "x' y'";
    case "by": return "x' y2";
    case "bw": return "x'";
    case "br": return "x' y";
  }
}
export { orientations, colorName, orientationToRotation };
