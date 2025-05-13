import { applyScramble, Cube, DisplayCube } from "react-rubiks-cube-utils";
import solveEdges from "../scripts/memoEdge";
import solveCorners from "../scripts/memoCorner";
import makeLetterpair from "../scripts/makeLetterpair";

export default function Memo({ scramble }: { scramble: string }) {
  const cube = applyScramble({ type: "3x3", scramble: scramble });
  const edge = solveEdges(cube, "C");
  const corner = solveCorners(cube, "C");
  const [edgeString, parityEdge] = makeLetterpair(edge);
  const [cornerString, parityCorner] = makeLetterpair(corner);
  if (parityCorner !== parityEdge) {
    throw new Error("Parity error: edges and corners have different parity");
  }
  const isParity = parityEdge;
  return (
    <div>
      <div>
        <DisplayCube cube={cube} size={28} />
      </div>
      <h1> Results </h1>
      <div>
        {isParity && <h3>Parity</h3>}
        <h3>{edgeString} </h3>
        <h3>{cornerString} </h3>
      </div>
    </div>
  );
}
