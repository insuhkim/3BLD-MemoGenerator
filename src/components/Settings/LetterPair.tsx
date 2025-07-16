import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SettingsContext } from "@/context/SettingsContext";
import { Fragment, KeyboardEvent, useContext, useState } from "react";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWX".split("");

export default function LetterPair() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("LetterPair must be used within a SettingsProvider");
  }
  const { settings, setSettings, addLetterPair, deleteLetterPair } = context;

  const [pair, setPair] = useState("");
  const [memo, setMemo] = useState("");

  const handleAdd = () => {
    if (pair && memo) {
      addLetterPair(pair, memo);
      setPair("");
      setMemo("");
    }
  };

  const handleDelete = () => {
    if (pair) {
      deleteLetterPair(pair);
      setPair("");
      setMemo("");
    }
  };

  const handleToggle = (checked: boolean) => {
    setSettings((prev) => ({
      ...prev,
      useCustomLetterPairs: checked,
    }));
  };

  const handleCellClick = (p: string) => {
    setPair(p);
    setMemo(settings.letterPairs[p] || "");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleAdd();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-lg border p-4">
        <Label htmlFor="use-custom-pairs" className="flex flex-col space-y-1">
          <span>Use Custom Letter Pairs</span>
          <span className="font-normal leading-snug text-muted-foreground">
            Enable to use your custom memos instead of the default letter pairs.
          </span>
        </Label>
        <Switch
          id="use-custom-pairs"
          checked={settings.useCustomLetterPairs}
          onCheckedChange={handleToggle}
        />
      </div>
      {settings.useCustomLetterPairs && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Manage Custom Letter Pairs</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>Custom Letter Pairs</DialogTitle>
              <DialogDescription>
                Create, modify, or delete your custom letter pairs. These will
                override the default memos. Click a cell to edit.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Pair (e.g., AP)"
                  value={pair}
                  onChange={(e) => setPair(e.target.value.toUpperCase())}
                  maxLength={2}
                  className="uppercase w-24"
                  onKeyDown={handleKeyDown}
                />
                <Input
                  placeholder="Memo (e.g., Apple)"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button onClick={handleAdd} disabled={!pair || !memo}>
                  Add/Update
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="destructive"
                  disabled={!pair}
                >
                  Delete
                </Button>
              </div>

              <div className="overflow-x-auto">
                <TooltipProvider>
                  <div className="grid grid-cols-[auto_repeat(25,minmax(0,1fr))] gap-px bg-border text-xs">
                    <div className="p-1 bg-muted"></div>
                    <div className="p-1 bg-muted"></div>
                    {alphabet.map((letter) => (
                      <div
                        key={letter}
                        className="p-1 font-bold text-center bg-muted"
                      >
                        {letter}
                      </div>
                    ))}
                    {alphabet.map((rowLetter) => (
                      <Fragment key={rowLetter}>
                        <div
                          key={rowLetter}
                          className="p-1 font-bold text-center bg-muted"
                        >
                          {rowLetter}
                        </div>
                        {(() => {
                          const singleLetterMemo =
                            settings.letterPairs[rowLetter];
                          const cell = (
                            <div
                              key={rowLetter + "_single"}
                              onClick={() => handleCellClick(rowLetter)}
                              className={`p-1 truncate cursor-pointer text-center ${
                                singleLetterMemo
                                  ? "bg-primary/20 hover:bg-primary/30"
                                  : "bg-background hover:bg-muted"
                              }`}
                            >
                              {singleLetterMemo || "-"}
                            </div>
                          );

                          if (singleLetterMemo) {
                            return (
                              <Tooltip key={rowLetter + "_single"}>
                                <TooltipTrigger asChild>{cell}</TooltipTrigger>
                                <TooltipContent>
                                  <p>{singleLetterMemo}</p>
                                </TooltipContent>
                              </Tooltip>
                            );
                          }
                          return cell;
                        })()}
                        {alphabet.map((colLetter) => {
                          const currentPair = rowLetter + colLetter;
                          const currentMemo = settings.letterPairs[currentPair];
                          const cell = (
                            <div
                              key={currentPair}
                              onClick={() => handleCellClick(currentPair)}
                              className={`p-1 truncate cursor-pointer text-center ${
                                currentMemo
                                  ? "bg-primary/20 hover:bg-primary/30"
                                  : "bg-background hover:bg-muted"
                              }`}
                            >
                              {currentMemo || "-"}
                            </div>
                          );

                          if (currentMemo) {
                            return (
                              <Tooltip key={currentPair}>
                                <TooltipTrigger asChild>{cell}</TooltipTrigger>
                                <TooltipContent>
                                  <p>{currentMemo}</p>
                                </TooltipContent>
                              </Tooltip>
                            );
                          }
                          return cell;
                        })}
                      </Fragment>
                    ))}
                  </div>
                </TooltipProvider>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {Object.keys(settings.letterPairs).length} custom pair(s).
            </p>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
