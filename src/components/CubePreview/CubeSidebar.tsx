import { useLayoutEffect, useRef, useState } from "react";
import Cube3DPlayer from "./Cube3DPlayer";
import styles from "./CubeSidebar.module.css";
import { useContext } from "react";
import { SettingsContext } from "../../context/SettingsContext";

export default function CubeSidebar({ alg }: { alg: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const [sidebarHeight, setSidebarHeight] = useState<number | undefined>(
    undefined
  );

  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("SettingsPanel must be used within a SettingsProvider");
  const { settings } = context;

  alg = settings.preScramble ? `${settings.preScramble} ${alg}` : alg;

  useLayoutEffect(() => {
    if (sidebarOpen && previewRef.current) {
      setSidebarHeight(previewRef.current.offsetHeight);
    }
  }, [sidebarOpen, alg]);

  return (
    <div className={styles.sidebarWrapper}>
      <button
        className={styles.sidebarOpen}
        onClick={() => setSidebarOpen((prev) => !prev)}
      >
        Cube Preview
      </button>
      <div
        className={`${styles.sidebar} ${sidebarOpen ? styles.open : ""}`}
        tabIndex={-1}
        style={{
          height: sidebarOpen && sidebarHeight ? sidebarHeight + 48 : undefined, // 48px for header
        }}
      >
        <div className={styles.sidebarHeader}>
          <h2>Cube Preview</h2>
          <button
            className={styles.sidebarClose}
            onClick={() => setSidebarOpen(false)}
          >
            ×
          </button>
        </div>
        <div className={styles.sidebarContent} ref={previewRef}>
          <Cube3DPlayer alg={alg} />
        </div>
      </div>
    </div>
  );
}
