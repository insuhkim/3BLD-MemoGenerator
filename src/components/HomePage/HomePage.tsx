"use client";

import { Separator } from "@/components/ui/separator";
import { SettingsContext } from "@/context/SettingsContext";
import simplifyScramble from "@/utils/scramble/simplifyScramble";
import { convertMoves } from "@/utils/scramble/translateRotation";
import { useContext, useState } from "react";
import CubeSidebar from "../CubePreview/CubeSidebar";
import MemoResult from "../MemoResult/MemoResult";
import ScrambleButton from "../ScrambleGenerator/ScrambleButton";
import ScrambleInputField from "../ScrambleGenerator/ScrambleInputField";
import Settings from "../Settings/Settings";

export default function HomePage() {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("SettingsPanel must be used within a SettingsProvider");
  const { settings } = context;

  const [scramble, setScramble] = useState(
    "F2 R' B' U R' L F' L F' B D' R B L2"
  );

  const simplified = simplifyScramble(scramble);

  const [simpleMoves, rotations] = convertMoves(simplified.split(" "));
  const previewScramble = settings.applyScrambleRotationToPreview
    ? //   ? `${simplified} ${rotations}`
      scramble
    : simpleMoves;
  console.log(settings.applyScrambleRotationToPreview);

  return (
    <div className="container mx-auto max-w-3xl p-4 sm:p-6 space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Settings />
        <CubeSidebar scramble={previewScramble} />
        <ScrambleButton setScramble={setScramble} />
      </div>
      <ScrambleInputField scramble={scramble} setScramble={setScramble} />
      <Separator className="my-6" />
      <MemoResult scramble={simpleMoves} />
    </div>
  );
}
