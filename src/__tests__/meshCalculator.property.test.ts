import * as fc from "fast-check";
import { describe, expect, test } from "vitest";
import { toBounds, toCenterLatLng, toMeshCode } from "../meshCalculator";

describe("meshCalculator - Property Based Testing", () => {
  describe("toMeshCode と toCenterLatLng の可逆性", () => {
    test("scale 1: toMeshCode → toCenterLatLng → toMeshCode で元に戻る", () => {
      fc.assert(
        fc.property(
          fc.double({ min: 10, max: 66, noNaN: true }),
          fc.double({ min: 110, max: 179, noNaN: true }),
          (lat, lng) => {
            const meshCode = toMeshCode(lat, lng, 1);
            const center = toCenterLatLng(meshCode);
            const meshCodeAgain = toMeshCode(center.lat, center.lng, 1);
            expect(meshCodeAgain).toBe(meshCode);
          },
        ),
        { numRuns: 1000 },
      );
    });

    test("scale 2: toMeshCode → toCenterLatLng → toMeshCode で元に戻る", () => {
      fc.assert(
        fc.property(
          fc.double({ min: 10, max: 66, noNaN: true }),
          fc.double({ min: 110, max: 179, noNaN: true }),
          (lat, lng) => {
            const meshCode = toMeshCode(lat, lng, 2);
            const center = toCenterLatLng(meshCode);
            const meshCodeAgain = toMeshCode(center.lat, center.lng, 2);
            expect(meshCodeAgain).toBe(meshCode);
          },
        ),
        { numRuns: 1000 },
      );
    });

    test("scale 3: toMeshCode → toCenterLatLng → toMeshCode で元に戻る", () => {
      fc.assert(
        fc.property(
          fc.double({ min: 10, max: 66, noNaN: true }),
          fc.double({ min: 110, max: 179, noNaN: true }),
          (lat, lng) => {
            const meshCode = toMeshCode(lat, lng, 3);
            const center = toCenterLatLng(meshCode);
            const meshCodeAgain = toMeshCode(center.lat, center.lng, 3);
            expect(meshCodeAgain).toBe(meshCode);
          },
        ),
        { numRuns: 1000 },
      );
    });
  });

  describe("toBounds の不変条件", () => {
    test("mesh code の bounds は leftTop.lat > rightBottom.lat", () => {
      fc.assert(
        fc.property(
          fc.double({ min: 10, max: 66, noNaN: true }),
          fc.double({ min: 110, max: 179, noNaN: true }),
          fc.integer({ min: 1, max: 3 }),
          (lat, lng, scale) => {
            const meshCode = toMeshCode(lat, lng, scale);
            const bounds = toBounds(meshCode);
            expect(bounds.leftTop.lat).toBeGreaterThan(bounds.rightBottom.lat);
          },
        ),
        { numRuns: 1000 },
      );
    });

    test("mesh code の center は bounds 内に含まれる", () => {
      fc.assert(
        fc.property(
          fc.double({ min: 10, max: 66, noNaN: true }),
          fc.double({ min: 110, max: 179, noNaN: true }),
          fc.integer({ min: 1, max: 3 }),
          (lat, lng, scale) => {
            const meshCode = toMeshCode(lat, lng, scale);
            const center = toCenterLatLng(meshCode);
            const bounds = toBounds(meshCode);
            expect(center.lat).toBeGreaterThanOrEqual(bounds.rightBottom.lat);
            expect(center.lat).toBeLessThanOrEqual(bounds.leftTop.lat);
            expect(center.lng).toBeGreaterThanOrEqual(bounds.leftTop.lng);
            expect(center.lng).toBeLessThanOrEqual(bounds.rightBottom.lng);
          },
        ),
        { numRuns: 1000 },
      );
    });
  });

  describe("mesh code のフォーマット検証", () => {
    test("scale 1 で生成された mesh code は 4 桁", () => {
      fc.assert(
        fc.property(
          fc.double({ min: 10, max: 66, noNaN: true }),
          fc.double({ min: 110, max: 179, noNaN: true }),
          (lat, lng) => {
            const meshCode = toMeshCode(lat, lng, 1);
            expect(meshCode).toMatch(/^\d{4}$/);
          },
        ),
        { numRuns: 500 },
      );
    });

    test("scale 2 で生成された mesh code は 4-2 桁形式", () => {
      fc.assert(
        fc.property(
          fc.double({ min: 10, max: 66, noNaN: true }),
          fc.double({ min: 110, max: 179, noNaN: true }),
          (lat, lng) => {
            const meshCode = toMeshCode(lat, lng, 2);
            expect(meshCode).toMatch(/^\d{4}-\d{2}$/);
          },
        ),
        { numRuns: 500 },
      );
    });

    test("scale 3 で生成された mesh code は 4-2-2 桁形式", () => {
      fc.assert(
        fc.property(
          fc.double({ min: 10, max: 66, noNaN: true }),
          fc.double({ min: 110, max: 179, noNaN: true }),
          (lat, lng) => {
            const meshCode = toMeshCode(lat, lng, 3);
            expect(meshCode).toMatch(/^\d{4}-\d{2}-\d{2}$/);
          },
        ),
        { numRuns: 500 },
      );
    });
  });
});
