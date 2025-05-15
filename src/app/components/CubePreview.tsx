"use client";
import { TwistyPlayer } from "cubing/twisty";
import { useEffect, useRef } from "react";
import style from "./CubePreview.module.css";

export default function CubePreview({ alg }: { alg: string }) {
  const twistyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const twisty = new TwistyPlayer({
      alg: alg,
      background: "none",
      controlPanel: "none",
    });
    if (twistyRef.current) {
      twistyRef.current.appendChild(twisty);
    }
    return () => {
      if (twistyRef.current) {
        twistyRef.current.removeChild(twisty);
      }
    };
  }, [alg]);
  return <div ref={twistyRef} className={style["cube-preview"]} />;
}
