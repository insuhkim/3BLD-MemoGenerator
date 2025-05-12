import { generateScramble } from "react-rubiks-cube-utils";
export default function scrambleGenerator({
  scramble,
  setScramble,
}: {
  scramble: string;
  setScramble: (scramble: string) => void;
}) {
  const handleClick = () => {
    setScramble(
      generateScramble({
        type: "3x3",
      })
    );
  };
  return (
    <div>
      <input
        type="text"
        value={scramble}
        onChange={(e) => {
          const value = e.target.value;
          // value only contains valid moves
          const regex = /^[UDFBLR2' ]*$/;
          if (regex.test(value)) {
            setScramble(value);
          }
        }}
        placeholder="Enter scramble"
      />
      <br />
      <button onClick={handleClick}> Generate Scramble </button>
    </div>
  );
}
