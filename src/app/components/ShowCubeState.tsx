import { applyScramble, DisplayCube } from "react-rubiks-cube-utils";

export default function ShowCubeState({
  scramble,
  size = 20,
}: {
  scramble: string;
  size?: number;
}) {
  const cube = applyScramble({ type: "3x3", scramble: scramble });
  return (
    <div>
      <h1> Cube State </h1>
      <DisplayCube cube={cube} size={size} />
    </div>
  );
}
