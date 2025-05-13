"use client";
import Memo from "./Memo";
import ScrambleGenerator from "./ScrambleGenerator";
import { useEffect, useState } from "react";
import ShowCubeState from "./ShowCubeState";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const [scramble, setScramble] = useState("R U R' U'");
  const [solve, setSolve] = useState(false);
  const [displayCube, setDisplayCube] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect(() => {
    setSolve(false);
  }, [scramble]);
  return (
    <div className={styles["homepage-container"]}>
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
        <button
          className={styles["sidebar-close"]}
          onClick={() => setSidebarOpen(false)}
        >
          ×
        </button>
        <div className={styles["sidebar-content"]}>
          <h3>Options</h3>
          <div>
            <h4>Cycle Break Priority</h4>
            <p> Determine priority after buffer block </p>
            <input type="text"></input>
          </div>
          <div>
            <h4>Option 2</h4>
          </div>
        </div>
      </div>
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}
      <ScrambleGenerator scramble={scramble} setScramble={setScramble} />
      <hr className={styles.divider} />
      <div className={styles["button-row"]}>
        <button
          className={styles["toggle-btn"]}
          onClick={() => setDisplayCube((b) => !b)}
        >
          Toggle Cube State
        </button>
        <button
          className={styles["solve-btn"]}
          onClick={() => {
            setSolve(true);
          }}
        >
          Solve!!
        </button>
      </div>
      {solve && <Memo scramble={scramble} />}
      {displayCube && <ShowCubeState scramble={scramble} size={28} />}
    </div>
  );
}
