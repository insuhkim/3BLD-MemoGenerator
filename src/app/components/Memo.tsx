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
    <div
      style={{
        marginTop: "2rem",
        background: "#181a20",
        borderRadius: "1rem",
        padding: "2rem",
        boxShadow: "0 2px 16px #0004",
        maxWidth: 600,
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <div
      // style={{ marginBottom: "1.5rem" }}
      >
        {edgeString ? (
          <div>
            <h2> Edge</h2>
            <h3>{edgeString}</h3>
          </div>
        ) : null}
        {cornerString ? (
          <div>
            <h2>Corner</h2>
            <h3>{cornerString}</h3>
          </div>
        ) : null}
      </div>
      <div>
        <h2
          style={{
            color: hasCornerParity ? "#ff4d4f" : "#888",
            fontWeight: hasCornerParity ? 800 : 700,
            fontSize: "2rem",
            margin: 0,
            letterSpacing: "0.05em",
          }}
        >
          {hasCornerParity ? "Parity" : "No Parity"}
        </h2>
      </div>
    </div>
  );
}
