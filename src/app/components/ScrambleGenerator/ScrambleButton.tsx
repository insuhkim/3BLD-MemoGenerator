import cstimer from "cstimer_module";
export default function ScrambleButton({
  setScramble,
}: {
  setScramble: (scramble: string) => void;
}) {
  return (
    <button
      onClick={() => {
        setScramble(cstimer.getScramble("333"));
        console.log(cstimer.getScrambleTypes());
      }}
    >
      Generate Scramble
    </button>
  );
}
