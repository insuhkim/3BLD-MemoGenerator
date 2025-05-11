"use client";
import Memo from "./components/Memo";
import ScrambleGenerator from "./components/ScrambleGenerator";
import { useState } from "react";
import Head from "next/head";

export default function Home() {
  const [scramble, setScramble] = useState("R U R' U'");
  const [solve, setSolve] = useState(false);
  return (
    <>
      <Head>
        <title>Memo Generator</title>
        <meta name="description" content="Memo Generator for 3x3 blindfolded" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1> Memo Generator For 3x3 blindfolded</h1>
        <ScrambleGenerator scramble={scramble} setScramble={setScramble} />
        <button
          onClick={() => {
            setSolve(true);
          }}
        >
          Solve!!
        </button>
        {solve && <Memo scramble={scramble} />}
      </main>
    </>
  );
}
