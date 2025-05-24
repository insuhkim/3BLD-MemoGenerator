"use client";

import cstimer from "cstimer_module";
import { useCallback, useState, useRef } from "react";

type ScrambleTypeOption = "333" | "edges" | "corners";

const SCRAMBLE_TYPE_LABELS: Record<ScrambleTypeOption, string> = {
  "333": "3x3",
  edges: "Edges",
  corners: "Corners",
};

export default function ScrambleButton({
  setScramble,
}: {
  setScramble: (scramble: string) => void;
}) {
  const [scrambleType, setScrambleType] = useState<ScrambleTypeOption>("333");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleGenerate = useCallback(() => {
    setScramble(cstimer.getScramble(scrambleType));
  }, [scrambleType, setScramble]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <div style={{ position: "relative", display: "inline-block" }}>
        <button
          onClick={handleGenerate}
          style={{ position: "relative", paddingRight: "2.5rem" }}
        >
          Generate Scramble
          <span
            style={{
              position: "absolute",
              right: "0.5rem",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              fontSize: "1rem",
              userSelect: "none",
              display: "flex",
              alignItems: "center",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setDropdownOpen((open) => !open);
            }}
            tabIndex={0}
          >
            {/* Slim downward chevron SVG */}
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              style={{ display: "block" }}
            >
              <polyline
                points="3,5 7,9 11,5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
        {dropdownOpen && (
          <div
            ref={dropdownRef}
            style={{
              position: "absolute",
              right: 0,
              top: "100%",
              background: "white",
              border: "1px solid #ccc",
              borderRadius: "4px",
              zIndex: 10,
              minWidth: "120px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            {(["333", "edges", "corners"] as ScrambleTypeOption[]).map(
              (type) => (
                <div
                  key={type}
                  style={{
                    padding: "0.5rem 1rem",
                    cursor: "pointer",
                    background: scrambleType === type ? "#f0f0f0" : "white",
                  }}
                  onClick={() => {
                    setScrambleType(type);
                    setDropdownOpen(false);
                  }}
                >
                  {SCRAMBLE_TYPE_LABELS[type]}
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
