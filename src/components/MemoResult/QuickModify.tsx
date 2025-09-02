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
import { ArrowUp, ArrowDown, RotateCcw, FlipHorizontal } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  shiftCycleCorner,
  shiftCycleEdge,
  flipAllEdges,
  rotateAllCorners,
} from "@/utils/makeMemo/postProcess";
import { isSameEdgeSpeffz } from "@/utils/makeMemo/edgeHelper";
import { isSameCornerSpeffz } from "@/utils/makeMemo/cornerHelper";

export default function QuickModify({
  memoResult,
  setMemoResult,
  type,
}: {
  memoResult: Speffz[][];
  setMemoResult: React.Dispatch<React.SetStateAction<Speffz[][]>>;
  type: "edge" | "corner";
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
    if (rowRefs.current[0]) {
      setRowHeight(rowRefs.current[0].offsetHeight);
    }
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

  const handleShift = (index: number) => {
    const memo = memoResult[index];
    if (memo.length <= 1) return;

    const newMemoResult = [...memoResult];
    // Shift to the next element in the cycle (second element becomes the new start)
    const nextElement = memo[1];
    if (type === "edge") {
      newMemoResult[index] = shiftCycleEdge(memo, nextElement);
    } else {
      newMemoResult[index] = shiftCycleCorner(memo, nextElement);
    }
    setMemoResult(newMemoResult);
  };

  const handleFlip = (index: number) => {
    const memo = memoResult[index];
    if (memo.length === 0) return;

    const newMemoResult = [...memoResult];
    if (type === "edge") {
      // For edges, flip all edges in the cycle
      newMemoResult[index] = flipAllEdges(memo);
    } else {
      // For corners, rotate all corners (clockwise by default)
      newMemoResult[index] = rotateAllCorners(memo, true);
    }
    setMemoResult(newMemoResult);
  };

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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Index</TableHead>
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
            <TableCell>{index + 1}</TableCell>
            <TableCell>{memo.join(" ")}</TableCell>
            <TableCell className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleShift(index)}
                disabled={
                  memo.length <= 1 ||
                  Object.values(animatingRows).some((row) => row.animating) ||
                  !(type === "edge" ? isSameEdgeSpeffz : isSameCornerSpeffz)(
                    memo[0],
                    memo.at(-1) as Speffz,
                  )
                }
                title={
                  type === "edge"
                    ? "Shift cycle (edge)"
                    : "Shift cycle (corner)"
                }
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleFlip(index)}
                disabled={
                  memo.length === 0 ||
                  Object.values(animatingRows).some((row) => row.animating) ||
                  !(type === "edge" ? isSameEdgeSpeffz : isSameCornerSpeffz)(
                    memo[0],
                    memo.at(-1) as Speffz,
                  )
                }
                title={
                  type === "edge" ? "Flip all edges" : "Rotate all corners"
                }
              >
                <FlipHorizontal className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => moveUp(index)}
                disabled={
                  index === 0 ||
                  Object.values(animatingRows).some((row) => row.animating)
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
                  !(type === "edge" ? isSameEdgeSpeffz : isSameCornerSpeffz)(
                    memo[0],
                    memo.at(-1) as Speffz,
                  )
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
