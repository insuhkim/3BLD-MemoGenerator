"use client";
import styles from "./Option.module.css";
import BufferSelection from "./BufferSelection";
import { useState } from "react";
import { Speffz } from "../scripts/types/Speffz";
import { CycleNotationStyle } from "../scripts/types/Settings";

export default function Option({
  edgePriority,
  setEdgePriority,
  cornerPriority,
  setCornerPriority,
  edgeBuffer,
  setEdgeBuffer,
  cornerBuffer,
  setCornerBuffer,
  resultSeparator,
  setResultSeparator,
  cycleStyle,
  setCycleStyle,
}: {
  edgePriority: string;
  setEdgePriority: (value: string) => void;
  cornerPriority: string;
  setCornerPriority: (value: string) => void;
  edgeBuffer: Speffz;
  setEdgeBuffer: (value: Speffz) => void;
  cornerBuffer: Speffz;
  setCornerBuffer: (value: Speffz) => void;
  resultSeparator: string;
  setResultSeparator: (value: string) => void;
  cycleStyle: CycleNotationStyle;
  setCycleStyle: (value: CycleNotationStyle) => void;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
              buffer={edgeBuffer}
              setBuffer={setEdgeBuffer}
              bufferType="edge"
            />
            <BufferSelection
              buffer={cornerBuffer}
              setBuffer={setCornerBuffer}
              bufferType="corner"
            />
          </div>
          <hr />

          {/* CYCLE BREAK PRIORITY */}
          <div>
            <h3>Cycle Break Priority</h3>
            <p>
              Determine priority after buffer blocked. Write speffz letter
              scheme with seprated space.
            </p>
            <input
              type="text"
              placeholder="edge"
              value={edgePriority}
              onChange={(e) => {
                const value = e.target.value;
                const regex = /^[A-X ]*$/;
                if (regex.test(value)) {
                  setEdgePriority(value);
                }
              }}
            ></input>
            <input
              type="text"
              placeholder="corner"
              value={cornerPriority}
              onChange={(e) => {
                const value = e.target.value;
                const regex = /^[A-X ]*$/;
                if (regex.test(value)) {
                  setCornerPriority(value);
                }
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
                setCycleStyle(value as CycleNotationStyle);
              }}
              value={cycleStyle}
            >
              <option value="parenthesis">parenthesis</option>
              <option value="vertical">vertical</option>
              <option value="none">none</option>
            </select>
            <p> Select Seperator for Results </p>
            <select
              onChange={(e) => {
                const value = e.target.value;
                setResultSeparator(value);
              }}
              value={resultSeparator}
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
