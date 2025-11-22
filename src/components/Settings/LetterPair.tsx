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
import { Download, Loader2, Trash2, Upload } from "lucide-react";
import {
  Fragment,
  KeyboardEvent,
  ReactNode,
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

// Types for components
type LetterPairType = "edge" | "corner";

interface ResetConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  onReset: () => void;
}

interface CSVImportButtonsProps {
  type: LetterPairType;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExport: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  status: string;
}

// Reusable Reset Confirmation Dialog
function ResetConfirmDialog({
  open,
  onOpenChange,
  title,
  onReset,
}: ResetConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete these letter pairs? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onReset}>
            Reset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// CSV Import and Download component
function CSVImportButtons({
  type,
  onImport,
  onExport,
  fileInputRef,
  status,
}: CSVImportButtonsProps) {
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col lg:flex-row gap-2 mt-2 w-full">
        <input
          type="file"
          accept=".csv"
          onChange={onImport}
          ref={fileInputRef}
          className="hidden"
        />
        <Button
          onClick={triggerFileInput}
          variant="outline"
          className="flex gap-2 w-full sm:w-auto"
        >
          <Upload size={16} />
          Import {type !== "corner" ? "Edge" : ""}
        </Button>
        <Button
          onClick={onExport}
          variant="outline"
          className="flex gap-2 w-full sm:w-auto"
        >
          <Download size={16} />
          Export {type !== "corner" ? "Edge" : ""}
        </Button>
        <Button
          variant="outline"
          className="flex gap-2 w-full sm:w-auto"
          asChild
        >
          <a
            href="https://bestsiteever.ru/colpi/api/csv.php"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download size={16} />
            Example CSV
          </a>
        </Button>
      </div>
      {status && (
        <p
          className={`text-sm ${
            status.includes("Error") ? "text-destructive" : "text-green-600"
          }`}
        >
          {status}
        </p>
      )}
    </div>
  );
}

// Letter Pair Toggle Setting
function LetterPairToggle({
  id,
  title,
  description,
  checked,
  onCheckedChange,
  children,
}: {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  children?: ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label htmlFor={id} className="flex flex-col space-y-1">
          <span>{title}</span>
          <span className="font-normal leading-snug text-muted-foreground">
            {description}
          </span>
        </Label>
        <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
      </div>
      {children}
    </div>
  );
}

// Letter Pair Editor Grid and List View
function LetterPairEditor({
  addLetterPair,
  deleteLetterPair,
  letterPairs,
  letteringScheme,
  type,
  separateLetterPairs,
}: {
  addLetterPair: (pair: string, memo: string, type: LetterPairType) => void;
  deleteLetterPair: (pair: string, type: LetterPairType) => void;
  letterPairs: Record<string, string>;
  letteringScheme: string;
  type: LetterPairType;
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

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setContentLoaded(true), 100);
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

  const buttonTitle =
    type === "edge"
      ? "Edit Edge Memos"
      : separateLetterPairs
        ? "Edit Corner Memos"
        : "Edit Custom Memos";

  const dialogTitle =
    type === "edge"
      ? "Edge Letter Pairs"
      : separateLetterPairs
        ? "Corner Letter Pairs"
        : "Custom Letter Pairs";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{buttonTitle}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
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
                  onChange={(e) => setPair(e.target.value)}
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
                                  title={currentMemo || ""}
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
                                  .includes(filter.toLowerCase())),
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

// Parse CSV function extracted for better organization
function parseCSV(csvContent: string): string[][] {
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

  return csvContent.split("\n").map((line) => parseCSVLine(line));
}

// Export CSV function
function exportToCSV(
  letterPairs: Record<string, string>,
  letteringScheme: string,
  type: LetterPairType,
  filename: string,
) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWX".split("");
  const applyScheme = (speffz: string) =>
    speffzToScheme(letteringScheme, speffz as any, type);

  const schemeLetters = alphabet.map(applyScheme).sort();

  // Create CSV content
  const csvRows: string[] = [];

  // Header row: empty cell + all letters
  csvRows.push("," + schemeLetters.join(","));

  // Data rows
  schemeLetters.forEach((rowLetter) => {
    const row = [rowLetter];
    schemeLetters.forEach((colLetter) => {
      const pair = rowLetter + colLetter;
      const memo = letterPairs[pair] || "";
      // Escape quotes and wrap in quotes if contains comma or quote
      const escapedMemo =
        memo.includes(",") || memo.includes('"')
          ? `"${memo.replace(/"/g, '""')}"`
          : memo;
      row.push(escapedMemo);
    });
    csvRows.push(row.join(","));
  });

  const csvContent = csvRows.join("\n");

  // Create and download file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Main component
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

  // State for CSV import and reset dialog
  const [importStatusEdge, setImportStatusEdge] = useState("");
  const [importStatusCorner, setImportStatusCorner] = useState("");
  const fileInputRefEdge = useRef<HTMLInputElement>(null);
  const fileInputRefCorner = useRef<HTMLInputElement>(null);
  const [resetEdgeDialogOpen, setResetEdgeDialogOpen] = useState(false);
  const [resetCornerDialogOpen, setResetCornerDialogOpen] = useState(false);
  const [resetAllDialogOpen, setResetAllDialogOpen] = useState(false);

  // Toggle handlers
  const handleToggleEdge = (checked: boolean) => {
    setSettings((prev) => ({
      ...prev,
      useCustomLetterPairsEdge: checked,
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

  // Reset handlers
  const handleResetEdgePairs = () => {
    setSettings((prev) => ({ ...prev, letterPairsEdge: {} }));
    setResetEdgeDialogOpen(false);
  };

  const handleResetCornerPairs = () => {
    setSettings((prev) => ({ ...prev, letterPairs: {} }));
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

  // CSV import handler
  const handleCSVImport = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: LetterPairType,
    setImportStatus: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvContent = event.target?.result as string;
        const rows = parseCSV(csvContent);

        if (rows.length < 2 || rows[0].length < 2) {
          setImportStatus(
            "Invalid CSV format. First row and column must contain letters.",
          );
          return;
        }

        // Extract headers and process rows
        const headers = rows[0].slice(1);
        let importCount = 0;

        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (row.length < 2 || !row[0]) continue;

          const firstLetter = row[0];
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
        if (fileInput.current) fileInput.current.value = "";
      } catch (error) {
        setImportStatus(
          `Error importing CSV: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      }
    };

    reader.readAsText(file);
  };

  // CSV export handler
  const handleCSVExport = (type: LetterPairType) => {
    const pairs = type === "edge" ? letterPairsEdge : letterPairs;
    const typeLabel = type === "edge" ? "edge" : "corner";
    const filename = `letter-pairs-${typeLabel}-${new Date().toISOString().split("T")[0]}.csv`;

    exportToCSV(pairs, letteringScheme, type, filename);
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
        {/* Settings section */}
        <div className="space-y-4 rounded-lg border p-4">
          <LetterPairToggle
            id="use-custom-pairs-edge"
            title="Use Custom Edge Pairs"
            description="Enable to use your custom memos for edge pieces."
            checked={useCustomLetterPairsEdge}
            onCheckedChange={handleToggleEdge}
          >
            {useCustomLetterPairsEdge && separateLetterPairs && (
              <div className="mt-2">
                <LetterPairEditor
                  addLetterPair={addLetterPair}
                  deleteLetterPair={deleteLetterPair}
                  letterPairs={letterPairsEdge}
                  letteringScheme={letteringScheme}
                  type="edge"
                  separateLetterPairs={separateLetterPairs}
                />
              </div>
            )}
          </LetterPairToggle>

          <div className="border-t" />

          <LetterPairToggle
            id="use-custom-pairs-corner"
            title="Use Custom Corner Pairs"
            description="Enable to use your custom memos for corner pieces."
            checked={useCustomLetterPairsCorner}
            onCheckedChange={handleToggleCorner}
          >
            {useCustomLetterPairsCorner && !separateLetterPairs && (
              <div className="mt-2">
                <LetterPairEditor
                  addLetterPair={addLetterPair}
                  deleteLetterPair={deleteLetterPair}
                  letterPairs={letterPairs}
                  letteringScheme={letteringScheme}
                  type="corner"
                  separateLetterPairs={separateLetterPairs}
                />
              </div>
            )}
          </LetterPairToggle>

          {useCustomLetterPairsEdge && useCustomLetterPairsCorner && (
            <>
              <div className="border-t" />
              <LetterPairToggle
                id="separate-letter-pairs"
                title="Separate Edge and Corner Letter Pairs"
                description="Enable to manage edge and corner letter pairs separately. It is useful when different alphabets are used in corner and edge scheme"
                checked={separateLetterPairs}
                onCheckedChange={handleToggleSeparateLetterPairs}
              >
                {useCustomLetterPairsCorner && separateLetterPairs && (
                  <div className="mt-2">
                    <LetterPairEditor
                      addLetterPair={addLetterPair}
                      deleteLetterPair={deleteLetterPair}
                      letterPairs={letterPairs}
                      letteringScheme={letteringScheme}
                      type="corner"
                      separateLetterPairs={separateLetterPairs}
                    />
                  </div>
                )}
              </LetterPairToggle>
            </>
          )}
        </div>

        {/* CSV Import Section */}
        <div className="space-y-4 rounded-lg border p-4">
          <h3 className="text-lg font-medium">Import Letter Pairs from CSV</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Import letter pairs from a CSV file. The CSV should have single
            letters in the first row and column. Cell values will be used as
            letter pair memos. You can download example CSV file provided by{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://bestsiteever.ru/colpi/"
              className="underline"
            >
              CoLPI
            </a>
            , where you can also find more letter pairs.
          </p>

          {separateLetterPairs ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Edge Letter Pairs</Label>
                <CSVImportButtons
                  type="edge"
                  onImport={(e) =>
                    handleCSVImport(e, "edge", setImportStatusEdge)
                  }
                  onExport={() => handleCSVExport("edge")}
                  fileInputRef={fileInputRefEdge}
                  status={importStatusEdge}
                />
              </div>

              <div className="space-y-2">
                <Label>Corner Letter Pairs</Label>
                <CSVImportButtons
                  type="corner"
                  onImport={(e) =>
                    handleCSVImport(e, "corner", setImportStatusCorner)
                  }
                  onExport={() => handleCSVExport("corner")}
                  fileInputRef={fileInputRefCorner}
                  status={importStatusCorner}
                />
              </div>
            </div>
          ) : (
            <CSVImportButtons
              type="corner"
              onImport={(e) =>
                handleCSVImport(e, "corner", setImportStatusCorner)
              }
              onExport={() => handleCSVExport("corner")}
              fileInputRef={fileInputRefCorner}
              status={importStatusCorner}
            />
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
                <ResetConfirmDialog
                  open={resetEdgeDialogOpen}
                  onOpenChange={setResetEdgeDialogOpen}
                  title="Reset Edge Letter Pairs"
                  onReset={handleResetEdgePairs}
                />
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
                <ResetConfirmDialog
                  open={resetCornerDialogOpen}
                  onOpenChange={setResetCornerDialogOpen}
                  title="Reset Corner Letter Pairs"
                  onReset={handleResetCornerPairs}
                />
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
              <ResetConfirmDialog
                open={resetAllDialogOpen}
                onOpenChange={setResetAllDialogOpen}
                title="Reset All Letter Pairs"
                onReset={handleResetAllPairs}
              />
            </Dialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
