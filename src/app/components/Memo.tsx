import { applyScramble, Cube, DisplayCube } from "react-rubiks-cube-utils";
import { solveEdges } from "../scripts/memoEdge";

export default function Memo({ scramble }: { scramble: string }) {
  const cube = applyScramble({ type: "3x3", scramble: scramble });
  const edge = solveEdges(cube, "C");
  let edgeString = "";
  let count = 0;
  for (let i = 0; i < edge.length; i++) {
    edgeString += "(";
    for (let j = 0; j < edge[i].length; j++) {
      if (j > 0 && count % 2 === 0) edgeString += ",";
      edgeString += edge[i][j];
      count++;
    }
    edgeString += ")";
  }
  const isParity = count % 2 === 1;
  console.log("isParity", isParity);
  console.log("edgeString", edgeString);
  console.log("result", edge);
  return (
    <div>
      <div>
        <DisplayCube cube={cube} size={28} />
      </div>
      <h1> Results </h1>
      <div>
        {isParity && <h3>Parity</h3>}
        <p>{edgeString} </p>
      </div>
    </div>
  );
}
