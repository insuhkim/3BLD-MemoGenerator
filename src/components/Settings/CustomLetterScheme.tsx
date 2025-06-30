"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import LetterScheme from "../LetterScheme/Scheme";

export default function CustomLetterScheme() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Letter Scheme</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px]">
        <div>
          <DialogHeader>
            <DialogTitle>Custom Letter Scheme</DialogTitle>
            <DialogDescription>
              Set your custom letter scheme for corners and edges.
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="p-6 pt-0">
          <LetterScheme />
        </div>
      </DialogContent>
    </Dialog>
  );
}
