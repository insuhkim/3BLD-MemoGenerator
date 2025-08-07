import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { convertMoves } from "@/utils/scramble/translateRotation";
import { Orientation } from "@/utils/types/Settings";
import { useContext, useEffect, useState } from "react";
import { SettingsContext } from "../../context/SettingsContext";
import { Button } from "../ui/button";
import Cube2DPlayer from "./Cube2DPlayer";
import Cube3DPlayer from "./Cube3DPlayer";

type Rotation =
  | ""
  | "y"
  | "y2"
  | "y'"
  | "z2"
  | "z2 y"
  | "z2 y2"
  | "z2 y'"
  | "z'"
  | "z' y"
  | "z' y2"
  | "z' y'"
  | "z"
  | "z y"
  | "z y2"
  | "z y'"
  | "x'"
  | "x' y"
  | "x' y2"
  | "x' y'"
  | "x"
  | "x y"
  | "x y2"
  | "x y'";

function orientationToRotation(orientation: Orientation): Rotation {
  //prettier-ignore
  switch (orientation) {
    case "wg": return "";
    case "wr": return "y";
    case "wb": return "y2";
    case "wo": return "y'";
    case "yg": return "z2";
    case "yr": return "z2 y";
    case "yb": return "z2 y2";
    case "yo": return "z2 y'";
    case "ob": return "z'";
    case "ow": return "z' y";
    case "oy": return "z' y2";
    case "og": return "z' y'";
    case "rb": return "z";
    case "rw": return "z y";
    case "ry": return "z y2";
    case "rg": return "z y'";
    case "go": return "x'";
    case "gy": return "x' y";
    case "gw": return "x' y2";
    case "gr": return "x' y'";
    case "bo": return "x";
    case "by": return "x y";
    case "bw": return "x y2";
    case "br": return "x y'";
  }
}
export default function CubeSidebar({ scramble }: { scramble: string }) {
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
  const [converted, rotation] = convertMoves(scramble.split(" "));

  scramble = converted;
  if (settings.cubePreviewStyle === "3D") {
    if (settings.applyScrambleRotationToPreview)
      scramble = `${scramble} ${rotation}`;
    scramble = `${scramble} ${orientationToRotation(settings.orientation)}`;
  }

  const cube3DBackground = isLightMode ? "auto" : "none";
  const sheetContentBackground = isLightMode
    ? "bg-neutral-200"
    : "bg-neutral-800";

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
