import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { SettingsContext } from "@/context/SettingsContext";
import { Speffz } from "@/utils/types/Speffz";
import { Link, Pencil } from "lucide-react";
import { KeyboardEvent, useContext, useState } from "react";

interface MemoPairProps {
  target1: Speffz;
  target2?: Speffz;
  url?: string;
  prefix?: string;
  infix?: string;
  suffix?: string;
  target1Character?: string;
  target2Character?: string;
  entireString?: string;
}

export default function MemoPair({
  target1,
  target2,
  url,
  prefix = "",
  suffix = "",
  infix = "",
  target1Character = target1,
  target2Character = target2,
  entireString,
}: MemoPairProps) {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("MemoPair must be used within a SettingsProvider");
  }
  const {
    settings: { letterPairs, useCustomLetterPairs },
    addLetterPair,
  } = context;

  const [isModifyOpen, setIsModifyOpen] = useState(false);
  const pairString = target2 ? `${target1}${target2}` : `${target1}${target1}`;
  const customMemo = letterPairs[pairString.toUpperCase()];
  const [modifiedMemo, setModifiedMemo] = useState(customMemo || "");

  const handleModify = () => {
    setModifiedMemo(customMemo || "");
    setIsModifyOpen(true);
  };

  const handleSave = () => {
    addLetterPair(pairString, modifiedMemo);
    setIsModifyOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  return (
    <Dialog open={isModifyOpen} onOpenChange={setIsModifyOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <span className="cursor-pointer p-1 rounded-md hover:bg-accent">
            {useCustomLetterPairs && customMemo
              ? customMemo
              : entireString ??
                prefix +
                  target1Character +
                  (target2 ? infix : "") +
                  (target2Character ?? "") +
                  suffix}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild disabled={!url}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 cursor-pointer"
            >
              <Link className="h-4 w-4" />
              <span>Search on BLDDB</span>
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleModify}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Pencil className="h-4 w-4" />
            <span>Modify Letter Pair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modify Memo for {pairString.toUpperCase()}</DialogTitle>
        </DialogHeader>
        <Input
          value={modifiedMemo}
          onChange={(e) => setModifiedMemo(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter custom memo"
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
