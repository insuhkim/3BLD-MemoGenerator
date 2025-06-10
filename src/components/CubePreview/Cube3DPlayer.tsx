"use client";
import { TwistyPlayer } from "cubing/twisty";
import { useEffect, useRef } from "react";

export default function Cube3DPlayer({ scramble }: { scramble: string }) {
  const twistyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!twistyRef.current) return;

    // Remove any existing children to prevent duplicates
    twistyRef.current.innerHTML = "";

    const twisty = new TwistyPlayer({
      alg: scramble,
      background: "none",
      controlPanel: "none",
    });

    twistyRef.current.appendChild(twisty);

    return () => {
      if (twistyRef.current && twistyRef.current.contains(twisty)) {
        twistyRef.current.removeChild(twisty);
      }
    };
  }, [scramble]);

  return <div ref={twistyRef} />;
}
