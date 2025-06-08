import { Rotation } from "@/utils/types/Settings";
import { useContext } from "react";
import { SettingsContext } from "../../context/SettingsContext";
import styles from "./Settings.module.css";

export default function PreviewStyle() {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("SettingsPanel must be used within a SettingsProvider");

  const { settings, setSettings } = context;

  return (
    <fieldset className={styles.section}>
      <legend className={styles.sectionLegend}>Cube Preview</legend>
      <div>
        <label className={styles.label}>Post rotations after scramble</label>
        <p className={styles.sectionDescription}>
          Apply rotations after applying the scramble in white top and green
          front. Only works with 3D preview. <br /> For example, if you use Blue
          top and Red front, you can select "(BR) x' y" option
        </p>
        <div className={styles.sectionFlex}>
          <select
            value={settings.postRotation}
            onChange={(e) => {
              setSettings({
                ...settings,
                postRotation: e.target.value as Rotation,
              });
            }}
          >
            <option value="">(UF)</option>
            <option value="y">(UR) y</option>
            <option value="y2">(UB) y2</option>
            <option value="y'">(UL) y'</option>
            <option value="z2">(DF) z2</option>
            <option value="z2 y">(DL) z2 y</option>
            <option value="z2 y2">(DB) z2 y2</option>
            <option value="z2 y'">(DR) z2 y'</option>
            <option value="z'">(RF) z'</option>
            <option value="z' y">(RD) z' y</option>
            <option value="z' y2">(RB) z' y2</option>
            <option value="z' y'">(RU) z' y'</option>
            <option value="z">(LF) z</option>
            <option value="z y">(LU) z y</option>
            <option value="z y2">(LB) z y2</option>
            <option value="z y'">(LD) z y'</option>
            <option value="x'">(BU) x'</option>
            <option value="x' y">(BR) x' y</option>
            <option value="x' y2">(BD) x' y2</option>
            <option value="x' y'">(BL) x' y'</option>
            <option value="x">(FD) x</option>
            <option value="x y">(FR) x y</option>
            <option value="x y2">(FU) x y2</option>
            <option value="x y'">(FL) x y'</option>
          </select>
        </div>
      </div>
      <br />
      <div>
        <label className={styles.label}>Cube Preview Style</label>
        <select
          value={settings.cubePreviewStyle}
          onChange={(e) => {
            setSettings({
              ...settings,
              cubePreviewStyle: e.target.value as "2D" | "3D",
            });
          }}
        >
          <option value="2D">2D</option>
          <option value="3D">3D</option>
        </select>
      </div>
    </fieldset>
  );
}
