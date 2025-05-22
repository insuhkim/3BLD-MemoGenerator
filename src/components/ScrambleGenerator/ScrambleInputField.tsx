"use client";

import { useEffect, useRef, useCallback } from "react";

const SCRAMBLE_REGEX = /^[UDFBLR2' ]*$/;
const TEXTAREA_STYLE: React.CSSProperties = {
  overflow: "hidden",
  resize: "none",
  width: "100%",
  padding: "12px",
  fontSize: "1rem",
  lineHeight: "1.5",
};

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
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [scramble, adjustHeight]);

  useEffect(() => {
    window.addEventListener("resize", adjustHeight);
    return () => window.removeEventListener("resize", adjustHeight);
  }, [adjustHeight]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value.toUpperCase();
    if (SCRAMBLE_REGEX.test(value)) {
      setScramble(value);
    }
  };

  return (
    <div>
      <div>
        {/* <label htmlFor="scramble">Enter scramble or Generate Scramble</label> */}
        <textarea
          id="scramble"
          ref={textareaRef}
          rows={1}
          placeholder="Enter scramble"
          style={TEXTAREA_STYLE}
          value={scramble}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
