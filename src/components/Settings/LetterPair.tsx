import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SettingsContext } from "@/context/SettingsContext";
import { Trash2 } from "lucide-react";
import { useContext, useState } from "react";

export default function LetterPair() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("LetterPair must be used within a SettingsProvider");
  }
  const {
    settings: { letterPairs },
    addLetterPair,
    deleteLetterPair,
  } = context;

  const [pair, setPair] = useState("");
  const [memo, setMemo] = useState("");

  const handleAdd = () => {
    if (pair && memo) {
      addLetterPair(pair, memo);
      setPair("");
      setMemo("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Letter Pairs</CardTitle>
        <CardDescription>
          Create, modify, or delete your custom letter pairs. These will
          override the default memos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Pair (e.g., AP)"
            value={pair}
            onChange={(e) => setPair(e.target.value)}
            maxLength={2}
            className="uppercase"
          />
          <Input
            placeholder="Memo (e.g., Apple)"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
          <Button onClick={handleAdd}>Add/Update</Button>
        </div>
        <div className="space-y-2">
          {Object.entries(letterPairs).map(([p, m]) => (
            <div
              key={p}
              className="flex items-center justify-between p-2 border rounded-md"
            >
              <div>
                <span className="font-mono font-bold">{p}</span>:{" "}
                <span>{m}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteLetterPair(p)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          {Object.keys(letterPairs).length} custom pair(s).
        </p>
      </CardFooter>
    </Card>
  );
}
