"use client";

import cstimer from "cstimer_module";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./ScrambleButton.module.css";

type ScrambleTypeOption = "333" | "edges" | "corners";

const SCRAMBLE_TYPE_OPTIONS: ScrambleTypeOption[] = ["333", "edges", "corners"];
const SCRAMBLE_TYPE_LABELS: Record<ScrambleTypeOption, string> = {
  "333": "Normal",
  edges: "Edge",
  corners: "Corner",
};

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

function ChevronArea({
  onClick,
}: {
  onClick: React.MouseEventHandler<HTMLSpanElement>;
}) {
  return (
    <span className={styles.chevronArea} onClick={onClick} tabIndex={0}>
      <span className={styles.verticalBar} />
      <span className={styles.chevron}>
        <ChevronSVG />
      </span>
    </span>
  );
}

function ScrambleDropdown({
  options,
  activeType,
  onSelect,
  dropdownRef,
}: {
  options: ScrambleTypeOption[];
  activeType: ScrambleTypeOption;
  onSelect: (type: ScrambleTypeOption) => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div ref={dropdownRef} className={styles.dropdown}>
      {options.map((type) => (
        <div
          key={type}
          className={
            activeType === type
              ? `${styles.dropdownItem} ${styles.dropdownItemActive}`
              : styles.dropdownItem
          }
          onClick={() => onSelect(type)}
        >
          {SCRAMBLE_TYPE_LABELS[type]}
        </div>
      ))}
    </div>
  );
}

export default function ScrambleButton({
  setScramble,
}: {
  setScramble: (scramble: string) => void;
}) {
  const [scrambleType, setScrambleType] = useState<ScrambleTypeOption>("333");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!dropdownOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleGenerate = useCallback(() => {
    setScramble(cstimer.getScramble(scrambleType));
  }, [scrambleType, setScramble]);

  const handleChevronClick = useCallback(
    (e: React.MouseEvent<HTMLSpanElement>) => {
      e.stopPropagation();
      setDropdownOpen((open) => !open);
    },
    []
  );

  const handleSelectType = useCallback((type: ScrambleTypeOption) => {
    setScrambleType(type);
    setDropdownOpen(false);
  }, []);

  return (
    <div className={styles.buttonWrapper}>
      <button onClick={handleGenerate} className={styles.generateButton}>
        Scramble ({SCRAMBLE_TYPE_LABELS[scrambleType]})
        <ChevronArea onClick={handleChevronClick} />
      </button>
      {dropdownOpen && (
        <ScrambleDropdown
          options={SCRAMBLE_TYPE_OPTIONS}
          activeType={scrambleType}
          onSelect={handleSelectType}
          dropdownRef={dropdownRef}
        />
      )}
    </div>
  );
}
