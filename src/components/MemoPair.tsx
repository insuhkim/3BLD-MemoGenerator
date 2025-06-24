import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CornerToURL from "@/utils/BLDDB/CornerToURL";
import Edge2URL from "@/utils/BLDDB/EdgeToURL";
import { Speffz } from "@/utils/types/Speffz";
import { Link } from "lucide-react";

interface MemoPairProps {
  pieceType: "edge" | "corner";
  buffer: Speffz;
  target1: Speffz;
  target2?: Speffz;
}

export default function MemoPair({
  pieceType,
  buffer,
  target1,
  target2,
}: MemoPairProps) {
  // For odd-length cycles, the last target is not paired.
  if (!target2) {
    return <span className="p-1">{target1}</span>;
  }

  const url =
    pieceType === "edge"
      ? Edge2URL(buffer, target1, target2)
      : CornerToURL(buffer, target1, target2);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <span className="cursor-pointer p-1 rounded-md hover:bg-accent">
          {target1}
          {target2}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-sans"
        >
          <Link className="h-4 w-4" />
          Search on BLDDB
        </a>
      </PopoverContent>
    </Popover>
  );
}
