import { SettingsContext } from "@/context/SettingsContext";
import { Speffz } from "@/utils/types/Speffz";
import { useContext } from "react";
import styles from "./Settings.module.css";

export default function MemoSwap() {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("SettingsPanel must be used within a SettingsProvider");

  const { settings, setSettings } = context;

  const AtoX = "ABCDEFGHIJKLMNOPQRSTUVWX";

  return (
    <fieldset className={styles.section}>
      <legend className={styles.sectionLegend}>Memo Swapping</legend>
      <p className={styles.sectionDescription}>
        Choose Memo Swapping for edge when parity occurs.
        <br /> For example, if parity occurs, “solve” them into the wrong
        positions. Most of people use "B" for memoSwapping
      </p>
      <div>
        <div>
          <label htmlFor="memoSwapping" className={styles.label}>
            Memo Swapping
          </label>
          <select
            value={settings.memoSwap}
            onChange={(e) =>
              setSettings({
                ...settings,
                memoSwap: e.target.value as Speffz,
              })
            }
          >
            <option value="none">None</option>
            {AtoX.split("").map((letter) => (
              <option key={letter} value={letter}>
                {letter}
              </option>
            ))}
          </select>
        </div>
      </div>
    </fieldset>
  );
}
