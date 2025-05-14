"use client";
import styles from "./Option.module.css";
import BufferSelection from "./BufferSelection";
import { Speffz } from "../scripts/Speffz";
import { useState } from "react";
export default function Option({
  edgePriority,
  setEdgePriority,
  cornerPriority,
  setCornerPriority,
  edgeBuffer,
  setEdgeBuffer,
  cornerBuffer,
  setCornerBuffer,
}: {
  edgePriority: string;
  setEdgePriority: (value: string) => void;
  cornerPriority: string;
  setCornerPriority: (value: string) => void;
  edgeBuffer: Speffz;
  setEdgeBuffer: (value: Speffz) => void;
  cornerBuffer: Speffz;
  setCornerBuffer: (value: Speffz) => void;
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
        <div className={styles["sidebar-header"]}>
          <h2>Options</h2>
          <button
            className={styles["sidebar-close"]}
            onClick={() => setSidebarOpen(false)}
          >
            ×
          </button>
        </div>
        <div className={styles["sidebar-content"]}>
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
        </div>
      </div>
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
