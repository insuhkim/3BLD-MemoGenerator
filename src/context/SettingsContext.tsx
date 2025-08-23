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

  // Initialize with default settings on both server and client to prevent hydration mismatch.
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // On the client, after the initial render, load settings from localStorage.
  useEffect(() => {
    try {
      const saved = localStorage.getItem("settings");
      if (saved) {
        const savedSettings = JSON.parse(saved);
        // Merge with defaults to ensure new settings are included.
        setSettings((prev) => ({ ...prev, ...savedSettings }));
      }
    } catch (error) {
      console.error("Failed to parse settings from localStorage", error);
    }
  }, []); // Empty dependency array ensures this runs only once on mount.

  // Save settings to localStorage whenever they change.
  useEffect(() => {
    // Avoid saving the initial default state to localStorage on first render.
    if (settings !== defaultSettings) {
      try {
        localStorage.setItem("settings", JSON.stringify(settings));
      } catch (error) {
        console.error("Failed to save settings to localStorage", error);
      }
    }
  }, [settings, defaultSettings]);

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
