import { SettingsContext } from "@/context/SettingsContext";
import makeCornerLetterPair from "@/utils/makeLetterPair/makeCornerLetterPair";
import makeEdgeLetterPair from "@/utils/makeLetterPair/makeEdgeLetterPair";
import { hasParity } from "@/utils/makeLetterPair/makeLetterpair";
import makeCornerMemo from "@/utils/makeMemo/makeCornerMemo";
import makeEdgeMemo from "@/utils/makeMemo/makeEdgeMemo";
import { useContext } from "react";
import { applyScramble } from "react-rubiks-cube-utils";
import styles from "./MemoResult.module.css"; // import the CSS module

export default function MemoResult({ scramble }: { scramble: string }) {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("SettingsPanel must be used within a SettingsProvider");
  }
  const { settings } = context;

  const cube = applyScramble({ type: "3x3", scramble });
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

  const hasEdgeParity = hasParity(edge);
  const hasCornerParity = hasParity(corner);

  if (hasCornerParity !== hasEdgeParity)
    throw new Error("Parity error: edges and corners have different parity");

  return (
    <div className={styles.container}>
      <div className={styles.memo}>
        {edgeString && (
          <div>
            <h2>Edge</h2>
            <h3>{edgeString}</h3>
          </div>
        )}
        {edgeString && cornerString && (
          <div className={styles.memoDivider}></div>
        )}
        {cornerString && (
          <div>
            <h2>Corner</h2>
            <h3>{cornerString}</h3>
          </div>
        )}
        <div className={styles.memoDivider}></div>
        <h2 className={hasCornerParity ? styles.parity : styles.noParity}>
          {hasCornerParity ? "Parity" : "No Parity"}
        </h2>
      </div>
    </div>
  );
}
