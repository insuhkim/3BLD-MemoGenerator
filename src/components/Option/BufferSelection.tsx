import { Speffz } from "../../scripts/types/Speffz";
import styles from "./Option.module.css";
import { useContext } from "react";
import { SettingsContext } from "../SettingsProvider";
import "@/styles/table.css";

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
      <table className="table">
        <thead>
          <tr>
            <th>Method</th>
            <th>Edge Buffer</th>
            <th>Corner Buffer</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>M2R2</td>
            <td>U</td>
            <td>V</td>
          </tr>
          <tr>
            <td>Old Pochmann</td>
            <td>B</td>
            <td>A</td>
          </tr>
          <tr>
            <td>3Style</td>
            <td>C</td>
            <td>C</td>
          </tr>
        </tbody>
      </table>
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
