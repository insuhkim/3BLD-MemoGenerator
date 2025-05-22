"use client";

import cstimer from "cstimer_module";
import { useCallback, useState } from "react";
import ScrambleType from "./ScrambleType";

type ScrambleTypeOption = "333" | "edges" | "corners";

export default function ScrambleButton({
  setScramble,
}: {
  setScramble: (scramble: string) => void;
}) {
  const [scrambleType, setScrambleType] = useState<ScrambleTypeOption>("333");

  const handleGenerate = useCallback(() => {
    setScramble(cstimer.getScramble(scrambleType));
  }, [scrambleType, setScramble]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <button onClick={handleGenerate}>Generate Scramble</button>
      <ScrambleType
        scrambleType={scrambleType}
        setScrambleType={setScrambleType}
      />
    </div>
  );
}
