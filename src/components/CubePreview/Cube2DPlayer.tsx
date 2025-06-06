"use client";
import { DisplayCube, applyScramble } from "react-rubiks-cube-utils";

export default function Cube2DPlayer({ alg }: { alg: string }) {
  const cube = applyScramble({ type: "3x3", scramble: alg });
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <DisplayCube cube={cube} size={22}></DisplayCube>
    </div>
  );
}
