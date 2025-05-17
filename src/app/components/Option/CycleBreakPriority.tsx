import { useContext } from "react";
import { Speffz } from "../../scripts/types/Speffz";
import { SettingsContext } from "../SettingsProvider";
import styles from "./Option.module.css";

export default function CycleBreakPriority() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("SettingsPanel must be used within a SettingsProvider");
  }

  const { settings, setSettings } = context;
  return (
    <fieldset className={styles.section}>
      <legend className={styles.sectionLegend}>Cycle Break Priority</legend>
      <p className={styles.sectionDescription}>
        Choose which cycle to break first after buffer is blocked.
        <br />
        After visiting all provided locations, the rest will be visited in
        oriented, alphabetical Speffz order.
      </p>
      <div className={styles.sectionFlex}>
        <div>
          <label htmlFor="edgePriority" className={styles.label}>
            Edge Priority
          </label>
          <input
            id="edgePriority"
            type="text"
            placeholder="e.g. ABC"
            value={settings.edgePriority}
            className={styles.input}
            onChange={(e) => {
              const value = e.target.value;
              const arr = [...value.toUpperCase()].filter(
                (v) => "A" <= v && v <= "X"
              );
              setSettings((prev) => ({
                ...prev,
                edgePriority: arr as Speffz[],
              }));
            }}
          />
        </div>
        <div>
          <label htmlFor="cornerPriority" className={styles.label}>
            Corner Priority
          </label>
          <input
            id="cornerPriority"
            type="text"
            placeholder="e.g. ABC"
            value={settings.cornerPriority}
            className={styles.input}
            onChange={(e) => {
              const value = e.target.value;
              const arr = [...value.toUpperCase()].filter(
                (v) => "A" <= v && v <= "X"
              );
              setSettings((prev) => ({
                ...prev,
                cornerPriority: arr as Speffz[],
              }));
            }}
          />
        </div>
      </div>
    </fieldset>
  );
}
