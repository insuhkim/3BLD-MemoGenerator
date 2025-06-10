import { useContext, useRef, useState } from "react";
import { SettingsContext } from "../../context/SettingsContext";
import Cube2DPlayer from "./Cube2DPlayer";
import Cube3DPlayer from "./Cube3DPlayer";
import styles from "./CubeSidebar.module.css";

export default function CubeSidebar({ scramble }: { scramble: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("SettingsPanel must be used within a SettingsProvider");
  const { settings } = context;

  scramble =
    settings.postRotation && settings.cubePreviewStyle === "3D"
      ? `${scramble} ${settings.postRotation}`
      : scramble;

  return (
    <div className={styles.sidebarWrapper}>
      <button
        className={styles.sidebarOpen}
        onClick={() => setSidebarOpen((prev) => !prev)}
      >
        Preview
      </button>
      <div
        className={`${styles.sidebar} ${sidebarOpen ? styles.open : ""}`}
        tabIndex={-1}
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
          {settings.cubePreviewStyle === "2D" ? (
            <Cube2DPlayer scramble={scramble} />
          ) : (
            <Cube3DPlayer scramble={scramble} />
          )}
        </div>
      </div>
    </div>
  );
}
