"use client";
import { TwistyPlayer } from "cubing/twisty";
import { useEffect, useRef } from "react";

export default function Cube3DPlayer({
  scramble,
  background,
}: {
  scramble: string;
  background?: "none" | "auto";
}) {
  const twistyRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<TwistyPlayer | null>(null);

  useEffect(() => {
    if (!twistyRef.current) return;

    // Create the TwistyPlayer only once when component mounts
    const twisty = new TwistyPlayer({
      alg: scramble,
      background,
      controlPanel: "none",
    });

    playerRef.current = twisty;
    twistyRef.current.innerHTML = "";
    twistyRef.current.appendChild(twisty);

    return () => {
      if (twistyRef.current && playerRef.current) {
        if (twistyRef.current.contains(playerRef.current)) {
          twistyRef.current.removeChild(playerRef.current);
        }
      }
      playerRef.current = null;
    };
  }, []); // Run only once on mount

  // Update scramble in-place when it changes
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.alg = scramble;
    }
  }, [scramble]);

  // Update background in-place when it changes
  useEffect(() => {
    if (playerRef.current && background) {
      playerRef.current.background = background;
    }
  }, [background]);

  return <div ref={twistyRef} />;
}
