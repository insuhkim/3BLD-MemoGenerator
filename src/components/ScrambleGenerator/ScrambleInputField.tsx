"use client";

import { isValidScramble } from "@/utils/scramble/isValidScramble";
import { useCallback, useEffect, useRef, useState } from "react";
import { Textarea } from "../ui/textarea";

export default function ScrambleInputField({
  scramble,
  setScramble,
}: {
  scramble: string;
  setScramble: (scramble: string) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Local state mirrors the visual text instantly; upstream state is debounced.
  const [localValue, setLocalValue] = useState(scramble);

  // Keep local value in sync when the scramble is changed externally (e.g. Scramble button).
  useEffect(() => {
    setLocalValue(scramble);
  }, [scramble]);

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto"; // Reset height to correctly calculate scrollHeight
      el.style.height = `${el.scrollHeight}px`;
    }
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [localValue, adjustHeight]);

  useEffect(() => {
    // Initial adjustment after mount, in case scramble is pre-filled
    adjustHeight();

    window.addEventListener("resize", adjustHeight);
    return () => window.removeEventListener("resize", adjustHeight);
  }, [adjustHeight]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    // Always update the local (visual) value immediately for responsive typing.
    setLocalValue(value);

    // Debounce the upstream state update that triggers expensive recalculations.
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (isValidScramble(value)) {
        setScramble(value);
      }
    }, 300);
  };

  // Cleanup debounce on unmount.
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleInput = () => {
    adjustHeight(); // Adjust height on every input
  };

  return (
    <Textarea
      id="scramble"
      ref={textareaRef}
      rows={1} // Start with one row, will expand
      placeholder="Enter scramble"
      value={localValue}
      onChange={handleChange}
      onInput={handleInput}
      className="w-full p-3 text-lg md:text-lg font-mono leading-normal resize-none overflow-hidden min-h-[40px]" // Added font-mono and tracking-wide
    />
  );
}
