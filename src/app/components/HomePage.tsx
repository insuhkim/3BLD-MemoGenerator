"use client";
import Memo from "./Memo";
import ScrambleGenerator from "./ScrambleGenerator";
import { useEffect, useState } from "react";
import ShowCubeState from "./ShowCubeState";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const [scramble, setScramble] = useState("R U R' U'");
  const [displayCube, setDisplayCube] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [edgePriority, setEdgePriority] = useState("");
  const [cornerPriority, setCornerPriority] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    const edge = localStorage.getItem("edgePriority");
    const corner = localStorage.getItem("cornerPriority");
    if (edge !== null) setEdgePriority(edge);
    if (corner !== null) setCornerPriority(corner);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("edgePriority", edgePriority);
  }, [edgePriority]);
  useEffect(() => {
    localStorage.setItem("cornerPriority", cornerPriority);
  }, [cornerPriority]);

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
      </div>
      <Memo scramble={scramble} />
      {displayCube && <ShowCubeState scramble={scramble} size={28} />}
    </div>
  );
}
