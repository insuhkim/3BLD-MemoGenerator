import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SettingsContext } from "@/context/SettingsContext";
import { Fragment, KeyboardEvent, useContext, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWX".split("");

export default function LetterPair() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("LetterPair must be used within a SettingsProvider");
  }
  const { settings, setSettings, addLetterPair, deleteLetterPair } = context;

  const [pair, setPair] = useState("");
  const [memo, setMemo] = useState("");
  const [filter, setFilter] = useState("");

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

  const handleToggleEdge = (checked: boolean) => {
    setSettings((prev) => ({
      ...prev,
      useCustomLetterPairsEdge: checked,
    }));
  };

  const handleToggleCorner = (checked: boolean) => {
    setSettings((prev) => ({
      ...prev,
      useCustomLetterPairsCorner: checked,
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

  const handlePairChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    // Only allow A-X characters
    const filtered = value.replace(/[^A-X]/g, "");
    setPair(filtered);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Letter Pair Memos</CardTitle>
        <CardDescription>
          Enable and manage custom memos for your letter pairs. These will
          override the default generated words.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="use-custom-pairs-edge"
              className="flex flex-col space-y-1"
            >
              <span>Use Custom Edge Pairs</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Enable to use your custom memos for edge pieces.
              </span>
            </Label>
            <Switch
              id="use-custom-pairs-edge"
              checked={settings.useCustomLetterPairsEdge}
              onCheckedChange={handleToggleEdge}
            />
          </div>
          <div className="border-t" />
          <div className="flex items-center justify-between">
            <Label
              htmlFor="use-custom-pairs-corner"
              className="flex flex-col space-y-1"
            >
              <span>Use Custom Corner Pairs</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Enable to use your custom memos for corner pieces.
              </span>
            </Label>
            <Switch
              id="use-custom-pairs-corner"
              checked={settings.useCustomLetterPairsCorner}
              onCheckedChange={handleToggleCorner}
            />
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Manage Custom Letter Pairs</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>Custom Letter Pairs</DialogTitle>
              {/* <DialogDescription>
                Create, modify, or delete your custom letter pairs. These will
                override the default memos. Click a cell to edit.
              </DialogDescription> */}
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <div className="flex gap-2 flex-wrap">
                  <Input
                    placeholder="Pair (AP)"
                    value={pair}
                    onChange={handlePairChange}
                    maxLength={2}
                    className="w-24"
                    onKeyDown={handleKeyDown}
                  />
                  <Input
                    placeholder="Memo (Apple)"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 min-w-[150px]"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleAdd}
                    disabled={!pair || !memo}
                    className="flex-1"
                  >
                    Add/Update
                  </Button>
                  <Button
                    onClick={handleDelete}
                    variant="destructive"
                    disabled={!pair}
                    className="flex-1"
                  >
                    Delete
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="grid">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="grid">Grid View</TabsTrigger>
                  <TabsTrigger value="list">List View</TabsTrigger>
                </TabsList>
                <TabsContent value="grid" className="mt-2">
                  <div className="overflow-x-auto pb-2 relative">
                    <div className="overflow-y-visible">
                      <TooltipProvider>
                        <div className="grid grid-cols-[auto_repeat(24,minmax(0,1fr))] gap-px bg-border text-xs">
                          <div className="p-1 bg-muted sticky left-0 z-10"></div>
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
                              <div className="p-1 font-bold text-center bg-muted sticky left-0 z-10">
                                {rowLetter}
                              </div>
                              {alphabet.map((colLetter) => {
                                const currentPair = rowLetter + colLetter;
                                const currentMemo =
                                  settings.letterPairs[currentPair];
                                const cell = (
                                  <div
                                    key={currentPair}
                                    onClick={() => handleCellClick(currentPair)}
                                    className={`p-1 cursor-pointer text-center ${
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
                                      <TooltipTrigger asChild>
                                        {cell}
                                      </TooltipTrigger>
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
                </TabsContent>
                <TabsContent value="list" className="mt-2">
                  <div className="space-y-2">
                    <Input
                      placeholder="Filter pairs or memos..."
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="mb-2"
                    />
                    <div className="max-h-[50vh] overflow-y-auto border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-center">PAIR</TableHead>
                            <TableHead className="text-center">MEMO</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.entries(settings.letterPairs)
                            .filter(
                              ([pair, memo]) =>
                                filter === "" ||
                                pair
                                  .toLowerCase()
                                  .includes(filter.toLowerCase()) ||
                                memo
                                  .toLowerCase()
                                  .includes(filter.toLowerCase())
                            )
                            .sort(([a], [b]) => a.localeCompare(b))
                            .map(([pair, memo]) => (
                              <TableRow
                                key={pair}
                                onClick={() => handleCellClick(pair)}
                              >
                                <TableCell className="font-medium text-center">
                                  {pair}
                                </TableCell>
                                <TableCell className="text-center">
                                  {memo}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                      {Object.keys(settings.letterPairs).length === 0 && (
                        <div className="p-4 text-center text-muted-foreground">
                          No letter pairs added yet
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <p className="text-sm text-muted-foreground">
              {Object.keys(settings.letterPairs).length} custom pair(s).
            </p>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
