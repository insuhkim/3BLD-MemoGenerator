import { Speffz } from "@/utils/types/Speffz";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  FlipHorizontal,
  RotateCw,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  shiftCycleCorner,
  shiftCycleEdge,
  flipAllEdges,
  rotateAllCorners,
  getAllVisitingCorners,
  getAllVisitingEdges,
} from "@/utils/makeMemo/postProcess";
import { isSameEdgeSpeffz } from "@/utils/makeMemo/edgeHelper";
import { isSameCornerSpeffz } from "@/utils/makeMemo/cornerHelper";
import { speffzToScheme } from "@/utils/scheme/speffzToScheme";

export default function QuickModify({
  memoResult,
  setMemoResult,
  type,
  scheme,
}: {
  memoResult: Speffz[][];
  setMemoResult: React.Dispatch<React.SetStateAction<Speffz[][]>>;
  type: "edge" | "corner";
  scheme: string;
}) {
  // Animation states for rows
  const [animatingRows, setAnimatingRows] = useState<{
    [key: number]: { direction: "up" | "down" | null; animating: boolean };
  }>({});

  // Reference to row heights
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);
  const [rowHeight, setRowHeight] = useState(0);

  // Calculate row height on mount
  useEffect(() => {
    if (rowRefs.current[0]) setRowHeight(rowRefs.current[0].offsetHeight);
  }, []);

  // Reset animation state after animation completes
  useEffect(() => {
    const animatingRowIndices = Object.entries(animatingRows)
      .filter(([_, { animating }]) => animating)
      .map(([index]) => parseInt(index));

    if (animatingRowIndices.length > 0) {
      const timeoutIds = animatingRowIndices.map((index) => {
        return setTimeout(() => {
          setAnimatingRows((prev) => ({
            ...prev,
            [index]: { ...prev[index], animating: false },
          }));
        }, 300); // Match this with CSS transition duration
      });

      return () => timeoutIds.forEach(clearTimeout);
    }
  }, [animatingRows]);

  const moveUp = (index: number) => {
    if (index === 0) return;

    // Start animation
    setAnimatingRows({
      ...animatingRows,
      [index]: { direction: "up", animating: true },
      [index - 1]: { direction: "down", animating: true },
    });

    // Update state after animation
    setTimeout(() => {
      const newMemoResult = [...memoResult];
      const temp = newMemoResult[index];
      newMemoResult[index] = newMemoResult[index - 1];
      newMemoResult[index - 1] = temp;
      setMemoResult(newMemoResult);

      // Reset animation states
      setAnimatingRows({
        ...animatingRows,
        [index]: { direction: null, animating: false },
        [index - 1]: { direction: null, animating: false },
      });
    }, 300); // Match this with CSS transition duration
  };

  const moveDown = (index: number) => {
    if (index === memoResult.length - 1) return;

    // Start animation
    setAnimatingRows({
      ...animatingRows,
      [index]: { direction: "down", animating: true },
      [index + 1]: { direction: "up", animating: true },
    });

    // Update state after animation
    setTimeout(() => {
      const newMemoResult = [...memoResult];
      const temp = newMemoResult[index];
      newMemoResult[index] = newMemoResult[index + 1];
      newMemoResult[index + 1] = temp;
      setMemoResult(newMemoResult);

      // Reset animation states
      setAnimatingRows({
        ...animatingRows,
        [index]: { direction: null, animating: false },
        [index + 1]: { direction: null, animating: false },
      });
    }, 200); // Match this with CSS transition duration
  };

  // const handleShift = (index: number) => {
  //   const memo = memoResult[index];
  //   if (memo.length <= 1) return;

  //   const newMemoResult = [...memoResult];
  //   // Shift to the next element in the cycle (second element becomes the new start)
  //   const nextElement = memo[1];
  //   newMemoResult[index] =
  //     type === "edge"
  //       ? shiftCycleEdge(memo, nextElement)
  //       : shiftCycleCorner(memo, nextElement);

  //   setMemoResult(newMemoResult);
  // };

  // const handleFlip = (index: number) => {
  //   const memo = memoResult[index];
  //   if (memo.length === 0) return;

  //   const newMemoResult = [...memoResult];
  //   newMemoResult[index] =
  //     type === "edge" ? flipAllEdges(memo) : rotateAllCorners(memo, true);
  //   setMemoResult(newMemoResult);
  // };

  // Get animation style for a row
  const getRowStyle = (index: number) => {
    const rowState = animatingRows[index];
    if (!rowState || !rowState.animating || !rowHeight) return {};

    return {
      position: "relative",
      transition: "transform 300ms ease",
      transform:
        rowState.direction === "up"
          ? `translateY(-${rowHeight}px)`
          : rowState.direction === "down"
            ? `translateY(${rowHeight}px)`
            : "none",
      zIndex: rowState.animating ? 10 : 1,
    };
  };

  const isFirstBufferBlocked =
    memoResult[0].length === 1 ||
    !(type === "edge" ? isSameEdgeSpeffz : isSameCornerSpeffz)(
      memoResult[0][0],
      memoResult[0].at(-1) as Speffz,
    );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Cycle Start</TableHead>
          <TableHead>Memo</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {memoResult.map((memo, index) => (
          <TableRow
            key={index}
            ref={(el) => {
              rowRefs.current[index] = el;
            }}
            style={getRowStyle(index) as React.CSSProperties}
            className={cn(
              "transition-colors duration-300",
              animatingRows[index]?.animating && "bg-muted/30",
            )}
          >
            <TableCell className="flex items-center">
              <Select
                value={memo[0]}
                onValueChange={(value) => {
                  const newMemoResult = [...memoResult];
                  newMemoResult[index] = (
                    type === "edge" ? shiftCycleEdge : shiftCycleCorner
                  )(memo, value as Speffz);
                  setMemoResult(newMemoResult);
                }}
                disabled={index === 0 && isFirstBufferBlocked}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {(type === "edge"
                    ? getAllVisitingEdges(memo)
                    : getAllVisitingCorners(memo)
                  ).map((piece, pieceIndex) => (
                    <SelectItem key={`${index}-${pieceIndex}`} value={piece}>
                      {speffzToScheme(scheme, piece, type)}
                      {/*(
                      {(type === "edge"
                        ? SpeffzEdgeToOrientedPosition
                        : SpeffzCornerToPosition)(piece)}
                      )*/}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell>
              {memo
                .map((speffz) => speffzToScheme(scheme, speffz, type))
                .join(" ")}
            </TableCell>
            <TableCell className="flex justify-end gap-2">
              {/*<Button
                variant="outline"
                size="icon"
                onClick={() => handleShift(index)}
                disabled={
                  memo.length <= 1 ||
                  Object.values(animatingRows).some((row) => row.animating) ||
                  (index === 0 && isFirstBufferBlocked)
                }
                title={
                  type === "edge"
                    ? "Shift cycle (edge)"
                    : "Shift cycle (corner)"
                }
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleFlip(index)}
                disabled={
                  memo.length === 0 ||
                  Object.values(animatingRows).some((row) => row.animating) ||
                  (index === 0 && isFirstBufferBlocked)
                }
                title={
                  type === "edge"
                    ? "Flip all edges"
                    : "Rotate all corners to CW"
                }
              >
                {type === "edge" ? (
                  <FlipHorizontal className="h-4 w-4" />
                ) : (
                  <RotateCw className="h-4 w-4" />
                )}
              </Button>*/}
              <Button
                variant="outline"
                size="icon"
                onClick={() => moveUp(index)}
                disabled={
                  index === 0 ||
                  Object.values(animatingRows).some((row) => row.animating) ||
                  (index === 1 && isFirstBufferBlocked)
                }
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => moveDown(index)}
                disabled={
                  index === memoResult.length - 1 ||
                  Object.values(animatingRows).some((row) => row.animating) ||
                  memo.length === 1 ||
                  (index === 0 && isFirstBufferBlocked)
                }
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
