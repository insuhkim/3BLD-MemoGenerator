import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CornerToURL from "@/utils/BLDDB/CornerToURL";
import Edge2URL from "@/utils/BLDDB/EdgeToURL";
import { Speffz } from "@/utils/types/Speffz";
import { Link, Pencil } from "lucide-react";

interface MemoPairProps {
  pieceType: "edge" | "corner";
  buffer: Speffz;
  target1: Speffz;
  target2?: Speffz;
  middleCharacter?: string;
  target1Character?: string;
  target2Character?: string;
  entireString?: string;
}

export default function MemoPair({
  pieceType,
  buffer,
  target1,
  target2,
  middleCharacter = "",
  target1Character = target1,
  target2Character = target2,
  entireString,
}: MemoPairProps) {
  // For odd-length cycles, the last target is not paired.
  if (!target2) {
    return <span className="p-1">{target1}</span>;
  }

  const url =
    pieceType === "edge"
      ? Edge2URL(buffer, target1, target2)
      : CornerToURL(buffer, target1, target2);

  const handleModify = () => {
    // TODO: Implement modification logic here
    console.log("Modify pair:", target1, target2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span className="cursor-pointer p-1 rounded-md hover:bg-accent">
          {entireString ||
            target1Character + middleCharacter + target2Character}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
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
  );
}
