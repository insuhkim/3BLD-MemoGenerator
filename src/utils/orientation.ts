import { Cube } from "react-rubiks-cube-utils";
import { Orientation } from "./types/Settings";

//prettier-ignore
type Rotation =
  | "" | "y" | "y2" | "y'"
  | "z2" | "z2 y" | "z2 y2" | "z2 y'"
  | "z'" | "z' y" | "z' y2" | "z' y'"
  | "z" | "z y" | "z y2" | "z y'"
  | "x'" | "x' y" | "x' y2" | "x' y'"
  | "x" | "x y" | "x y2" | "x y'";

function invertRotation(rotation: Rotation): Rotation {
  //prettier-ignore
  switch (rotation) {
    case "":
    case "y2":
    case "z2":
    case "z2 y":
    case "z2 y2":
    case "z2 y'":
    case "z' y2":
    case "z y2":
    case "x' y2":
    case "x y2":
      return rotation
    case "y": return "y'";
    case "y'": return "y";
    case "z'": return "z";
    case "z' y": return "x' y'";
    case "z' y'": return "x y";
    case "z": return "z'";
    case "z y": return "x y'";
    case "z y'": return "x' y";
    case "x'": return "x";
    case "x' y": return "z y'";
    case "x' y'": return "z' y";
    case "x": return "x'";
    case "x y": return "z' y'";
    case "x y'": return "z y";
  }
}

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

function makeWhiteTopGreenFront(cube: Cube): Rotation {
  const currentOrientation = (
    cube.U[1][1] + cube.F[1][1]
  ).toLowerCase() as Orientation;
  return invertRotation(orientationToRotation(currentOrientation));
}
export {
  orientations,
  colorName,
  orientationToRotation,
  invertRotation,
  makeWhiteTopGreenFront,
};
