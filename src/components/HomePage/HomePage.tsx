"use client";

import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import CubeSidebar from "../CubePreview/CubeSidebar";
import MemoResult from "../MemoResult/MemoResult";
import ScrambleButton from "../ScrambleGenerator/ScrambleButton";
import ScrambleInputField from "../ScrambleGenerator/ScrambleInputField";
import Settings from "../Settings/Settings";

export default function HomePage() {
  const [scramble, setScramble] = useState(
    "F2 R' B' U R' L F' L F' B D' R B L2"
  );

  return (
    <div className="container mx-auto max-w-3xl p-4 sm:p-6 space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Settings />
        <CubeSidebar scramble={scramble} />
        <ScrambleButton setScramble={setScramble} />
      </div>
      <ScrambleInputField scramble={scramble} setScramble={setScramble} />
      <Separator className="my-6" />
      <MemoResult scramble={scramble} />
    </div>
  );
}
