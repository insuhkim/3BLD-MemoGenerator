"use client";
import { useState } from "react";
import BufferSelection from "./BufferSelection";
import CycleBreakPriority from "./CycleBreakPriority";
import styles from "./Option.module.css";
import ResultStyle from "./ResultStyle";
import PreviewStyle from "./PreviewStyle";

export default function Option() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setSidebarOpen(true)}>☰ Options</button>
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
          <BufferSelection />
          <CycleBreakPriority />
          <ResultStyle />
          <PreviewStyle />
        </div>
      </div>
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
