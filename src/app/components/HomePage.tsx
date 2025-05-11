"use client";
import Memo from "./Memo";
import ScrambleGenerator from "./ScrambleGenerator";
import { useState } from "react";

export default function HomePage() {
  const [scramble, setScramble] = useState("R U R' U'");
  const [solve, setSolve] = useState(false);
  return (
    <div>
      <ScrambleGenerator scramble={scramble} setScramble={setScramble} />
      <button
        onClick={() => {
          setSolve(true);
        }}
      >
        Solve!!
      </button>
      {solve && <Memo scramble={scramble} />}
    </div>
  );
}
