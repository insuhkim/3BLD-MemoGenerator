import { Speffz } from "@/utils/types/Speffz";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GripVertical } from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  shiftCycleCorner,
  shiftCycleEdge,
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
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    // Check if moving the first buffer when it's blocked
    const isFirstBufferBlocked =
      memoResult[0].length === 1 ||
      !(type === "edge" ? isSameEdgeSpeffz : isSameCornerSpeffz)(
        memoResult[0][0],
        memoResult[0].at(-1) as Speffz,
      );

    // Prevent moving first buffer or moving to first position when blocked
    if ((sourceIndex === 0 || destinationIndex === 0) && isFirstBufferBlocked) {
      return;
    }

    // Prevent moving single-piece cycles (except first buffer)
    if (sourceIndex !== 0 && memoResult[sourceIndex].length === 1) {
      return;
    }

    const newMemoResult = Array.from(memoResult);
    const [reorderedItem] = newMemoResult.splice(sourceIndex, 1);
    newMemoResult.splice(destinationIndex, 0, reorderedItem);

    setMemoResult(newMemoResult);
  };

  const isFirstBufferBlocked =
    memoResult[0].length === 1 ||
    !(type === "edge" ? isSameEdgeSpeffz : isSameCornerSpeffz)(
      memoResult[0][0],
      memoResult[0].at(-1) as Speffz,
    );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10"></TableHead>
            <TableHead>Cycle Start</TableHead>
            <TableHead>Memo</TableHead>
          </TableRow>
        </TableHeader>
        <Droppable droppableId="memo-table">
          {(provided) => (
            <TableBody ref={provided.innerRef} {...provided.droppableProps}>
              {memoResult.map((memo, index) => {
                const isDraggingDisabled =
                  (index === 0 && isFirstBufferBlocked) ||
                  (index !== 0 && memo.length === 1);

                return (
                  <Draggable
                    key={`memo-${index}`}
                    draggableId={`memo-${index}`}
                    index={index}
                    isDragDisabled={isDraggingDisabled}
                  >
                    {(provided, snapshot) => (
                      <TableRow
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`
                          ${snapshot.isDragging ? "bg-muted/50" : ""}
                          ${isDraggingDisabled ? "opacity-50" : ""}
                        `}
                      >
                        <TableCell className="w-10">
                          <div
                            {...provided.dragHandleProps}
                            className={`
                              flex items-center justify-center p-1 rounded
                              ${isDraggingDisabled ? "cursor-not-allowed text-muted-foreground" : "cursor-grab active:cursor-grabbing hover:bg-muted"}
                            `}
                          >
                            <GripVertical className="h-4 w-4" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={memo[0]}
                            onValueChange={(value) => {
                              const newMemoResult = [...memoResult];
                              newMemoResult[index] = (
                                type === "edge"
                                  ? shiftCycleEdge
                                  : shiftCycleCorner
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
                                <SelectItem
                                  key={`${index}-${pieceIndex}`}
                                  value={piece}
                                >
                                  {speffzToScheme(scheme, piece, type)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          {memo
                            .map((speffz) =>
                              speffzToScheme(scheme, speffz, type),
                            )
                            .join(" ")}
                        </TableCell>
                      </TableRow>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </TableBody>
          )}
        </Droppable>
      </Table>
    </DragDropContext>
  );
}
