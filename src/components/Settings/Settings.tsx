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
import MemoSwap from "./MemoSwapParity";
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
    title: "Memo Swap Parity",
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
      <SheetContent
        side="left"
        className="w-full sm:w-[400px] flex flex-col p-0" // Removed default padding
      >
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          {" "}
          {/* Added padding and border */}
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
        {/* This div handles scrolling for the accordion content */}
        <div className="flex-1 overflow-y-auto">
          <Accordion type="single" collapsible className="w-full">
            {settingsSections.map(({ value, title, Component }) => (
              <AccordionItem value={value} key={value}>
                <AccordionTrigger className="px-6 hover:no-underline">
                  {/* Added px-6 for horizontal alignment & common hover style */}
                  <span className="flex-grow text-center">{title}</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-2">
                  {/* Added px-6 for alignment, and vertical padding */}
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
