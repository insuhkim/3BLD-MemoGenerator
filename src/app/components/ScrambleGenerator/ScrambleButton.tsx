"use client";

import cstimer from "cstimer_module";
import { useState } from "react";
import ScrambleType from "./ScrambleType";

export default function ScrambleButton({
  setScramble,
}: {
  setScramble: (scramble: string) => void;
}) {
  type scrambleType = "333" | "edges" | "corners";
  const [scrambleType, setScrambleType] = useState<scrambleType>("333");

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <button
        onClick={() => {
          setScramble(cstimer.getScramble(scrambleType));
        }}
      >
        Generate Scramble
      </button>
      <ScrambleType
        scrambleType={scrambleType}
        setScrambleType={(type) => {
          setScrambleType(type);
        }}
      />
    </div>
  );
}
