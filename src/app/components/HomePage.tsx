"use client";

// React imports
import { useState } from "react";
// components
import Memo from "./Memo";
import ScrambleGenerator from "./ScrambleGenerator";
// import CubePreview from "./CubePreview";
import CubeSidebar from "./CubeSidebar";
import Option from "./Option";
// css imports
import styles from "./HomePage.module.css";
import { generateScramble } from "react-rubiks-cube-utils";

export default function HomePage() {
  const [scramble, setScramble] = useState("R U R' U'");

  return (
    <div className={styles["homepage-container"]}>
      <Option />
      <ScrambleGenerator scramble={scramble} setScramble={setScramble} />
      <div className={styles["button-row"]}>
        <button
          onClick={() => {
            setScramble(
              generateScramble({
                type: "3x3",
              })
            );
          }}
        >
          Generate Scramble
        </button>
        <CubeSidebar alg={scramble} />
      </div>
      <hr className={styles.divider} />
      <Memo scramble={scramble} />
    </div>
  );
}
