import { describe, expect, test } from "vitest";
import { calcNextPoints, calcPrevPoints } from "../pointCalculator";

describe("pointCalculator", () => {
  test("calcNextPoints does not carry past the most-significant digit", () => {
    expect(
      calcNextPoints([
        { value: 99, maxDigit: 99 },
        { value: 7, maxDigit: 7 },
      ]),
    ).toEqual([
      { value: 100, maxDigit: 99 },
      { value: 0, maxDigit: 7 },
    ]);
  });

  test("calcPrevPoints does not borrow past the most-significant digit", () => {
    expect(
      calcPrevPoints([
        { value: 0, maxDigit: 99 },
        { value: 0, maxDigit: 7 },
      ]),
    ).toEqual([
      { value: -1, maxDigit: 99 },
      { value: 7, maxDigit: 7 },
    ]);
  });
});
