"use client";
import React, { createContext, ReactNode, useEffect, useState } from "react";

import { Settings } from "@/utils/types/Settings";

// Define the shape of the context value
type SettingsContextType = {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
};

// Create the context with a default value (will be overridden by provider)
export const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

type SettingsProviderProps = {
  children: ReactNode;
};
export const SettingsProvider: React.FC<SettingsProviderProps> = ({
  children,
}) => {
  const defaultSettings: Settings = {
    edgePriority: [],
    cornerPriority: [],
    edgeBuffer: "C",
    cornerBuffer: "C",
    resultSeparator: " ",
    cycleStyle: "parenthesis",
    showFlippedEdge: "none",
    showFlippedCorner: "none",
    postRotation: "",
    cubePreviewStyle: "3D",
  };

  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("settings");
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    }
  }, []);

  // Save settings to localStorage on change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("settings", JSON.stringify(settings));
    }
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
