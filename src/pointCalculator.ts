import type { Point } from "./types";

/**
 * Advance a multi-digit sequence of points by one step, propagating carries from the last point toward the first.
 *
 * @param points - Array of points representing a multi-digit value (last element is the least-significant digit)
 * @returns A new array reflecting the incremented point values; when a point's `value` exceeds its `maxDigit` it is set to `0` and the previous point's `value` is incremented
 *
 * Note: The returned array is a new array object, but its elements are the same point objects from the input (their `value` properties may be mutated).
 */
export function calcNextPoints(points: Point[]): Point[] {
  const nextPoints = [...points];
  const last = nextPoints.length - 1;
  nextPoints[last].value++;
  for (let i = last; i > 0; i--) {
    if (nextPoints[i].value > nextPoints[i].maxDigit) {
      nextPoints[i].value = 0;
      nextPoints[i - 1].value++;
    } else {
      break;
    }
  }
  return nextPoints;
}

export function calcPrevPoints(points: Point[]): Point[] {
  const prevPoints = [...points];
  const last = prevPoints.length - 1;
  prevPoints[last].value--;
  for (let i = last; i > 0; i--) {
    if (prevPoints[i].value < 0) {
      prevPoints[i].value = prevPoints[i].maxDigit;
      prevPoints[i - 1].value--;
    } else {
      break;
    }
  }
  return prevPoints;
}