import type { Bounds, LatLng } from "./types";

/**
 * Compute the geographic center latitude and longitude for a 4-digit mesh code.
 *
 * @param meshCode - A 4-digit numeric mesh code where the first two digits represent latitude index and the last two represent longitude index
 * @returns An object with `lat` and `lng` representing the center coordinates of the mesh
 * @throws Error if `meshCode` is not a 4-digit numeric string
 */
export function toCenterLatLng(meshCode: string): LatLng {
  if (!meshCode.match(/\d{4}/)) {
    throw new Error(
      `Invalid mesh code found.
Only numbers are acceptable.
Actual mesh code is "${meshCode}".`,
    );
  }
  const y1 = Number(meshCode.substring(0, 2));
  const x1 = Number(meshCode.substring(2));
  return {
    lat: y1 / 1.5 + 1 / 3,
    lng: x1 + 100 + 1 / 2,
  };
}

export function toBounds(meshCode: string): Bounds {
  if (!meshCode.match(/\d{4}/)) {
    throw new Error(
      `Invalid mesh code found.
Only numbers are acceptable.
Actual mesh code is "${meshCode}".`,
    );
  }

  const y1 = Number(meshCode.substring(0, 2));
  const x1 = Number(meshCode.substring(2, 4));
  const cy = y1 / 1.5;
  const cx = x1 + 100;

  return {
    leftTop: { lat: cy + 2 / 3, lng: cx },
    rightBottom: { lat: cy, lng: cx + 1 },
  };
}

/**
 * Convert geographic coordinates to a mesh code string identifying the grid cell that contains the point.
 *
 * @param lat - Latitude in decimal degrees
 * @param lng - Longitude in decimal degrees
 * @returns A mesh code string formed by concatenating the integer part of `lat * 1.5` and the integer part of `lng - 100`
 */
export function toMeshCode(lat: number, lng: number): string {
  const y1 = Math.trunc(lat * 1.5).toString();
  const x1 = Math.trunc(lng - 100).toString();
  return y1 + x1;
}

/**
 * Produce a new mesh code by adding numeric offsets to the mesh code's two parts.
 *
 * @param meshCode - A 4-digit numeric mesh code where the first two digits are the latitude index and the last two are the longitude index
 * @param offsetX - Value to add to the longitude index (last two digits)
 * @param offsetY - Value to add to the latitude index (first two digits)
 * @returns The resulting mesh code formed by concatenating the adjusted latitude index and longitude index
 * @throws Error if `meshCode` is not a 4-digit numeric string
 */
export function offset(meshCode: string, offsetX: number, offsetY: number): string {
  if (!meshCode.match(/\d{4}/)) {
    throw new Error(
      `Invalid mesh code found.
Only numbers are acceptable.
Actual mesh code is "${meshCode}".`,
    );
  }

  const y1 = Number(meshCode.substring(0, 2));
  const x1 = Number(meshCode.substring(2));

  return `${y1 + offsetY}${x1 + offsetX}`;
}