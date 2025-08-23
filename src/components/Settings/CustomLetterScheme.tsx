"use client";

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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import LetterScheme from "../LetterScheme/Scheme";

export default function CustomLetterScheme() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Letter Scheme</CardTitle>
        <CardDescription>
          Define your personal letter scheme for each sticker on the cube. This
          scheme is used to generate the memo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Note: Changing the letter scheme only affects the generated letter
          pairs. The internal logic still uses the Speffz letter scheme for
          scramble analysis.
        </p>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="mt-4">
              Edit Letter Scheme
            </Button>
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
      </CardContent>
    </Card>
  );
}
