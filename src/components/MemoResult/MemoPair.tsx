import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SettingsContext } from "@/context/SettingsContext";
import { Speffz } from "@/utils/types/Speffz";
import { Link, Pencil } from "lucide-react";
import { useContext } from "react";

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
    settings: { letterPairs },
  } = context;

  const handleModify = () => {
    // TODO: Implement modification logic here
    console.log("Modify pair:", target1, target2);
  };

  const pairString = target2 ? `${target1}${target2}` : target1;
  const customMemo = letterPairs[pairString.toUpperCase()];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span className="cursor-pointer p-1 rounded-md hover:bg-accent">
          {customMemo ??
            entireString ??
            prefix +
              target1Character +
              (target2 ? infix : "") +
              (target2Character ?? "") +
              suffix}
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
