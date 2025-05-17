"use client";
import styles from "./Option.module.css";
import BufferSelection from "./BufferSelection";
import { useContext, useState } from "react";
import { SettingsContext } from "./SettingsProvider";
import { Speffz } from "../scripts/types/Speffz";
import {
  CycleNotationStyle,
  flippedCornerStyle,
  flippedEdgeStyle,
} from "../scripts/types/Settings";

export default function Option() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("SettingsPanel must be used within a SettingsProvider");
  }

  const { settings, setSettings } = context;

  return (
    <div>
      <button
        className={styles["sidebar-toggle"]}
        onClick={() => setSidebarOpen(true)}
      >
        ☰ Options
      </button>
      <div
        className={`${styles.sidebar} ${sidebarOpen ? styles.open : ""}`}
        tabIndex={-1}
      >
        {/* HEADER */}
        <div className={styles["sidebar-header"]}>
          <h2>Options</h2>
          <button
            className={styles["sidebar-close"]}
            onClick={() => setSidebarOpen(false)}
          >
            ×
          </button>
        </div>

        {/* CONTENTS */}
        <div className={styles["sidebar-content"]}>
          {/* BUFFER SELECTION */}
          <fieldset className={styles.section}>
            <legend className={styles.sectionLegend}>Buffer Selection</legend>
            <div className={styles.sectionFlex}>
              <div>
                <label className={styles.label}>Edge Buffer</label>
                <BufferSelection
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
                <BufferSelection
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

          {/* CYCLE BREAK PRIORITY */}
          <fieldset className={styles.section}>
            <legend className={styles.sectionLegend}>
              Cycle Break Priority
            </legend>
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

          {/* RESULT STYLE */}
          <fieldset className={styles.section}>
            <legend className={styles.sectionLegend}>Result Style</legend>
            <div className={styles.sectionRow}>
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
            <div className={styles.sectionRow}>
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
                <div className={styles.flippedRow}>
                  <span>Edges: </span>
                  <select
                    className={styles.select}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSettings((prev) => ({
                        ...prev,
                        showFlippedEdge: value as flippedEdgeStyle,
                      }));
                    }}
                    value={settings.showFlippedEdge}
                  >
                    <option value="none">None</option>
                    <option value="unoriented">
                      Unoriented Edge (e.g. (VO) to [V])
                    </option>
                    <option value="oriented">
                      Oriented Edge (e.g. (VO) to [O])
                    </option>
                  </select>
                </div>
                <div className={styles.flippedRow}>
                  <span>Corners: </span>
                  <select
                    className={styles.select}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSettings((prev) => ({
                        ...prev,
                        showFlippedCorner: value as flippedCornerStyle,
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
        </div>
      </div>
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
