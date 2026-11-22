import type { Point } from "./types";

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

export function offsetPoints(points: Point[], delta: number): Point[] {
  const count = Math.abs(delta);
  let current = points;
  switch (Math.sign(delta)) {
    case 1:
      Array(count)
        .fill(0)
        .forEach(() => {
          current = calcNextPoints(current);
        });
      break;
    case -1:
      Array(count)
        .fill(0)
        .forEach(() => {
          current = calcPrevPoints(current);
        });
      break;
  }
  return current;
}
