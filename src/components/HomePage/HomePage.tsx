"use client";

import { useState } from "react";
import CubeSidebar from "../CubePreview/CubeSidebar";
import MemoResult from "../MemoResult/MemoResult";
import ScrambleButton from "../ScrambleGenerator/ScrambleButton";
import ScrambleInputField from "../ScrambleGenerator/ScrambleInputField";
import Settings from "../Settings/Settings";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const [scramble, setScramble] = useState(
    "F2 R' B' U R' L F' L F' B D' R B L2"
  );

  return (
    <div className={`${styles.rootVars} ${styles.homepageContainer}`}>
      <div className={styles.buttonRow}>
        <Settings />
        <CubeSidebar scramble={scramble} />
        <ScrambleButton setScramble={setScramble} />
      </div>
      <ScrambleInputField scramble={scramble} setScramble={setScramble} />
      <hr className={styles.divider} />
      <MemoResult scramble={scramble} />
    </div>
  );
}
