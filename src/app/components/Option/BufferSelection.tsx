import { Speffz } from "../../scripts/types/Speffz";
import styles from "./Option.module.css";
import { useContext } from "react";
import { SettingsContext } from "../SettingsProvider";

function BufferSelectionBox({
  buffer,
  setBuffer,
}: {
  buffer: Speffz;
  setBuffer: (buffer: Speffz) => void;
}) {
  const AtoX = "ABCDEFGHIJKLMNOPQRSTUVWX";

  return (
    <div>
      <select
        value={buffer}
        onChange={(e) => setBuffer(e.target.value as Speffz)}
      >
        {AtoX.split("").map((letter) => (
          <option key={letter} value={letter}>
            {letter}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function BufferSelection() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("SettingsPanel must be used within a SettingsProvider");
  }

  const { settings, setSettings } = context;
  return (
    <fieldset className={styles.section}>
      <legend className={styles.sectionLegend}>Buffer Selection</legend>
      <p className={styles.sectionDescription}>
        Select a buffer.
        <br />
        M2R2: U for edge, V for corner
        <br />
        Old Pochmann: B for edge, A for corner
        <br />
        3Style: C for both edge and corner
      </p>
      <div className={styles.sectionFlex}>
        <div>
          <label className={styles.label}>Edge Buffer</label>
          <BufferSelectionBox
            buffer={settings.edgeBuffer}
            setBuffer={(buffer) =>
              setSettings((prev) => ({
                ...prev,
                edgeBuffer: buffer,
              }))
            }
          />
        </div>
        <div>
          <label className={styles.label}>Corner Buffer</label>
          <BufferSelectionBox
            buffer={settings.cornerBuffer}
            setBuffer={(buffer) =>
              setSettings((prev) => ({
                ...prev,
                cornerBuffer: buffer,
              }))
            }
          />
        </div>
      </div>
    </fieldset>
  );
}
