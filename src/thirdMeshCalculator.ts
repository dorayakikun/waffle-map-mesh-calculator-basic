import { FIRST_MAX_DIGIT, SECOND_MAX_DIGIT, THIRD_MAX_DIGIT } from "./constants";
import { calcNextPoints, calcPrevPoints } from "./pointCalculator";
import { toMeshCode as latLngToSecondMesh } from "./secondMeshCalculator";
import type { Bounds, LatLng, Point } from "./types";

/**
 * Compute the geographic center (latitude and longitude) of a third-division mesh code.
 *
 * @param meshCode - Eight-digit mesh code composed as: y1 (2 digits), x1 (2 digits), y2 (1 digit), x2 (1 digit), y3 (1 digit), x3 (1 digit).
 * @returns An object with `lat` and `lng` representing the center coordinates of the mesh.
 * @throws If `meshCode` is not exactly eight numeric digits.
 * @throws If the second-division digits (`y2` or `x2`) are not in the range 0–7.
 */
export function toCenterLatLng(meshCode: string): LatLng {
  if (!meshCode.match(/\d{8}/)) {
    throw new Error(
      `Invalid mesh code found.
Only numbers are acceptable.
Actual mesh code is "${meshCode}".`,
    );
  }

  const y1 = Number(meshCode.substring(0, 2));
  const x1 = Number(meshCode.substring(2, 4));
  const y2 = Number(meshCode.substring(4, 5));
  const x2 = Number(meshCode.substring(5, 6));
  const y3 = Number(meshCode.substring(6, 7));
  const x3 = Number(meshCode.substring(7));

  if (y2 > 7 || x2 > 7) {
    throw new Error(
      `Invalid mesh code found.
Only [0-7] are acceptable in second division.
Actual mesh code is "${meshCode}".`,
    );
  }

  return {
    lat: (y1 + (y2 + y3 / 10) / 8) / 1.5 + 1 / 240,
    lng: x1 + (x2 + x3 / 10) / 8 + 100 + 1 / 160,
  };
}

export function toBounds(meshCode: string): Bounds {
  if (!meshCode.match(/\d{8}/)) {
    throw new Error(
      `Invalid mesh code found.
Only numbers are acceptable.
Actual mesh code is "${meshCode}".`,
    );
  }

  const y1 = Number(meshCode.substring(0, 2));
  const x1 = Number(meshCode.substring(2, 4));
  const y2 = Number(meshCode.substring(4, 5));
  const x2 = Number(meshCode.substring(5, 6));
  const y3 = Number(meshCode.substring(6, 7));
  const x3 = Number(meshCode.substring(7));

  if (y2 > 7 || x2 > 7) {
    throw new Error(
      `Invalid mesh code found.
Only [0-7] are acceptable in second division.
Actual mesh code is "${meshCode}".`,
    );
  }

  const cy = (y1 + (y2 + y3 / 10) / 8) / 1.5;
  const cx = x1 + (x2 + x3 / 10) / 8 + 100;

  return {
    leftTop: { lat: cy + 1 / 120, lng: cx },
    rightBottom: { lat: cy, lng: cx + 1 / 80 },
  };
}

/**
 * Generate third-level mesh code for a latitude/longitude point.
 *
 * @param lat - Latitude in decimal degrees.
 * @param lng - Longitude in decimal degrees.
 * @returns The mesh code composed of the second-mesh segment, a hyphen, and two digits for the third-division Y and X (for example `xxxxxx-xy`).
 */
export function toMeshCode(lat: number, lng: number): string {
  const y2 = (lat * 1.5 - Math.trunc(lat * 1.5)) * 8;
  const x2 = (lng - 100 - Math.trunc(lng - 100)) * 8;

  const y3 = `${Math.trunc((y2 - Math.trunc(y2)) * 10)}`;
  const x3 = `${Math.trunc((x2 - Math.trunc(x2)) * 10)}`;
  return `${latLngToSecondMesh(lat, lng)}-${y3}${x3}`;
}

/**
 * Compute a third-mesh code shifted by integer offsets along the X and Y mesh axes.
 *
 * @param meshCode - The eight-digit mesh code grouped as y1 x1 y2 x2 y3 x3 (exactly 8 numeric characters).
 * @param offsetX - Horizontal offset in mesh units; positive increments X digit positions, negative decrements them.
 * @param offsetY - Vertical offset in mesh units; positive increments Y digit positions, negative decrements them.
 * @returns The new eight-digit mesh code after applying the specified offsets.
 * @throws If `meshCode` is not exactly eight numeric characters.
 */
export function offset(meshCode: string, offsetX: number, offsetY: number): string {
  if (!meshCode.match(/\d{8}/)) {
    throw new Error(
      `Invalid mesh code found.
Only numbers are acceptable.
Actual mesh code is "${meshCode}".`,
    );
  }

  const y1 = Number(meshCode.substring(0, 2));
  const x1 = Number(meshCode.substring(2, 4));
  const y2 = Number(meshCode.substring(4, 5));
  const x2 = Number(meshCode.substring(5, 6));
  const y3 = Number(meshCode.substring(6, 7));
  const x3 = Number(meshCode.substring(7));

  const calcOffsetY = offsetY > 0 ? calcNextPoints : calcPrevPoints;
  let ys: Point[] = [
    { value: y1, maxDigit: FIRST_MAX_DIGIT },
    { value: y2, maxDigit: SECOND_MAX_DIGIT },
    { value: y3, maxDigit: THIRD_MAX_DIGIT },
  ];

  Array(Math.abs(offsetY))
    .fill(0)
    .forEach(() => {
      ys = calcOffsetY(ys);
    });

  const calcOffsetX = offsetX > 0 ? calcNextPoints : calcPrevPoints;
  let xs: Point[] = [
    { value: x1, maxDigit: FIRST_MAX_DIGIT },
    { value: x2, maxDigit: SECOND_MAX_DIGIT },
    { value: x3, maxDigit: THIRD_MAX_DIGIT },
  ];
  Array(Math.abs(offsetX))
    .fill(0)
    .forEach(() => {
      xs = calcOffsetX(xs);
    });

  return `${ys[0].value}${xs[0].value}${ys[1].value}${xs[1].value}${ys[2].value}${xs[2].value}`;
}
