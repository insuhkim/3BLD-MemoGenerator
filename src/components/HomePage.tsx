"use client";

import { Separator } from "@/components/ui/separator";
import simplifyScramble from "@/utils/scramble/simplifyScramble";
import { useContext, useState } from "react";
import CubeSidebar from "./CubePreview/CubeSidebar";
import MemoResult from "./MemoResult/MemoResult";
import ScrambleButton from "./ScrambleGenerator/ScrambleButton";
import ScrambleInputField from "./ScrambleGenerator/ScrambleInputField";
import Settings from "./Settings/Settings";
import {
  invertRotation,
  makeWhiteTopGreenFront,
  orientationToRotation,
} from "@/utils/orientation";
import { SettingsContext } from "@/context/SettingsContext";
import { applyScramble } from "@/utils/scramble/applyScramble";

export default function HomePage() {
  const [scramble, setScramble] = useState(
    "F2 R' B' U R' L F' L F' B D' R B L2",
  );

  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("SettingsPanel must be used within a SettingsProvider");

  const {
    settings: { orientation, scrambleOrientation },
  } = context;

  const simplifiedScramble = simplifyScramble(scramble);

  const rotation = orientationToRotation(orientation);
  const scrambleRotation = orientationToRotation(scrambleOrientation);

  const scrambleForPreview = `${scrambleRotation} ${simplifiedScramble}`;

  const afterRotation = makeWhiteTopGreenFront(
    applyScramble({ type: "3x3", scramble: scrambleForPreview }),
  );
  const realScramble = `${scrambleRotation} ${invertRotation(rotation)} ${scramble} ${rotation} ${invertRotation(scrambleRotation)} ${afterRotation}`;
  const cube = applyScramble({
    type: "3x3",
    scramble: realScramble,
  });

  return (
    <div className="container mx-auto max-w-3xl p-4 sm:p-6 space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Settings />
        <CubeSidebar scramble={scrambleForPreview} rotation={afterRotation} />
        <ScrambleButton setScramble={setScramble} />
      </div>
      <ScrambleInputField scramble={scramble} setScramble={setScramble} />
      <Separator className="my-6" />
      <MemoResult cube={cube} />
    </div>
  );
}
