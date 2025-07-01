import { Speffz } from "./types/Speffz";

export function speffzToLocation(
  scheme: string,
  speffz: Speffz,
  type: "edge" | "corner"
) {
  const index =
    "aAbD BdCceEfH FhGgiIjL JlKkmMnP NpOoqQrT RtSsuUvX VxWw".indexOf(
      type === "edge" ? speffz.toUpperCase() : speffz.toLowerCase()
    );

  return scheme[index];
}
