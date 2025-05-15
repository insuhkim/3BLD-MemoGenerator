import { Speffz } from "../scripts/types/Speffz";
export default function BufferSelection({
  buffer,
  setBuffer,
  bufferType,
}: {
  buffer: Speffz;
  setBuffer: (buffer: Speffz) => void;
  bufferType: "edge" | "corner";
}) {
  const AtoX = "ABCDEFGHIJKLMNOPQRSTUVWX";

  return (
    <div>
      <p>Choose a buffer for {bufferType} </p>
      <select
        value={buffer}
        onChange={(e) => setBuffer(e.target.value as Speffz)}
      >
        {AtoX.split("").map((letter) => (
          <option key={letter} value={letter}>
            {letter}
          </option>
        ))}
      </select>
    </div>
  );
}
