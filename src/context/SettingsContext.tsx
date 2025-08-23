"use client";
import React, { createContext, ReactNode, useEffect, useState } from "react";

import { Settings } from "@/utils/types/Settings";

// Define the shape of the context value
type SettingsContextType = {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  addLetterPair: (pair: string, memo: string) => void;
  deleteLetterPair: (pair: string) => void;
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
    cycleStyle: "vertical",
    showFlippedEdge: "none",
    showFlippedCorner: "none",
    cubePreviewStyle: "3D",
    memoSwap: "none",
    applyScrambleRotationToPreview: false,
    orientation: "wg",
    letteringScheme: "AABD BDCCEEFH FHGGIIJL JLKKMMNP NPOOQQRT RTSSUUVX VXWW",
    letterPairs: {},
    useCustomLetterPairs: true,
  };

  const [settings, setSettings] = useState<Settings>(() => {
    // This function runs only on the initial render
    if (typeof window === "undefined") {
      return defaultSettings;
    }
    try {
      const saved = localStorage.getItem("settings");
      if (saved) {
        // Merge saved settings with defaults to include any new default properties
        return { ...defaultSettings, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.error("Failed to parse settings from localStorage", error);
      // Fallback to defaults if parsing fails
      return defaultSettings;
    }
    return defaultSettings;
  });

  // This effect now only serves to save settings when they change.
  useEffect(() => {
    try {
      localStorage.setItem("settings", JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save settings to localStorage", error);
    }
  }, [settings]);

  const addLetterPair = (pair: string, memo: string) => {
    setSettings((prev) => ({
      ...prev,
      letterPairs: {
        ...prev.letterPairs,
        [pair.toUpperCase()]: memo,
      },
    }));
  };

  const deleteLetterPair = (pair: string) => {
    setSettings((prev) => {
      const newLetterPairs = { ...prev.letterPairs };
      delete newLetterPairs[pair.toUpperCase()];
      return {
        ...prev,
        letterPairs: newLetterPairs,
      };
    });
  };

  return (
    <SettingsContext.Provider
      value={{ settings, setSettings, addLetterPair, deleteLetterPair }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
