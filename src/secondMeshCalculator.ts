import { FIRST_MAX_DIGIT, SECOND_MAX_DIGIT } from "./constants";
import { toMeshCode as latLngToFirstMesh } from "./firstMeshCalculator";
import { calcNextPoints, calcPrevPoints } from "./pointCalculator";
import type { Bounds, LatLng } from "./types";

/**
 * Compute the geographic center of a 6-digit mesh code.
 *
 * @param meshCode - A 6-digit numeric mesh code where the first four digits are primary indices and the last two digits are second-division indices (each must be 0–7)
 * @returns An object with `lat` and `lng` representing the center latitude and longitude of the mesh
 * @throws Error if `meshCode` is not a six-digit numeric string
 * @throws Error if either of the second-division digits (positions 5 or 6) is not between 0 and 7
 */
export function toCenterLatLng(meshCode: string): LatLng {
  if (!meshCode.match(/\d{6}/)) {
    throw new Error(
      `Invalid mesh code found.
Only numbers are acceptable.
Actual mesh code is "${meshCode}".`,
    );
  }
  const y1 = Number(meshCode.substring(0, 2));
  const x1 = Number(meshCode.substring(2, 4));
  const y2 = Number(meshCode.substring(4, 5));
  const x2 = Number(meshCode.substring(5));

  if (y2 > 7 || x2 > 7) {
    throw new Error(
      `Invalid mesh code found.
Only [0-7] are acceptable in second division.
Actual mesh code is "${meshCode}".`,
    );
  }

  return {
    lat: (y1 + y2 / 8) / 1.5 + 1 / 24,
    lng: x1 + x2 / 8 + 100 + 1 / 16,
  };
}

export function toBounds(meshCode: string): Bounds {
  if (!meshCode.match(/\d{6}/)) {
    throw new Error(
      `Invalid mesh code found.
Only numbers are acceptable.
Actual mesh code is "${meshCode}".`,
    );
  }

  const y1 = Number(meshCode.substring(0, 2));
  const x1 = Number(meshCode.substring(2, 4));
  const y2 = Number(meshCode.substring(4, 5));
  const x2 = Number(meshCode.substring(5));

  if (y2 > 7 || x2 > 7) {
    throw new Error(
      `Invalid mesh code found.
Only [0-7] are acceptable in second division.
Actual mesh code is "${meshCode}".`,
    );
  }

  const cy = (y1 + y2 / 8) / 1.5;
  const cx = x1 + x2 / 8 + 100;

  return {
    leftTop: { lat: cy + 1 / 12, lng: cx },
    rightBottom: { lat: cy, lng: cx + 1 / 8 },
  };
}

/**
 * Produce the 6-digit mesh code for the given geographic coordinate.
 *
 * @param lat - Latitude in decimal degrees
 * @param lng - Longitude in decimal degrees
 * @returns The mesh code string composed of the primary mesh identifier, a hyphen, and two subdivision digits: vertical digit then horizontal digit (e.g. `XXXX-ytxh`)
 */
export function toMeshCode(lat: number, lng: number): string {
  const y1 = lat * 1.5;
  const x1 = lng - 100;

  const y2 = `${Math.trunc((y1 - Math.trunc(y1)) * 8)}`;
  const x2 = `${Math.trunc((x1 - Math.trunc(x1)) * 8)}`;
  return `${latLngToFirstMesh(lat, lng)}-${y2}${x2}`;
}

/**
 * Compute the 6-digit mesh code produced by shifting an input mesh code by the specified horizontal and vertical offsets.
 *
 * @param meshCode - The original 6-digit numeric mesh code.
 * @param offsetX - Horizontal offset in mesh units: positive moves to the next columns (east), negative to previous columns (west).
 * @param offsetY - Vertical offset in mesh units: positive moves to the next rows (north), negative to previous rows (south).
 * @returns The 6-digit mesh code after applying the horizontal and vertical offsets.
 * @throws If `meshCode` is not a 6-digit numeric string.
 */
export function offset(meshCode: string, offsetX: number, offsetY: number): string {
  if (!meshCode.match(/\d{6}/)) {
    throw new Error(
      `Invalid mesh code found.
Only numbers are acceptable.
Actual mesh code is "${meshCode}".`,
    );
  }

  const y1 = Number(meshCode.substring(0, 2));
  const x1 = Number(meshCode.substring(2, 4));
  const y2 = Number(meshCode.substring(4, 5));
  const x2 = Number(meshCode.substring(5));

  const calcOffsetY = offsetY > 0 ? calcNextPoints : calcPrevPoints;
  let ys = [
    { value: y1, maxDigit: FIRST_MAX_DIGIT },
    { value: y2, maxDigit: SECOND_MAX_DIGIT },
  ];
  Array(Math.abs(offsetY))
    .fill(0)
    .forEach(() => {
      ys = calcOffsetY(ys);
    });

  const calcOffsetX = offsetX > 0 ? calcNextPoints : calcPrevPoints;
  let xs = [
    { value: x1, maxDigit: FIRST_MAX_DIGIT },
    { value: x2, maxDigit: SECOND_MAX_DIGIT },
  ];
  Array(Math.abs(offsetX))
    .fill(0)
    .forEach(() => {
      xs = calcOffsetX(xs);
    });

  return `${ys[0].value}${xs[0].value}${ys[1].value}${xs[1].value}`;
}
