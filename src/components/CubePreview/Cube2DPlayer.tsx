import { DisplayCube } from "react-rubiks-cube-utils";
import { applyScramble } from "@/utils/scramble/applyScramble";

export default function Cube2DPlayer({ scramble }: { scramble: string }) {
  const cube = applyScramble({ type: "3x3", scramble });
  if (!cube) {
    return <div>Error: Invalid scramble</div>;
  }
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <DisplayCube cube={cube} size={22}></DisplayCube>
    </div>
  );
}
