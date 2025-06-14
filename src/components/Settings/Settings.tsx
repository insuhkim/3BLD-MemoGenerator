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

export default function Settings() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"ghost"}>☰</Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[300px] sm:w-[400px] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
        {/* CONTENTS */}
        <div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <span className="flex-grow text-center">Buffer Selection</span>
              </AccordionTrigger>
              <AccordionContent className="px-4">
                <BufferSelection />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                <span className="flex-grow text-center">
                  Cycle Break Priority
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-4">
                <CycleBreakPriority />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                <span className="flex-grow text-center">Result Style</span>
              </AccordionTrigger>
              <AccordionContent className="px-4">
                <ResultStyle />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>
                <span className="flex-grow text-center">Memo Swap</span>
              </AccordionTrigger>
              <AccordionContent className="px-4">
                <MemoSwap />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>
                <span className="flex-grow text-center">Preview Style</span>
              </AccordionTrigger>
              <AccordionContent className="px-4">
                <PreviewStyle />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
}
