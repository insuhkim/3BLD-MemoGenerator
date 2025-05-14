"use client";

// React imports
import { useEffect, useState } from "react";
// components
import Memo from "./Memo";
import ScrambleGenerator from "./ScrambleGenerator";
import ShowCubeState from "./ShowCubeState";
import Option from "./Option";
// type imports
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

  // Load from localStorage on mount
  useEffect(() => {
    const edge = localStorage.getItem("edgePriority");
    const corner = localStorage.getItem("cornerPriority");
    const edgeBuffer = localStorage.getItem("edgeBuffer");
    const cornerBuffer = localStorage.getItem("cornerBuffer");
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
      />
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
      <Memo
        scramble={scramble}
        edgeBuffer={edgeBuffer}
        cornerBuffer={cornerBuffer}
        edgePriority={edgePriority}
        cornerPriority={cornerPriority}
      />
      {displayCube && <ShowCubeState scramble={scramble} size={28} />}
    </div>
  );
}
