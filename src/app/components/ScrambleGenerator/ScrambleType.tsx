export type ScrambleTypeOption = "333" | "edges" | "corners";

const SCRAMBLE_TYPES: ScrambleTypeOption[] = ["333", "edges", "corners"];
const SCRAMBLE_TYPE_LABELS: Record<ScrambleTypeOption, string> = {
  "333": "Normal Scramble",
  edges: "Edges Only",
  corners: "Corners Only",
};

interface ScrambleTypeProps {
  scrambleType: ScrambleTypeOption;
  setScrambleType: (type: ScrambleTypeOption) => void;
}

const ScrambleType: React.FC<ScrambleTypeProps> = ({
  scrambleType,
  setScrambleType,
}) => {
  const handleClick = () => {
    const idx = SCRAMBLE_TYPES.indexOf(scrambleType);
    setScrambleType(SCRAMBLE_TYPES[(idx + 1) % SCRAMBLE_TYPES.length]);
  };

  return (
    <button type="button" onClick={handleClick}>
      {SCRAMBLE_TYPE_LABELS[scrambleType]}
    </button>
  );
};

export default ScrambleType;
