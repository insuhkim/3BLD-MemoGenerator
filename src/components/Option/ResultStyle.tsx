import { SettingsContext } from "@/components/SettingsProvider";
import {
  CycleNotationStyle,
  FlippedCornerStyle,
  FlippedEdgeStyle,
} from "@/utils/types/Settings";
import { useContext } from "react";
import styles from "./Option.module.css";

export default function ResultStyle() {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("SettingsPanel must be used within a SettingsProvider");
  const { settings, setSettings } = context;

  return (
    <fieldset className={styles.section}>
      <legend className={styles.sectionLegend}>Result Style</legend>
      <div>
        <label htmlFor="cycleStyle" className={styles.label}>
          Cycle Break Style:
        </label>
        <select
          id="cycleStyle"
          className={styles.select}
          onChange={(e) => {
            const value = e.target.value;
            setSettings((prev) => ({
              ...prev,
              cycleStyle: value as CycleNotationStyle,
            }));
          }}
          value={settings.cycleStyle}
        >
          <option value="parenthesis">Parenthesis</option>
          <option value="vertical">Vertical</option>
          <option value="none">None</option>
        </select>
      </div>
      <div>
        <label htmlFor="resultSeparator" className={styles.label}>
          Separator:
        </label>
        <select
          id="resultSeparator"
          className={styles.select}
          onChange={(e) => {
            const value = e.target.value;
            setSettings((prev) => ({
              ...prev,
              resultSeparator: value,
            }));
          }}
          value={settings.resultSeparator}
        >
          <option value=",">Comma</option>
          <option value=", ">Comma + Space</option>
          <option value=" ">Space</option>
          <option value="">None</option>
        </select>
      </div>
      <div>
        <label className={styles.label}>
          Show Flipped Edge/Corners Separately
        </label>
        <div className={styles.flippedSection}>
          <div>
            <span>Edges: </span>
            <select
              className={styles.select}
              onChange={(e) => {
                const value = e.target.value;
                setSettings((prev) => ({
                  ...prev,
                  showFlippedEdge: value as FlippedEdgeStyle,
                }));
              }}
              value={settings.showFlippedEdge}
            >
              <option value="none">None</option>
              <option value="unoriented">
                Unoriented Edge (e.g. (VO) to [V])
              </option>
              <option value="oriented">Oriented Edge (e.g. (VO) to [O])</option>
            </select>
          </div>
          <div>
            <span>Corners: </span>
            <select
              className={styles.select}
              onChange={(e) => {
                const value = e.target.value;
                setSettings((prev) => ({
                  ...prev,
                  showFlippedCorner: value as FlippedCornerStyle,
                }));
              }}
              value={settings.showFlippedCorner}
            >
              <option value="none">None</option>
              <option value="top/bottom">
                Where the top/bottom face belongs to (e.g. (XH) to [H])
              </option>
              <option value="W/Y">
                Where the W/Y face is (e.g. (XH) to [S])
              </option>
            </select>
          </div>
        </div>
      </div>
    </fieldset>
  );
}
