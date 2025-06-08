"use client";
import { useState } from "react";
import BufferSelection from "./BufferSelection";
import CycleBreakPriority from "./CycleBreakPriority";
import MemoSwap from "./MemoSwap";
import PreviewStyle from "./PreviewStyle";
import ResultStyle from "./ResultStyle";
import styles from "./Settings.module.css";

export default function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setSidebarOpen(true)}>☰</button>
      <div
        className={`${styles.sidebar} ${sidebarOpen ? styles.open : ""}`}
        tabIndex={-1}
      >
        {/* HEADER */}
        <div className={styles["sidebar-header"]}>
          <h2>Settings</h2>
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
          <MemoSwap />
          <PreviewStyle />
        </div>
      </div>
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
