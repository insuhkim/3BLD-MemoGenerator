"use client";
import Memo from "./Memo";
import ScrambleGenerator from "./ScrambleGenerator";
import { useEffect, useState } from "react";
import ShowCubeState from "./ShowCubeState";

export default function HomePage() {
  const [scramble, setScramble] = useState("R U R' U'");
  const [solve, setSolve] = useState(false);
  const [displayCube, setDisplayCube] = useState(false);
  useEffect(() => {
    setSolve(false);
  }, [scramble]);
  return (
    <div>
      <ScrambleGenerator scramble={scramble} setScramble={setScramble} />
      <hr />
      <div>
        <button onClick={() => setDisplayCube((b) => !b)}>
          Toggle Cube State
        </button>
        <button
          onClick={() => {
            setSolve(true);
          }}
        >
          Solve!!
        </button>
      </div>
      {solve && <Memo scramble={scramble} />}
      {displayCube && <ShowCubeState scramble={scramble} size={28} />}
    </div>
  );
}
