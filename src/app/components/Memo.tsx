import { applyScramble, Cube } from "react-rubiks-cube-utils";
import solveEdges from "../scripts/memoEdge";
import solveCorners from "../scripts/memoCorner";
import makeLetterpair from "../scripts/makeLetterpair";
import { Speffz } from "../scripts/Speffz";

export default function Memo({ scramble }: { scramble: string }) {
  // Read priorities from localStorage
  const edgePriority =
    typeof window !== "undefined"
      ? localStorage.getItem("edgePriority") || ""
      : "";
  const cornerPriority =
    typeof window !== "undefined"
      ? localStorage.getItem("cornerPriority") || ""
      : "";
  const regex = /^[A-X]*$/;

  const cube = applyScramble({ type: "3x3", scramble: scramble });
  const edge = solveEdges(
    cube,
    "C",
    edgePriority.split(" ").filter((e) => e !== "" && regex.test(e)) as Speffz[]
  );
  const corner = solveCorners(
    cube,
    "C",
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
