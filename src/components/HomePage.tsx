"use client";

import { Separator } from "@/components/ui/separator";
import simplifyScramble from "@/utils/scramble/simplifyScramble";
import { useState } from "react";
import CubeSidebar from "./CubePreview/CubeSidebar";
import MemoResult from "./MemoResult";
import ScrambleButton from "./ScrambleGenerator/ScrambleButton";
import ScrambleInputField from "./ScrambleGenerator/ScrambleInputField";
import Settings from "./Settings/Settings";

export default function HomePage() {
  const [scramble, setScramble] = useState(
    "F2 R' B' U R' L F' L F' B D' R B L2"
  );

  const simplified = simplifyScramble(scramble);

  return (
    <div className="container mx-auto max-w-3xl p-4 sm:p-6 space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Settings />
        <CubeSidebar scramble={simplified} />
        <ScrambleButton setScramble={setScramble} />
      </div>
      <ScrambleInputField scramble={simplified} setScramble={setScramble} />
      <Separator className="my-6" />
      <MemoResult scramble={simplified} />
    </div>
  );
}
