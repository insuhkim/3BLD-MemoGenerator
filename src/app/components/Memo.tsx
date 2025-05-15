import { applyScramble } from "react-rubiks-cube-utils";
import makeEdgeMemo from "../scripts/makeEdgeMemo";
import makeCornerMemo from "../scripts/makeCornerMemo";
import makeLetterpair from "../scripts/makeLetterpair";
import { hasParity } from "../scripts/makeLetterpair";

export default function Memo({
  scramble,
  edgeBuffer = "C",
  cornerBuffer = "C",
  edgePriority = "",
  cornerPriority = "",
  resultSeparator = ", ",
  cycleStyle = "parenthesis",
}: {
  scramble: string;
  edgeBuffer: Speffz;
  cornerBuffer: Speffz;
  edgePriority: string;
  cornerPriority: string;
  resultSeparator: string;
  cycleStyle: CycleNotationStyle;
}) {
  const regex = /^[A-X]*$/;

  const cube = applyScramble({ type: "3x3", scramble: scramble });
  const edge = makeEdgeMemo(
    cube,
    edgeBuffer,
    edgePriority.split(" ").filter((e) => e !== "" && regex.test(e)) as Speffz[]
  );
  const corner = makeCornerMemo(
    cube,
    cornerBuffer,
    cornerPriority
      .split(" ")
      .filter((e) => e !== "" && regex.test(e)) as Speffz[]
  );
  const edgeString = makeLetterpair(edge, resultSeparator, cycleStyle);
  const cornerString = makeLetterpair(corner, resultSeparator, cycleStyle);

  // Check if the edge and corner have the same parity
  const hasEdgeParity = hasParity(edge);
  const hasCornerParity = hasParity(corner);
  if (hasCornerParity !== hasEdgeParity) {
    throw new Error("Parity error: edges and corners have different parity");
  } //
  return (
    <div>
      <h1> Results </h1>
      <div>
        {hasEdgeParity && <h3>Parity</h3>}
        <h3>{edgeString} </h3>
        <h3>{cornerString} </h3>
      </div>
    </div>
  );
}
