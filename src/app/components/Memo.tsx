import { applyScramble, Cube } from "react-rubiks-cube-utils";
import solveEdges from "../scripts/memoEdge";
import solveCorners from "../scripts/memoCorner";
import makeLetterpair from "../scripts/makeLetterpair";
import { Speffz } from "../scripts/Speffz";

export default function Memo({
  scramble,
  edgeBuffer = "C",
  cornerBuffer = "C",
  edgePriority = "",
  cornerPriority = "",
}: {
  scramble: string;
  edgeBuffer: Speffz;
  cornerBuffer: Speffz;
  edgePriority: string;
  cornerPriority: string;
}) {
  const regex = /^[A-X]*$/;

  const cube = applyScramble({ type: "3x3", scramble: scramble });
  const edge = solveEdges(
    cube,
    edgeBuffer,
    edgePriority.split(" ").filter((e) => e !== "" && regex.test(e)) as Speffz[]
  );
  const corner = solveCorners(
    cube,
    cornerBuffer,
    cornerPriority
      .split(" ")
      .filter((e) => e !== "" && regex.test(e)) as Speffz[]
  );
  const [edgeString, parityEdge] = makeLetterpair(edge);
  const [cornerString, parityCorner] = makeLetterpair(corner);
  if (parityCorner !== parityEdge) {
    throw new Error("Parity error: edges and corners have different parity");
  } //
  const isParity = parityEdge;
  return (
    <div>
      <h1> Results </h1>
      <div>
        {isParity && <h3>Parity</h3>}
        <h3>{edgeString} </h3>
        <h3>{cornerString} </h3>
      </div>
    </div>
  );
}
