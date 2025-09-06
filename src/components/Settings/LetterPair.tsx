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
  DialogDescription,
  DialogFooter,
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
import { speffzToScheme } from "@/utils/scheme/speffzToScheme";
import { Speffz } from "@/utils/types/Speffz";
import { Loader2, Trash2, Upload } from "lucide-react"; // Updated import
import {
  Fragment,
  KeyboardEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWX".split("") as Speffz[];

function EditLetterPair({
  addLetterPair,
  deleteLetterPair,
  letterPairs,
  letteringScheme,
  type,
  separateLetterPairs,
}: {
  addLetterPair: (pair: string, memo: string, type: "edge" | "corner") => void;
  deleteLetterPair: (pair: string, type: "edge" | "corner") => void;
  letterPairs: Record<string, string>;
  letteringScheme: string;
  type: "edge" | "corner";
  separateLetterPairs: boolean;
}) {
  const [pair, setPair] = useState("");
  const [memo, setMemo] = useState("");
  const [filter, setFilter] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [contentLoaded, setContentLoaded] = useState(false);

  const applyScheme = (speffz: Speffz) =>
    speffzToScheme(letteringScheme, speffz, type);

  const schemeLetters = alphabet.map(applyScheme).sort();

  // Load content after dialog opens
  useEffect(() => {
    if (isOpen) {
      // Small timeout to allow dialog animation to complete
      const timer = setTimeout(() => {
        setContentLoaded(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setContentLoaded(false);
    }
  }, [isOpen]);

  const handleAdd = () => {
    if (pair && memo) {
      addLetterPair(pair, memo, type);
      setPair("");
      setMemo("");
    }
  };

  const handleDelete = () => {
    if (pair) {
      deleteLetterPair(pair, type);
      setPair("");
      setMemo("");
    }
  };

  const handleCellClick = (p: string) => {
    setPair(p);
    setMemo(letterPairs[p] || "");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") handleAdd();
  };

  const handlePairChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPair(e.target.value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          {type === "edge"
            ? "Edit Edge Memos"
            : type === "corner"
            ? separateLetterPairs
              ? "Edit Corner Memos"
              : "Edit Custom Memos"
            : "Manage Custom Letter Pairs"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {type === "edge"
              ? "Edge Letter Pairs"
              : type === "corner"
              ? separateLetterPairs
                ? "Corner Letter Pairs"
                : "Custom Letter Pairs"
              : "Custom Letter Pairs"}
          </DialogTitle>
        </DialogHeader>

        {!contentLoaded ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
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
                  disabled={!pair || !memo || pair.length < 2}
                  className="flex-1"
                >
                  Add/Update
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="destructive"
                  disabled={!pair || !memo || pair.length < 2}
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
                        {schemeLetters.map((letter) => (
                          <div
                            key={letter}
                            className="p-1 font-bold text-center bg-muted"
                          >
                            {letter}
                          </div>
                        ))}
                        {schemeLetters.map((rowLetter) => (
                          <Fragment key={rowLetter}>
                            <div className="p-1 font-bold text-center bg-muted sticky left-0 z-10">
                              {rowLetter}
                            </div>
                            {schemeLetters.map((colLetter) => {
                              const currentPair = rowLetter + colLetter;
                              const currentMemo = letterPairs[currentPair];
                              const cell = (
                                <div
                                  key={currentPair}
                                  onClick={() => handleCellClick(currentPair)}
                                  className={`p-1 cursor-pointer text-center whitespace-nowrap overflow-hidden text-overflow-ellipsis ${
                                    currentMemo
                                      ? "bg-primary/20 hover:bg-primary/30"
                                      : "bg-background hover:bg-muted"
                                  }`}
                                  style={{ maxWidth: "100%" }}
                                  title={currentMemo || ""} // Add title attribute for easier viewing on hover
                                >
                                  {currentMemo || "-"}
                                </div>
                              );

                              return (
                                <Tooltip key={currentPair}>
                                  <TooltipTrigger asChild>
                                    {cell}
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      {currentPair +
                                        (currentMemo
                                          ? ` (${currentMemo})`
                                          : "")}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              );
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
                        {Object.entries(letterPairs)
                          .filter(
                            ([pair, memo]) =>
                              memo !== "" &&
                              (filter === "" ||
                                pair
                                  .toLowerCase()
                                  .includes(filter.toLowerCase()) ||
                                memo
                                  .toLowerCase()
                                  .includes(filter.toLowerCase()))
                          )
                          .sort()
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
                    {Object.keys(letterPairs).length === 0 && (
                      <div className="p-4 text-center text-muted-foreground">
                        No letter pairs added yet
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        <p className="text-sm text-muted-foreground">
          {Object.keys(letterPairs).length} custom pair(s).
        </p>
      </DialogContent>
    </Dialog>
  );
}

export default function LetterPair() {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("LetterPair must be used within a SettingsProvider");

  const {
    setSettings,
    addLetterPair,
    deleteLetterPair,
    settings: {
      letterPairs,
      letteringScheme,
      useCustomLetterPairsEdge,
      useCustomLetterPairsCorner,
      separateLetterPairs,
      letterPairsEdge,
    },
  } = context;

  // Add state for CSV import status and refs
  const [importStatusEdge, setImportStatusEdge] = useState("");
  const [importStatusCorner, setImportStatusCorner] = useState("");
  const fileInputRefEdge = useRef<HTMLInputElement>(null);
  const fileInputRefCorner = useRef<HTMLInputElement>(null);

  // Add state for reset confirmation dialogs
  const [resetEdgeDialogOpen, setResetEdgeDialogOpen] = useState(false);
  const [resetCornerDialogOpen, setResetCornerDialogOpen] = useState(false);
  const [resetAllDialogOpen, setResetAllDialogOpen] = useState(false);

  const handleToggleEdge = (checked: boolean) => {
    setSettings((prev) => ({
      ...prev,
      useCustomLetterPairsEdge: checked,
      // If disabling edge pairs, also disable separate letter pairs
      separateLetterPairs:
        checked && useCustomLetterPairsCorner
          ? prev.separateLetterPairs
          : false,
    }));
  };

  const handleToggleCorner = (checked: boolean) => {
    setSettings((prev) => ({
      ...prev,
      useCustomLetterPairsCorner: checked,
      // If disabling corner pairs, also disable separate letter pairs
      separateLetterPairs:
        checked && useCustomLetterPairsEdge ? prev.separateLetterPairs : false,
    }));
  };

  const handleToggleSeparateLetterPairs = (checked: boolean) => {
    setSettings((prev) => ({
      ...prev,
      separateLetterPairs: checked,
    }));
  };

  // Add letter pairs reset handlers
  const handleResetEdgePairs = () => {
    setSettings((prev) => ({
      ...prev,
      letterPairsEdge: {},
    }));
    setResetEdgeDialogOpen(false);
  };

  const handleResetCornerPairs = () => {
    setSettings((prev) => ({
      ...prev,
      letterPairs: {},
    }));
    setResetCornerDialogOpen(false);
  };

  const handleResetAllPairs = () => {
    setSettings((prev) => ({
      ...prev,
      letterPairsEdge: {},
      letterPairs: {},
    }));
    setResetAllDialogOpen(false);
  };

  // Add CSV import handlers
  const handleCSVImport = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "edge" | "corner",
    setImportStatus: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvContent = event.target?.result as string;

        // Improved CSV parsing that handles quoted values
        const parseCSVLine = (line: string) => {
          const result = [];
          let currentCell = "";
          let insideQuotes = false;

          for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"' && (i === 0 || line[i - 1] !== "\\")) {
              insideQuotes = !insideQuotes;
              continue;
            }

            if (char === "," && !insideQuotes) {
              result.push(currentCell.trim());
              currentCell = "";
              continue;
            }

            currentCell += char;
          }

          if (currentCell) {
            result.push(currentCell.trim());
          }

          return result;
        };

        const rows = csvContent.split("\n").map((line) => parseCSVLine(line));

        if (rows.length < 2 || rows[0].length < 2) {
          setImportStatus(
            "Invalid CSV format. First row and column must contain letters."
          );
          return;
        }

        // Extract headers (first row without the first cell)
        const headers = rows[0].slice(1);

        // Process each data row
        let importCount = 0;
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (row.length < 2 || !row[0]) continue;

          const firstLetter = row[0];

          // Process each cell in the row
          for (let j = 1; j < row.length; j++) {
            if (j - 1 >= headers.length || !headers[j - 1] || !row[j]) continue;

            const secondLetter = headers[j - 1];
            const letterPair = firstLetter + secondLetter;
            const memo = row[j];

            if (letterPair.length === 2 && memo) {
              addLetterPair(letterPair, memo, type);
              importCount++;
            }
          }
        }

        setImportStatus(`Successfully imported ${importCount} letter pairs.`);

        // Clear the file input
        const fileInput =
          type === "edge" ? fileInputRefEdge : fileInputRefCorner;
        if (fileInput.current) {
          fileInput.current.value = "";
        }
      } catch (error) {
        setImportStatus(
          `Error importing CSV: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    };

    reader.readAsText(file);
  };

  const triggerFileInput = (type: "edge" | "corner") => {
    const fileInput = type === "edge" ? fileInputRefEdge : fileInputRefCorner;
    fileInput.current?.click();
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
          {/* Edge Letter Pairs Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
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
                checked={useCustomLetterPairsEdge}
                onCheckedChange={handleToggleEdge}
              />
            </div>

            {useCustomLetterPairsEdge && separateLetterPairs && (
              <div className="mt-2">
                <EditLetterPair
                  addLetterPair={addLetterPair}
                  deleteLetterPair={deleteLetterPair}
                  letterPairs={letterPairsEdge}
                  letteringScheme={letteringScheme}
                  type="edge"
                  separateLetterPairs={separateLetterPairs}
                />
              </div>
            )}
          </div>

          <div className="border-t" />

          {/* Corner Letter Pairs Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
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
                checked={useCustomLetterPairsCorner}
                onCheckedChange={handleToggleCorner}
              />
            </div>

            {/* Show the edit button next to corner pairs setting when not separated */}
            {useCustomLetterPairsCorner && !separateLetterPairs && (
              <div className="mt-2">
                <EditLetterPair
                  addLetterPair={addLetterPair}
                  deleteLetterPair={deleteLetterPair}
                  letterPairs={letterPairs}
                  letteringScheme={letteringScheme}
                  type="corner"
                  separateLetterPairs={separateLetterPairs}
                />
              </div>
            )}
          </div>

          {/* Only show the separate letter pairs option when both custom pairs are enabled */}
          {useCustomLetterPairsEdge && useCustomLetterPairsCorner && (
            <>
              <div className="border-t" />
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label
                    htmlFor="separate-letter-pairs"
                    className="flex flex-col space-y-1"
                  >
                    <span>Separate Edge and Corner Letter Pairs</span>
                    <span className="font-normal leading-snug text-muted-foreground">
                      Enable to manage edge and corner letter pairs separately.
                    </span>
                  </Label>
                  <Switch
                    id="separate-letter-pairs"
                    checked={separateLetterPairs}
                    onCheckedChange={handleToggleSeparateLetterPairs}
                  />
                </div>

                {/* Show corner edit button when separated */}
                {useCustomLetterPairsCorner && separateLetterPairs && (
                  <div className="mt-2">
                    <EditLetterPair
                      addLetterPair={addLetterPair}
                      deleteLetterPair={deleteLetterPair}
                      letterPairs={letterPairs}
                      letteringScheme={letteringScheme}
                      type="corner"
                      separateLetterPairs={separateLetterPairs}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* CSV Import Section */}
        <div className="space-y-4 rounded-lg border p-4">
          <h3 className="text-lg font-medium">Import Letter Pairs from CSV</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Import letter pairs from a CSV file. The CSV should have single
            letters in the first row and column. Cell values will be used as
            letter pair memos.
          </p>

          {separateLetterPairs ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Edge Letter Pairs</Label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) =>
                      handleCSVImport(e, "edge", setImportStatusEdge)
                    }
                    ref={fileInputRefEdge}
                    className="hidden"
                  />
                  <Button
                    onClick={() => triggerFileInput("edge")}
                    variant="outline"
                    className="flex gap-2"
                  >
                    <Upload size={16} />
                    Import Edge Letter Pairs
                  </Button>
                </div>
                {importStatusEdge && (
                  <p
                    className={`text-sm ${
                      importStatusEdge.includes("Error")
                        ? "text-destructive"
                        : "text-green-600"
                    }`}
                  >
                    {importStatusEdge}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Corner Letter Pairs</Label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) =>
                      handleCSVImport(e, "corner", setImportStatusCorner)
                    }
                    ref={fileInputRefCorner}
                    className="hidden"
                  />
                  <Button
                    onClick={() => triggerFileInput("corner")}
                    variant="outline"
                    className="flex gap-2"
                  >
                    <Upload size={16} />
                    Import Corner Letter Pairs
                  </Button>
                </div>
                {importStatusCorner && (
                  <p
                    className={`text-sm ${
                      importStatusCorner.includes("Error")
                        ? "text-destructive"
                        : "text-green-600"
                    }`}
                  >
                    {importStatusCorner}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) =>
                    handleCSVImport(e, "corner", setImportStatusCorner)
                  }
                  ref={fileInputRefCorner}
                  className="hidden"
                />
                <Button
                  onClick={() => triggerFileInput("corner")}
                  variant="outline"
                  className="flex gap-2"
                >
                  <Upload size={16} />
                  Import Letter Pairs
                </Button>
              </div>
              {importStatusCorner && (
                <p
                  className={`text-sm ${
                    importStatusCorner.includes("Error")
                      ? "text-destructive"
                      : "text-green-600"
                  }`}
                >
                  {importStatusCorner}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Reset Letter Pairs Section */}
        <div className="space-y-4 rounded-lg border p-4">
          <h3 className="text-lg font-medium">Reset Letter Pairs</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Remove all custom letter pairs. This action cannot be undone.
          </p>

          {separateLetterPairs ? (
            <div className="flex flex-wrap gap-2">
              <Dialog
                open={resetEdgeDialogOpen}
                onOpenChange={setResetEdgeDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="destructive" className="flex gap-2">
                    <Trash2 size={16} />
                    Reset Edge Letter Pairs
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reset Edge Letter Pairs</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete all edge letter pairs?
                      This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setResetEdgeDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleResetEdgePairs}
                    >
                      Reset
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog
                open={resetCornerDialogOpen}
                onOpenChange={setResetCornerDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="destructive" className="flex gap-2">
                    <Trash2 size={16} />
                    Reset Corner Letter Pairs
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reset Corner Letter Pairs</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete all corner letter pairs?
                      This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setResetCornerDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleResetCornerPairs}
                    >
                      Reset
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <Dialog
              open={resetAllDialogOpen}
              onOpenChange={setResetAllDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="destructive" className="flex gap-2">
                  <Trash2 size={16} />
                  Reset All Letter Pairs
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reset All Letter Pairs</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete all letter pairs? This
                    action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setResetAllDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleResetAllPairs}>
                    Reset
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
