"use client";

import cstimer from "cstimer_module";
import { useState } from "react";

export default function ScrambleButton({
  setScramble,
}: {
  setScramble: (scramble: string) => void;
}) {
  type scrambleType = "333" | "edges" | "corners";
  const [scrambleType, setScrambleType] = useState<scrambleType>("333");

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => {
          setScramble(cstimer.getScramble(scrambleType));
        }}
      >
        Generate Scramble
      </button>
      <select
        value={scrambleType}
        onChange={(e) => {
          const value = e.target.value as scrambleType;
          setScrambleType(value);
        }}
      >
        <option value="333">Normal Scramble</option>
        <option value="edges">Edges Only</option>
        <option value="corners"> Corners Only</option>
      </select>
    </div>
  );
}
