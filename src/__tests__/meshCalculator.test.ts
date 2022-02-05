import {
  offset,
  scaleFrom,
  toBounds,
  toCenterLatLng,
  toMeshCode,
} from "../meshCalculator";

// ---
// scale
// ---
test("Should get the scale corresponding to the zoom.", () => {
  expect(scaleFrom(19)).toBe(3);
  expect(scaleFrom(18)).toBe(3);
  expect(scaleFrom(17)).toBe(3);
  expect(scaleFrom(16)).toBe(3);
  expect(scaleFrom(15)).toBe(3);
  expect(scaleFrom(14)).toBe(3);

  expect(scaleFrom(13)).toBe(2);
  expect(scaleFrom(12)).toBe(2);
  expect(scaleFrom(11)).toBe(2);

  expect(scaleFrom(10)).toBe(1);
  expect(scaleFrom(9)).toBe(1);
  expect(scaleFrom(8)).toBe(1);
  expect(scaleFrom(7)).toBe(1);
  expect(scaleFrom(6)).toBe(1);
  expect(scaleFrom(5)).toBe(1);
});

// ---
// toCenterLatLng
// ---
test("Should throw error when mesh is 533", () => {
  const mesh = "533";
  expect(() => toCenterLatLng(mesh)).toThrow(
    `Invalid mesh code found.
The length of the mesh code is 4, 6, or 8.
The actual length is 3, the mesh code is "533".`
  );
});

test("Should convert mesh 5339 to LatLng", () => {
  const mesh = "5339";
  const expected = {
    lat: 53 / 1.5 + 1 / 3,
    lng: 39 + 100 + 1 / 2,
  };
  expect(toCenterLatLng(mesh)).toEqual(expected);
});

test("Should throw an error when mesh is 533a", () => {
  const mesh = "533a";
  expect(() => toCenterLatLng(mesh)).toThrow(
    `Invalid mesh code found.
Only numbers are acceptable.
Actual mesh code is "${mesh.replace(/-/g, "")}".`
  );
});

test("Should convert mesh 5339-35 to LatLng", () => {
  const mesh = "5339-35";
  const expected = {
    lat: (53 + 3 / 8) / 1.5 + 1 / 24,
    lng: 39 + 5 / 8 + 100 + 1 / 16,
  };
  const ret = toCenterLatLng(mesh);
  expect(ret.lat).toBeCloseTo(expected.lat);
  expect(ret.lng).toBeCloseTo(expected.lng);
});

test("Should throw an error when mesh is 5339-3a", () => {
  const mesh = "5339-3a";
  expect(() => toCenterLatLng(mesh)).toThrow(
    `Invalid mesh code found.
Only numbers are acceptable.
Actual mesh code is "${mesh.replace(/-/g, "")}".`
  );
});

test("Should throw an error when mesh is 5339-85", () => {
  const mesh = "5339-85";
  expect(() => toCenterLatLng(mesh)).toThrow(
    `Invalid mesh code found.
Only [0-7] are acceptable in second division.
Actual mesh code is "${mesh.replace(/-/g, "")}".`
  );
});

test("Should convert mesh 5339-35-97 to LatLng", () => {
  const mesh = "5339-35-97";
  const expected = {
    lat: (53 + (3 + 9 / 10) / 8) / 1.5 + 1 / 240,
    lng: 39 + (5 + 7 / 10) / 8 + 100 + 1 / 160,
  };
  const ret = toCenterLatLng(mesh);
  expect(ret.lat).toBeCloseTo(expected.lat);
  expect(ret.lng).toBeCloseTo(expected.lng);
});

test("Should throw an error when mesh is 5339-38-97", () => {
  const mesh = "5339-38-97";
  expect(() => toCenterLatLng(mesh)).toThrow(
    `Invalid mesh code found.
Only [0-7] are acceptable in second division.
Actual mesh code is "${mesh.replace(/-/g, "")}".`
  );
});

test("Should throw an error when mesh is 5339-35-9a", () => {
  const mesh = "5339-35-9a";
  expect(() => toCenterLatLng(mesh)).toThrow(
    `Invalid mesh code found.
Only numbers are acceptable.
Actual mesh code is "${mesh.replace(/-/g, "")}".`
  );
});

test("Should throw an error when mesh is 5339-35-97-12", () => {
  const mesh = "5339-35-97-12";
  expect(() => toCenterLatLng(mesh)).toThrow(
    `Invalid mesh code found.
The length of the mesh code is 4, 6, or 8.
The actual length is 10, the mesh code is "5339359712".`
  );
});

// ---
// toBounds
// ---
test("Should throw error when mesh is 533", () => {
  const mesh = "533";
  expect(() => toBounds(mesh)).toThrow(
    `Invalid mesh code found.
The length of the mesh code is 4, 6, or 8.
The actual length is 3, the mesh code is "${mesh}".`
  );
});

test("Should convert mesh 5339 to bounds", () => {
  const meshCode = "5339";
  const expected = {
    leftTop: {
      lat: 53 / 1.5 + 2 / 3,
      lng: 39 + 100,
    },
    rightBottom: {
      lat: 53 / 1.5,
      lng: 39 + 100 + 1,
    },
  };
  const ret = toBounds(meshCode);
  
  expect(ret.leftTop.lat).toBeCloseTo(expected.leftTop.lat);
  expect(ret.leftTop.lng).toBeCloseTo(expected.leftTop.lng);

  expect(ret.rightBottom.lat).toBeCloseTo(expected.rightBottom.lat);
  expect(ret.rightBottom.lng).toBeCloseTo(expected.rightBottom.lng);
});

test("Should throw error when mesh is 533a", () => {
  const mesh = "533a";
  expect(() => toBounds(mesh)).toThrow(
    `Invalid mesh code found.
Only numbers are acceptable.
Actual mesh code is "${mesh.replace(/-/g, "")}".`
  );
});

test("Should convert mesh 5339-35 to bounds", () => {
  const mesh = "5339-35";
  const lat = (53 + 3 / 8) / 1.5;
  const lng = 39 + 5 / 8 + 100;
  const expected = {
    leftTop: {
      lat: lat + 1 / 12,
      lng,
    },
    rightBottom: {
      lat,
      lng: lng + 1 / 8,
    },
  };
  const ret = toBounds(mesh);
  
  expect(ret.leftTop.lat).toBeCloseTo(expected.leftTop.lat);
  expect(ret.leftTop.lng).toBeCloseTo(expected.leftTop.lng);

  expect(ret.rightBottom.lat).toBeCloseTo(expected.rightBottom.lat);
  expect(ret.rightBottom.lng).toBeCloseTo(expected.rightBottom.lng);
});

test("Should throw error when mesh is 5339-3a", () => {
  const mesh = "5339-3a";
  expect(() => toBounds(mesh)).toThrow(
    `Invalid mesh code found.
Only numbers are acceptable.
Actual mesh code is "${mesh.replace(/-/g, "")}".`
  );
});

test("Should throw error when mesh is 5339-95", () => {
  const mesh = "5339-95";
  expect(() => toBounds(mesh)).toThrow(
    `Invalid mesh code found.
Only [0-7] are acceptable in second division.
Actual mesh code is "${mesh.replace(/-/g, "")}".`
  );
});

test("Should convert mesh 5339-35-97 to bounds", () => {
  const mesh = "5339-35-97";
  const lat = (53 + (3 + 9 / 10) / 8) / 1.5;
  const lng = 39 + (5 + 7 / 10) / 8 + 100;
  const expected = {
    leftTop: {
      lat: lat + 1 / 120,
      lng,
    },
    rightBottom: {
      lat,
      lng: lng + 1 / 80,
    },
  };
  const ret = toBounds(mesh);
  
  expect(ret.leftTop.lat).toBeCloseTo(expected.leftTop.lat);
  expect(ret.leftTop.lng).toBeCloseTo(expected.leftTop.lng);

  expect(ret.rightBottom.lat).toBeCloseTo(expected.rightBottom.lat);
  expect(ret.rightBottom.lng).toBeCloseTo(expected.rightBottom.lng);
});

test("Should throw error when mesh is 5339-38-97", () => {
  const mesh = "5339-38-97";
  expect(() => toBounds(mesh)).toThrow(
    `Invalid mesh code found.
Only [0-7] are acceptable in second division.
Actual mesh code is "${mesh.replace(/-/g, "")}".`
  );
});

test("Should throw error when mesh is 5339-35-9a", () => {
  const mesh = "5339-35-9a";
  expect(() => toBounds(mesh)).toThrow(
    `Invalid mesh code found.
Only numbers are acceptable.
Actual mesh code is "${mesh.replace(/-/g, "")}".`
  );
});

test("Should throw error when mesh is 5339-35-97-12", () => {
  const mesh = "5339-35-97-12";
  expect(() => toBounds(mesh)).toThrow(
    `Invalid mesh code found.
The length of the mesh code is 4, 6, or 8.
The actual length is 10, the mesh code is "5339359712".`
  );
});

// ---
// toMeshCode
// ---
test("{ lat: 35.6638, lng: 139.71805, scale: 1 } to equal 5339", () => {
  expect(toMeshCode(35.6638, 139.71805, 1)).toBe("5339");
});

test("{ lat: 35.6638, lng: 139.71805, scale: 2 } to equal 5339-35", () => {
  expect(toMeshCode(35.6638, 139.71805, 2)).toBe("5339-35");
});

test("{ lat: 35.6638, lng: 139.71805, scale: 3 } to equal 5339-35-97", () => {
  expect(toMeshCode(35.6638, 139.71805, 3)).toBe("5339-35-97");
});

test("{ lat: 35.000000000000014 lng: 1139.00000000000003, scale: 3 } to equal 5239-40-00", () => {
  expect(toMeshCode(35.000000000000014, 139.00000000000003, 3)).toBe(
    "5239-40-00"
  );
});

test("Should throw an error when LatLng is { lat: 35.6638, lng: 139.71805 }, scale is 4", () => {
  expect(() => toMeshCode(35.6638, 139.71805, 4)).toThrow(
    `Illegal scale found.
The scale range is [1-3].
The actual scale is 4.`
  );
});

// ---
// offset
// ---
test("Should pan 5339 to 6334", () => {
  expect(offset("5339", -5, 10)).toBe("6334");
});

test("Should throw error when mesh is 533", () => {
  const mesh = "533";
  expect(() => offset(mesh, -5, 0)).toThrow(
    `Invalid mesh code found.
The length of the mesh code is 4, 6, or 8.
The actual length is ${mesh.length}, the mesh code is "${mesh}".`
  );
});

test("Should throw error when mesh is 533a", () => {
  const mesh = "533a";
  expect(() => offset(mesh, -5, 0)).toThrow(
    `Invalid mesh code found.
Only numbers are acceptable.
Actual mesh code is "${mesh}".`
  );
});

test("Should pan 533900 to 533912", () => {
  expect(offset("533900", 2, 1)).toBe("533912");
});

test("Should pan 533900 to 533900", () => {
  expect(offset("533900", 0, 0)).toBe("533900");
});

test("Should pan 533900 to 533912", () => {
  expect(offset("533900", 2, -10)).toBe("513962");
});

test("Should throw error when mesh is 53390a", () => {
  const mesh = "53390a";
  expect(() => offset(mesh, -5, 0)).toThrow(
    `Invalid mesh code found.
Only numbers are acceptable.
Actual mesh code is "${mesh}".`
  );
});

test("Should offset 53397080 to 54390100", () => {
  expect(offset("53397080", 10, 2)).toBe("54390100");
});

test("Should offset 53397080 to 53397080", () => {
  expect(offset("53397080", 0, 0)).toBe("53397080");
});

test("Should offset 53397080 to 54360000", () => {
  expect(offset("53397080", -20, 2)).toBe("54380600");
});

test("Should throw error when mesh is 5339000a", () => {
  const mesh = "5339000a";
  expect(() => {
    offset(mesh, -5, 0);
  }).toThrow(
    `Invalid mesh code found.
Only numbers are acceptable.
Actual mesh code is "${mesh}".`
  );
});
