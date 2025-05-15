"use client";
import styles from "./Option.module.css";
import BufferSelection from "./BufferSelection";
import { useContext, useState } from "react";
import { SettingsContext } from "./SettingsProvider";
import { Speffz } from "../scripts/types/Speffz";
import { CycleNotationStyle } from "../scripts/types/Settings";

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
          <div>
            <h3>Buffer Selection</h3>
            <BufferSelection
              buffer={settings.edgeBuffer}
              setBuffer={(buffer) =>
                setSettings((prev) => ({
                  ...prev,
                  edgeBuffer: buffer,
                }))
              }
              bufferType="edge"
            />
            <BufferSelection
              buffer={settings.cornerBuffer}
              setBuffer={(buffer) =>
                setSettings((prev) => ({
                  ...prev,
                  cornerBuffer: buffer,
                }))
              }
              bufferType="corner"
            />
          </div>
          <hr />

          {/* CYCLE BREAK PRIORITY */}
          <div>
            <h3>Cycle Break Priority</h3>
            <p>
              Determine which cycle to break first after buffer blocked. Enter
              the cycle in order of priority.
            </p>
            <input
              type="text"
              placeholder="edge"
              value={settings.edgePriority}
              onChange={(e) => {
                const value = e.target.value;
                const arr = [...value].filter((v) => "A" <= v && v <= "X");
                setSettings((prev) => ({
                  ...prev,
                  edgePriority: arr as Speffz[],
                }));
              }}
            ></input>
            <input
              type="text"
              placeholder="corner"
              value={settings.cornerPriority}
              onChange={(e) => {
                const value = e.target.value;
                const arr = [...value].filter((v) => "A" <= v && v <= "X");
                setSettings((prev) => ({
                  ...prev,
                  cornerPriority: arr as Speffz[],
                }));
              }}
            ></input>
          </div>
          <hr />

          {/* Result Style*/}
          <div>
            <h3>Result Style</h3>
            <p> Select Cycle Break for Results </p>
            <select
              onChange={(e) => {
                const value = e.target.value;
                setSettings((prev) => ({
                  ...prev,
                  cycleStyle: value as CycleNotationStyle,
                }));
              }}
              value={settings.cycleStyle}
            >
              <option value="parenthesis">parenthesis</option>
              <option value="vertical">vertical</option>
              <option value="none">none</option>
            </select>
            <p> Select Seperator for Results </p>
            <select
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
        </div>
      </div>
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
