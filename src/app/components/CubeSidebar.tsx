import CubePreview from "./CubePreview";
import {
  useState,
  useRef,
  useLayoutEffect,
  useState as useStateReact,
} from "react";
import styles from "./CubeSidebar.module.css";

export default function CubeSidebar({ alg }: { alg: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const [sidebarHeight, setSidebarHeight] = useStateReact<number | undefined>(
    undefined
  );

  useLayoutEffect(() => {
    if (sidebarOpen && previewRef.current) {
      setSidebarHeight(previewRef.current.offsetHeight);
    }
  }, [sidebarOpen, alg]);

  return (
    <div className={styles["sidebar-wrapper"]}>
      <button
        className={styles["sidebar-open"]}
        onClick={() => setSidebarOpen(true)}
      >
        Cube Preview
      </button>
      <div
        className={`${styles.sidebar} ${sidebarOpen ? styles.open : ""}`}
        tabIndex={-1}
        style={{
          height: sidebarOpen && sidebarHeight ? sidebarHeight + 48 : undefined, // 48px for header
          // ...other inline styles if needed
        }}
      >
        <div className={styles["sidebar-header"]}>
          <h2>Cube Preview</h2>
          <button
            className={styles["sidebar-close"]}
            onClick={() => setSidebarOpen(false)}
          >
            ×
          </button>
        </div>
        <div className={styles["sidebar-content"]} ref={previewRef}>
          <CubePreview alg={alg} />
        </div>
      </div>
    </div>
  );
}
