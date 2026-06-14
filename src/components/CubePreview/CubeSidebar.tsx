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
import dynamic from "next/dynamic";

import { orientationToRotation } from "@/utils/orientation";

// Lazy-load the heavy cube players so the cubing/twisty bundle (Three.js, WebGL,
// WASM workers) is only downloaded when the Preview sheet is opened for the first time.
const Cube3DPlayer = dynamic(() => import("./Cube3DPlayer"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-48 text-muted-foreground text-sm">
      Loading 3D preview...
    </div>
  ),
});

const Cube2DPlayer = dynamic(() => import("./Cube2DPlayer"), {
  ssr: false,
});

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
  const cube3DBackground = isLightMode ? "auto" : "none";

  scramble = `${scramble} ${rotation} ${orientationToRotation(settings.orientation)}`;

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
