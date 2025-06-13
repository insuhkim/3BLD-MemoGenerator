import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useContext, useRef } from "react";
import { SettingsContext } from "../../context/SettingsContext";
import { Button } from "../ui/button";
import Cube2DPlayer from "./Cube2DPlayer";
import Cube3DPlayer from "./Cube3DPlayer";
import styles from "./CubeSidebar.module.css";

export default function CubeSidebar({ scramble }: { scramble: string }) {
  const previewRef = useRef<HTMLDivElement>(null);

  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("SettingsPanel must be used within a SettingsProvider");
  const { settings } = context;

  scramble =
    settings.postRotation && settings.cubePreviewStyle === "3D"
      ? `${scramble} ${settings.postRotation}`
      : scramble;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost">Preview</Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Cube Preview</SheetTitle>
        </SheetHeader>
        <div className={styles.sidebarContent} ref={previewRef}>
          {settings.cubePreviewStyle === "2D" ? (
            <Cube2DPlayer scramble={scramble} />
          ) : (
            <Cube3DPlayer scramble={scramble} />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
