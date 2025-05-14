"use client";
import { useEffect, useRef } from "react";
import { generateScramble } from "react-rubiks-cube-utils";
export default function scrambleGenerator({
  scramble,
  setScramble,
}: {
  scramble: string;
  setScramble: (scramble: string) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const adjustHeight = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto"; // Reset height
      el.style.height = `${el.scrollHeight}px`; // Set to content height
    }
  };

  // Adjust height on initial render
  useEffect(() => {
    adjustHeight();
  }, [scramble]);

  // Adjust height on Screen Resize
  useEffect(() => {
    window.addEventListener("resize", adjustHeight);
    return () => {
      window.removeEventListener("resize", adjustHeight);
    };
  }, []);

  return (
    <div>
      <div>
        <label htmlFor="scramble">Enter scramble or Generate Scramble</label>
        <textarea
          id="scramble"
          ref={textareaRef}
          rows={1}
          placeholder="Enter scramble"
          style={{
            overflow: "hidden",
            resize: "none",
            width: "100%",
            padding: "12px",
            fontSize: "1rem",
            lineHeight: "1.5",
          }}
          value={scramble}
          onChange={(e) => {
            const value = e.target.value;
            const regex = /^[UDFBLR2' ]*$/;
            if (regex.test(value)) {
              setScramble(value);
            }
          }}
        ></textarea>
      </div>
      <button
        onClick={() => {
          setScramble(
            generateScramble({
              type: "3x3",
            })
          );
        }}
      >
        Generate Scramble
      </button>
    </div>
  );
}
