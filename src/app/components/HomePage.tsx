"use client";

// React imports
import { useEffect, useState } from "react";
// components
import Memo from "./Memo";
import ScrambleGenerator from "./ScrambleGenerator";
import CubePreview from "./CubePreview";
import Option from "./Option";
//
import { Speffz } from "../scripts/Speffz";
// css imports
import styles from "./HomePage.module.css";

export default function HomePage() {
  const [scramble, setScramble] = useState("R U R' U'");
  const [displayCube, setDisplayCube] = useState(false);
  const [edgePriority, setEdgePriority] = useState("");
  const [cornerPriority, setCornerPriority] = useState("");
  const [edgeBuffer, setEdgeBuffer] = useState<Speffz>("C");
  const [cornerBuffer, setCornerBuffer] = useState<Speffz>("C");
  const [resultSeparator, setResultSeparator] = useState(" ");
  const [showCycleBreak, setShowCycleBreak] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const edge = localStorage.getItem("edgePriority");
    const corner = localStorage.getItem("cornerPriority");
    const edgeBuffer = localStorage.getItem("edgeBuffer");
    const cornerBuffer = localStorage.getItem("cornerBuffer");
    const resultSeparator = localStorage.getItem("resultSeparator");
    const showCycleBreak = localStorage.getItem("showCycleBreak");
    if (resultSeparator !== null) setResultSeparator(resultSeparator);
    if (showCycleBreak !== null) setShowCycleBreak(showCycleBreak === "true");
    if (edge !== null) setEdgePriority(edge);
    if (corner !== null) setCornerPriority(corner);
    if (edgeBuffer !== null) setEdgeBuffer(edgeBuffer as Speffz);
    if (cornerBuffer !== null) setCornerBuffer(cornerBuffer as Speffz);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("edgePriority", edgePriority);
  }, [edgePriority]);
  useEffect(() => {
    localStorage.setItem("cornerPriority", cornerPriority);
  }, [cornerPriority]);
  useEffect(() => {
    localStorage.setItem("edgeBuffer", edgeBuffer);
  }, [edgeBuffer]);
  useEffect(() => {
    localStorage.setItem("cornerBuffer", cornerBuffer);
  }, [cornerBuffer]);
  useEffect(() => {
    localStorage.setItem("resultSeparator", resultSeparator);
  }, [resultSeparator]);
  useEffect(() => {
    localStorage.setItem("showCycleBreak", showCycleBreak.toString());
  }, [showCycleBreak]);

  return (
    <div className={styles["homepage-container"]}>
      <Option
        edgePriority={edgePriority}
        setEdgePriority={setEdgePriority}
        cornerPriority={cornerPriority}
        setCornerPriority={setCornerPriority}
        edgeBuffer={edgeBuffer}
        setEdgeBuffer={setEdgeBuffer}
        cornerBuffer={cornerBuffer}
        setCornerBuffer={setCornerBuffer}
        resultSeparator={resultSeparator}
        setResultSeparator={setResultSeparator}
        showCycleBreak={showCycleBreak}
        setShowCycleBreak={setShowCycleBreak}
      />
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
      <Memo
        scramble={scramble}
        edgeBuffer={edgeBuffer}
        cornerBuffer={cornerBuffer}
        edgePriority={edgePriority}
        cornerPriority={cornerPriority}
        resultSeparator={resultSeparator}
        showCycleBreak={showCycleBreak}
      />
    </div>
  );
}
