import { useContext } from "react";
import { applyScramble } from "react-rubiks-cube-utils";
import makeCornerLetterPair from "../scripts/makeLetterPair/makeCornerLetterPair";
import makeEdgeLetterPair from "../scripts/makeLetterPair/makeEdgeLetterPair";
import { hasParity } from "../scripts/makeLetterPair/makeLetterpair";
import makeCornerMemo from "../scripts/makeMemo/makeCornerMemo";
import makeEdgeMemo from "../scripts/makeMemo/makeEdgeMemo";
import { SettingsContext } from "./SettingsProvider";

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
  if (hasCornerParity !== hasEdgeParity)
    throw new Error("Parity error: edges and corners have different parity");

  return (
    <div>
      <h3>{edgeString} </h3>
      <h3>{cornerString} </h3>
      {hasEdgeParity && <h2>Parity</h2>}
    </div>
  );
}
