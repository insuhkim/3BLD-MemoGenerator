import { applyScramble, Cube, DisplayCube } from "react-rubiks-cube-utils";
import { solveEdge } from "../scripts/memoEdge";

export default function Memo({ scramble }: { scramble: string }) {
  const cube = applyScramble({ type: "3x3", scramble: scramble });
  const edge = solveEdge(cube, "C");
  console.log("cube", cube);
  return (
    <div>
      <h1> Results </h1>
      <h2> Cube : {JSON.stringify(cube)} </h2>
      <div>
        <DisplayCube cube={cube} size={28} />
      </div>
    </div>
  );
}
