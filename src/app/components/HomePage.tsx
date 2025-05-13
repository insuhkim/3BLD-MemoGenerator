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
  useEffect(() => {
    setSolve(false);
  }, [scramble]);
  return (
    <div className={styles["homepage-container"]}>
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
