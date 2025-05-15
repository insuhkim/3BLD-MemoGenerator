"use client";
import React, { createContext, useState, useEffect, ReactNode } from "react";

import { Settings, CycleNotationStyle } from "../scripts/types/Settings";
import { Speffz } from "../scripts/types/Speffz";

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
  // Helper to load from localStorage or use default
  const defaultSettings = {
    edgePriority: [] as Speffz[],
    cornerPriority: [] as Speffz[],
    edgeBuffer: "C" as Speffz,
    cornerBuffer: "C" as Speffz,
    resultSeparator: " ",
    cycleStyle: "parenthesis" as CycleNotationStyle,
  };
  // const getInitialSettings = (): Settings => {
  //   const saved = localStorage.getItem("settings");
  //   return saved ? JSON.parse(saved) : defaultSettings;
  // };

  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    const saved =
      typeof window !== "undefined" ? localStorage.getItem("settings") : null;
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);
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
