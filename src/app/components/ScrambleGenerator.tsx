"use client";
import { useRef } from "react";
import { generateScramble } from "react-rubiks-cube-utils";
export default function scrambleGenerator({
  scramble,
  setScramble,
}: {
  scramble: string;
  setScramble: (scramble: string) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const handleClick = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto"; // Reset height
      el.style.height = `${el.scrollHeight}px`; // Set to content height
    }

    setScramble(
      generateScramble({
        type: "3x3",
      })
    );
  };

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
      <br />
      <button onClick={handleClick}> Generate Scramble </button>
    </div>
  );
}
