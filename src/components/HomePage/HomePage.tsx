"use client";

import { useState } from "react";
import CubeSidebar from "../CubePreview/CubeSidebar";
import styles from "./HomePage.module.css";
import MemoResult from "../MemoResult/MemoResult";
import Option from "../Option/Option";
import ScrambleInputField from "../ScrambleGenerator/ScrambleInputField";
import ScrambleButton from "../ScrambleGenerator/ScrambleButton";

export default function HomePage() {
  const [scramble, setScramble] = useState(
    "F2 R' B' U R' L F' L F' B D' R B L2"
  );

  return (
    <div className={`${styles.rootVars} ${styles.homepageContainer}`}>
      <div className={styles.buttonRow}>
        <Option />
        <CubeSidebar alg={scramble} />
      </div>
      <ScrambleInputField scramble={scramble} setScramble={setScramble} />
      <ScrambleButton setScramble={setScramble} />
      <hr className={styles.divider} />
      <MemoResult scramble={scramble} />
    </div>
  );
}
