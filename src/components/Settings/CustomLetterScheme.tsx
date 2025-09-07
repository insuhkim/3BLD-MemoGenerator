// Thanks to https://github.com/nbwzx/blddb
// Source code in https://github.com/nbwzx/blddb/blob/v2/src/components/Code/index.tsx

"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { SettingsContext } from "@/context/SettingsContext";
import "@/styles/letterScheme.css";
import { colorName, orientations } from "@/utils/orientation";
import { isValidScheme } from "@/utils/scheme/isValidScheme";
import { useContext, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

function LetterScheme() {
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
  const facesMap = [
    [0, 1, 2, 3, 4, 5], [0, 2, 3, 4, 1, 5], [0, 3, 4, 1, 2, 5], [0, 4, 1, 2, 3, 5],
    [5, 3, 2, 1, 4, 0], [5, 4, 3, 2, 1, 0], [5, 1, 4, 3, 2, 0], [5, 2, 1, 4, 3, 0],
    [1, 0, 4, 5, 2, 3], [1, 2, 0, 4, 5, 3], [1, 4, 5, 2, 0, 3], [1, 5, 2, 0, 4, 3],
    [3, 5, 4, 0, 2, 1], [3, 4, 0, 2, 5, 1], [3, 2, 5, 4, 0, 1], [3, 0, 2, 5, 4, 1],
    [2, 0, 1, 5, 3, 4], [2, 1, 5, 3, 0, 4], [2, 3, 0, 1, 5, 4], [2, 5, 3, 0, 1, 4],
    [4, 5, 1, 0, 3, 2], [4, 3, 5, 1, 0, 2], [4, 1, 0, 3, 5, 2], [4, 0, 3, 5, 1, 2],
  ];
  const [selectedOrientationIndex, setSelectedOrientationIndex] = useState(0);
  const handleOrientationChange = (selectedIndex: number) => {
    const selectedColor = facesMap[selectedIndex].map((key) => colorList[key]);
    const newFaces = selectedColor.map(
      (color, i) => `face-${faceList[i]} ${color}`,
    );
    setFaces(newFaces);
    setSelectedOrientationIndex(selectedIndex);
  };

  const [inputValues, setInputValues] = useState("");

  const handleSave = () => {
    if (!isValidScheme(inputValues)) {
      toast("Invalid letter scheme", {
        description:
          "Please check that all positions have unique letters and there's no blank space",
        position: "top-center",
      });
      return;
    }
    setSettings((prev) => ({
      ...prev,
      letteringScheme: inputValues,
      orientation: orientations[
        selectedOrientationIndex
      ] as typeof prev.orientation,
    }));

    toast("Letter scheme saved successfully", {
      position: "top-center",
    });
  };

  const handleReset = () => {
    setInputValues(settings.letteringScheme);
    const index = orientations.indexOf(settings.orientation);
    if (index !== -1) handleOrientationChange(index);
  };

  useEffect(() => {
    const handleResize = () => {
      if (elementRef.current)
        setCellWidth(
          Math.min(
            Math.trunc(elementRef.current.offsetWidth / cubeSize / 4),
            60,
          ),
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
        (color, i) => `face-${faceList[i]} ${color}`,
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
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
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
          <Select
            onValueChange={(value) => handleOrientationChange(Number(value))}
            value={selectedOrientationIndex.toString()}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select orientation" />
            </SelectTrigger>
            <SelectContent>
              {orientations.map((orientation, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {colorName(orientation[0])}-{colorName(orientation[1])} (
                  {orientation.toUpperCase()})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleSave}>Save</Button>
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
                          e.target.value ?? "",
                        )
                      }
                    />
                  ),
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CustomLetterScheme() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Letter Scheme</CardTitle>
        <CardDescription>
          Set up your own letter scheme for each sticker on the cube. This
          scheme will be used to generate the memo. Please note that, regardless
          of the selected orientation, the scramble is always applied to the
          White top, Green front position.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LetterScheme />
      </CardContent>
    </Card>
  );
}
