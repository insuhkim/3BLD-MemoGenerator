"use client";

// React imports
import { useState } from "react";
// components
import Memo from "./Memo";
import ScrambleGenerator from "./ScrambleGenerator";
import CubePreview from "./CubePreview";
import Option from "./Option";
// css imports
import styles from "./HomePage.module.css";

export default function HomePage() {
  const [scramble, setScramble] = useState("R U R' U'");
  const [displayCube, setDisplayCube] = useState(false);

  return (
    <div className={styles["homepage-container"]}>
      <Option />
      <ScrambleGenerator scramble={scramble} setScramble={setScramble} />
      <hr className={styles.divider} />
      <div className={styles["button-row"]}>
        <button
          className={styles["toggle-btn"]}
          onClick={() => setDisplayCube((b) => !b)}
        >
          {displayCube ? "Hide Cube" : "Show Cube"}
        </button>
      </div>
      <div>{displayCube && <CubePreview alg={scramble} />}</div>
      <Memo scramble={scramble} />
    </div>
  );
}
