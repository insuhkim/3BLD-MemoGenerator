"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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

const settingsSections = [
  {
    value: "item-1",
    title: "Buffer Selection",
    Component: BufferSelection,
  },
  {
    value: "item-2",
    title: "Cycle Break Priority",
    Component: CycleBreakPriority,
  },
  {
    value: "item-3",
    title: "Result Style",
    Component: ResultStyle,
  },
  {
    value: "item-4",
    title: "Memo Swap",
    Component: MemoSwap,
  },
  {
    value: "item-5",
    title: "Preview Style",
    Component: PreviewStyle,
  },
];

export default function Settings() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"outline"} size={"icon"}>
          ☰
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:w-[400px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
        {/* CONTENTS */}
        <div>
          <Accordion type="single" collapsible className="w-full">
            {settingsSections.map(({ value, title, Component }) => (
              <AccordionItem value={value} key={value}>
                <AccordionTrigger>
                  <span className="flex-grow text-center">{title}</span>
                </AccordionTrigger>
                <AccordionContent className="px-4">
                  <Component />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
}
