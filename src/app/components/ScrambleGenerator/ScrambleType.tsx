type scrambleType = "333" | "edges" | "corners";
const scrambleTypeLabels: Record<scrambleType, string> = {
  "333": "Normal Scramble",
  edges: "Edges Only",
  corners: "Corners Only",
};

export default function ScrambleType({
  scrambleType,
  setScrambleType,
}: {
  scrambleType: scrambleType;
  setScrambleType: (type: scrambleType) => void;
}) {
  const types: scrambleType[] = ["333", "edges", "corners"];
  const handleClick = () => {
    const idx = types.indexOf(scrambleType);
    setScrambleType(types[(idx + 1) % types.length]);
  };

  return (
    <button
      type="button"
      style={
        {
          // maxWidth: 220,
          // fontSize: "1rem",
          // borderRadius: "8px",
          // padding: "0.75rem 1rem",
          // whiteSpace: "nowrap",
        }
      }
      onClick={handleClick}
    >
      {scrambleTypeLabels[scrambleType]}
    </button>
  );
}
