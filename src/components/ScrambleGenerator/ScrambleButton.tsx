"use client";

import cstimer from "cstimer_module";
import { useCallback, useState, useRef } from "react";
import styles from "./ScrambleButton.module.css";

type ScrambleTypeOption = "333" | "edges" | "corners";

function ChevronSVG() {
  /* Slim downward chevron SVG */
  return (
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
  );
}

const SCRAMBLE_TYPE_LABELS: Record<ScrambleTypeOption, string> = {
  "333": "Normal",
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
    <div className={styles.container}>
      <div className={styles.buttonWrapper}>
        <button onClick={handleGenerate} className={styles.generateButton}>
          Generate {SCRAMBLE_TYPE_LABELS[scrambleType]} Scramble
          {/* Chevron and vertical bar wrapper */}
          <span
            className={styles.chevronArea}
            onClick={(e) => {
              e.stopPropagation();
              setDropdownOpen((open) => !open);
            }}
            tabIndex={0}
          >
            <span className={styles.verticalBar} />
            <span className={styles.chevron}>
              <ChevronSVG />
            </span>
          </span>
        </button>
        {dropdownOpen && (
          <div ref={dropdownRef} className={styles.dropdown}>
            {(["333", "edges", "corners"] as ScrambleTypeOption[]).map(
              (type) => (
                <div
                  key={type}
                  className={
                    scrambleType === type
                      ? `${styles.dropdownItem} ${styles.dropdownItemActive}`
                      : styles.dropdownItem
                  }
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
