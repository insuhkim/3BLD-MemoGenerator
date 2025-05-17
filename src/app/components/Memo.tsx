import { applyScramble } from "react-rubiks-cube-utils";
import makeEdgeMemo from "../scripts/makeEdgeMemo";
import makeCornerMemo from "../scripts/makeCornerMemo";
import makeLetterpair from "../scripts/makeLetterpair";
import { hasParity } from "../scripts/makeLetterpair";
import { useContext } from "react";
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
  const edgeString = makeLetterpair(
    edge,
    settings.resultSeparator,
    settings.cycleStyle
  );
  const cornerString = makeLetterpair(
    corner,
    settings.resultSeparator,
    settings.cycleStyle
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
