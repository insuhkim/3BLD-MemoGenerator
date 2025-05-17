import { Speffz } from "../scripts/types/Speffz";
export default function BufferSelection({
  buffer,
  setBuffer,
}: {
  buffer: Speffz;
  setBuffer: (buffer: Speffz) => void;
}) {
  const AtoX = "ABCDEFGHIJKLMNOPQRSTUVWX";

  return (
    <div>
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
