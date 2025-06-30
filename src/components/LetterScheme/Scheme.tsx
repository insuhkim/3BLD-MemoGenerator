"use client";

import { SettingsContext } from "@/context/SettingsContext";
import "@/styles/letterScheme.css";
import { useContext, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";

export default function LetterScheme() {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("SettingsPanel must be used within a SettingsProvider");

  const { settings, setSettings } = context;

  const letteringSchemes = {
    Chichu: "DEGC GAAJEDCX TQLMBBLS QNJYKHIR ZZPSHFFY WTNPWIXK OOMR",
    Speffz: "AABD BDCCEEFH FHGGIIJL JLKKMMNP NPOOQQRT RTSSUUVX VXWW",
  };

  const cubeSize = 3;
  const faceSize = cubeSize * cubeSize;
  const elementRef = useRef<HTMLDivElement>(null);
  const [cellWidth, setCellWidth] = useState(0);
  const [faces, setFaces] = useState([
    "face-u white",
    "face-l orange",
    "face-f green",
    "face-r red",
    "face-b blue",
    "face-d yellow",
  ]);
  const faceList = ["u", "l", "f", "r", "b", "d"];
  const colorList = ["white", "orange", "green", "red", "blue", "yellow"];
  // prettier-ignore
  const orientations = [
    "wg", "wr", "wb", "wo",
    "yg", "yr", "yb", "yo",
    "ob", "ow", "oy", "og",
    "rb", "rw", "ry", "rg",
    "go", "gy", "gw", "gr",
    "bo", "by", "bw", "br",
  ];
  const facesMap = [
    [0, 1, 2, 3, 4, 5],
    [0, 2, 3, 4, 1, 5],
    [0, 3, 4, 1, 2, 5],
    [0, 4, 1, 2, 3, 5],
    [5, 3, 2, 1, 4, 0],
    [5, 4, 3, 2, 1, 0],
    [5, 1, 4, 3, 2, 0],
    [5, 2, 1, 4, 3, 0],
    [1, 0, 4, 5, 2, 3],
    [1, 2, 0, 4, 5, 3],
    [1, 4, 5, 2, 0, 3],
    [1, 5, 2, 0, 4, 3],
    [3, 5, 4, 0, 2, 1],
    [3, 4, 0, 2, 5, 1],
    [3, 2, 5, 4, 0, 1],
    [3, 0, 2, 5, 4, 1],
    [2, 0, 1, 5, 3, 4],
    [2, 1, 5, 3, 0, 4],
    [2, 3, 0, 1, 5, 4],
    [2, 5, 3, 0, 1, 4],
    [4, 5, 1, 0, 3, 2],
    [4, 3, 5, 1, 0, 2],
    [4, 1, 0, 3, 5, 2],
    [4, 0, 3, 5, 1, 2],
  ];
  const [selectedOrientationIndex, setSelectedOrientationIndex] = useState(0);
  const handleOrientationChange = (selectedIndex: number) => {
    const selectedColor = facesMap[selectedIndex].map((key) => colorList[key]);
    const newFaces = selectedColor.map(
      (color, i) => `face-${faceList[i]} ${color}`
    );
    setFaces(newFaces);
    setSelectedOrientationIndex(selectedIndex);
    setSettings((prev) => ({
      ...prev,
      orientation: orientations[selectedIndex] as typeof prev.orientation,
    }));
  };

  const [inputValues, setInputValues] = useState("");

  useEffect(() => {
    const handleResize = () => {
      if (elementRef.current)
        setCellWidth(
          Math.min(
            Math.trunc(elementRef.current.offsetWidth / cubeSize / 4),
            60
          )
        );
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setInputValues(settings.letteringScheme);
  }, [settings.letteringScheme]);

  useEffect(() => {
    const index = orientations.indexOf(settings.orientation);
    if (index !== -1) {
      const selectedColor = facesMap[index].map((key) => colorList[key]);
      const newFaces = selectedColor.map(
        (color, i) => `face-${faceList[i]} ${color}`
      );
      setFaces(newFaces);
      setSelectedOrientationIndex(index);
    }
  }, [settings.orientation]);

  const handleChange = (index: number, value: string) => {
    const updatedValues =
      inputValues.substring(0, index) +
      (value[0]?.toUpperCase() ?? " ") +
      inputValues.substring(index + 1);
    setInputValues(updatedValues);
    setSettings((prev) => ({ ...prev, letteringScheme: updatedValues }));
  };

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800 lg:w-auto lg:flex-none">
        <div className="mb-6">
          <label className="mb-2 block font-bold text-black dark:text-white">
            Preset
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(letteringSchemes).map(([scheme, value]) => (
              <Button
                variant={"outline"}
                key={scheme}
                onClick={() => {
                  setInputValues(value);
                  setSettings((prev) => ({
                    ...prev,
                    letteringScheme: value,
                  }));
                }}
              >
                {scheme}
              </Button>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-2 block font-bold text-black dark:text-white">
            Orientation
          </label>
          <select
            className="w-full rounded-md border-gray-300 bg-gray-50 py-2 pl-3 pr-10 text-base text-black focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
            onChange={(e) => handleOrientationChange(Number(e.target.value))}
            value={selectedOrientationIndex}
          >
            {orientations.map((orientation, index) => (
              <option key={index} value={index}>
                {orientation}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div ref={elementRef} className="flex flex-1 items-center justify-center">
        {cellWidth !== 0 && (
          <div
            className="relative grid grid-cols-4 grid-rows-3"
            style={{
              height: `${3.2 * cubeSize * cellWidth}px`,
              width: `${4.3 * cubeSize * cellWidth}px`,
            }}
          >
            {faces.map((face, faceIndex) => (
              <div
                className={`${face} absolute grid`}
                style={{
                  gridTemplateRows: `repeat(${cubeSize}, ${cellWidth}px)`,
                  gridTemplateColumns: `repeat(${cubeSize}, ${cellWidth}px)`,
                }}
                key={faceIndex}
              >
                {Array.from({ length: faceSize }).map((_, cellIndex) =>
                  cellIndex === (faceSize - 1) / 2 ? (
                    <div
                      className="border-l-2 border-t-2 border-black/80"
                      key={faceIndex * faceSize + cellIndex}
                    ></div>
                  ) : (
                    <input
                      key={faceIndex * faceSize + cellIndex}
                      type="text"
                      className={
                        "relative h-full w-full rounded-none border-l-2  border-t-2 border-black bg-transparent p-0 text-center uppercase leading-normal text-black outline-none hover:cursor-pointer hover:bg-black/40"
                      }
                      style={{ fontSize: `${0.75 * cellWidth}px` }}
                      onFocus={(e) => e.target.select()}
                      maxLength={1}
                      value={(
                        inputValues[faceIndex * faceSize + cellIndex] ?? ""
                      ).trim()}
                      onChange={(e) =>
                        handleChange(
                          faceIndex * faceSize + cellIndex,
                          e.target.value ?? ""
                        )
                      }
                    />
                  )
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
