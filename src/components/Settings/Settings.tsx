"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import BufferSelection from "./BufferSelection";
import CycleBreakPriority from "./CycleBreakPriority";
import MemoSwap from "./MemoSwap";
import PreviewStyle from "./PreviewStyle";
import ResultStyle from "./ResultStyle";
import styles from "./Settings.module.css";

export default function Settings() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"ghost"}>☰</Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
        {/* CONTENTS */}
        <div className={styles["sidebar-content"]}>
          <BufferSelection />
          <CycleBreakPriority />
          <ResultStyle />
          <MemoSwap />
          <PreviewStyle />
        </div>
      </SheetContent>
    </Sheet>
  );
}
