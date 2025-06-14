"use client";

import { useCallback, useEffect, useRef } from "react";
import { Textarea } from "../ui/textarea";

const SCRAMBLE_REGEX = /^[UDFBLR2' ]*$/;

export default function ScrambleInputField({
  scramble,
  setScramble,
}: {
  scramble: string;
  setScramble: (scramble: string) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto"; // Reset height to correctly calculate scrollHeight
      el.style.height = `${el.scrollHeight}px`;
    }
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [scramble, adjustHeight]);

  useEffect(() => {
    // Initial adjustment after mount, in case scramble is pre-filled
    adjustHeight();

    window.addEventListener("resize", adjustHeight);
    return () => window.removeEventListener("resize", adjustHeight);
  }, [adjustHeight]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value.toUpperCase();
    if (SCRAMBLE_REGEX.test(value)) {
      setScramble(value);
    }
  };

  const handleInput = () => {
    adjustHeight(); // Adjust height on every input
  };

  return (
    <Textarea
      id="scramble"
      ref={textareaRef}
      rows={1} // Start with one row, will expand
      placeholder="Enter scramble"
      value={scramble}
      onChange={handleChange}
      onInput={handleInput}
      className="w-full p-3 text-lg md:text-lg font-mono leading-normal resize-none overflow-hidden min-h-[40px]" // Added font-mono and tracking-wide
    />
  );
}
