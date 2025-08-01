"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import cstimer from "cstimer_module";
import { ChevronDown } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "../ui/button";

type ScrambleTypeOption = "333" | "edges" | "corners" | "333ni";

const SCRAMBLE_TYPE_OPTIONS: ScrambleTypeOption[] = [
  "333",
  "333ni",
  "edges",
  "corners",
];
const SCRAMBLE_TYPE_LABELS: Record<ScrambleTypeOption, string> = {
  "333": "Normal",
  "333ni": "Blindfolded",
  edges: "Edge",
  corners: "Corner",
};

export default function ScrambleButton({
  setScramble,
}: {
  setScramble: (scramble: string) => void;
}) {
  const [scrambleType, setScrambleType] = useState<ScrambleTypeOption>("333");

  const handleGenerate = useCallback(() => {
    setScramble(cstimer.getScramble(scrambleType));
  }, [scrambleType, setScramble]);

  const handleSelectType = useCallback((type: ScrambleTypeOption) => {
    setScrambleType(type);
  }, []);

  return (
    <div className="inline-flex items-center rounded-md border border-input bg-background shadow-sm">
      <Button
        variant={"ghost"}
        onClick={handleGenerate}
        className="px-3 py-2 text-sm rounded-r-none hover:bg-accent hover:text-accent-foreground bg-background shadow-xs dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
      >
        Scramble ({SCRAMBLE_TYPE_LABELS[scrambleType]})
      </Button>
      <div className="h-6 w-px bg-border" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={"ghost"}
            size="sm"
            className="px-3 py-2 rounded-l-none hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
          >
            <ChevronDown className="h-4 w-4" />
            <span className="sr-only">Select scramble type</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="mt-1 bg-background border-border"
        >
          {SCRAMBLE_TYPE_OPTIONS.map((type) => (
            <DropdownMenuItem key={type} onClick={() => handleSelectType(type)}>
              {SCRAMBLE_TYPE_LABELS[type]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
