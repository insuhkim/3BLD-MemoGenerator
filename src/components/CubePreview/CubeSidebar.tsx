import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useContext, useEffect, useState } from "react";
import { SettingsContext } from "../../context/SettingsContext";
import { Button } from "../ui/button";
import Cube2DPlayer from "./Cube2DPlayer";
import Cube3DPlayer from "./Cube3DPlayer";

import { orientationToRotation } from "@/utils/orientation";

export default function CubeSidebar({
  scramble,
  rotation,
}: {
  scramble: string;
  rotation: string;
}) {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("SettingsPanel must be used within a SettingsProvider");
  const { settings } = context;
  const [isLightMode, setIsLightMode] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    setIsLightMode(mediaQuery.matches);
    const handler = (event: MediaQueryListEvent) =>
      setIsLightMode(event.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  if (!settings.applyScrambleRotationToPreview)
    scramble = `${scramble} ${rotation}`;
  scramble = `${scramble} ${orientationToRotation(settings.orientation)}`;

  const cube3DBackground = isLightMode ? "auto" : "none";

  return (
    <Sheet modal={false}>
      <SheetTrigger asChild>
        <Button variant="outline">Preview</Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:w-[540px] p-0"
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
      >
        <SheetHeader className="p-6 pb-4">
          <SheetTitle>Cube Preview</SheetTitle>
        </SheetHeader>
        <div className="p-6 h-full flex flex-col justify-center items-center">
          {settings.cubePreviewStyle === "2D" ? (
            <Cube2DPlayer scramble={scramble} />
          ) : (
            <Cube3DPlayer scramble={scramble} background={cube3DBackground} />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
