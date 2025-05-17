import { applyScramble } from "react-rubiks-cube-utils";
import makeEdgeMemo from "../scripts/makeMemo/makeEdgeMemo";
import makeCornerMemo from "../scripts/makeMemo/makeCornerMemo";
import { hasParity } from "../scripts/makeLetterPair/makeLetterpair";
import { useContext } from "react";
import { SettingsContext } from "./SettingsProvider";
import makeEdgeLetterPair from "../scripts/makeLetterPair/makeEdgeLetterPair";
import makeCornerLetterPair from "../scripts/makeLetterPair/makeCornerLetterPair";

export default function Memo({ scramble }: { scramble: string }) {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("SettingsPanel must be used within a SettingsProvider");
  }

  const { settings } = context;
  const cube = applyScramble({ type: "3x3", scramble: scramble });
  const edge = makeEdgeMemo(cube, settings.edgeBuffer, settings.edgePriority);
  const corner = makeCornerMemo(
    cube,
    settings.cornerBuffer,
    settings.cornerPriority
  );
  const edgeString = makeEdgeLetterPair(
    edge,
    settings.resultSeparator,
    settings.cycleStyle,
    settings.showFlippedEdge
  );
  const cornerString = makeCornerLetterPair(
    corner,
    settings.resultSeparator,
    settings.cycleStyle,
    settings.showFlippedCorner
  );

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
