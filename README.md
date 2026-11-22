# waffle-map-mesh-calculator-basic

[![npm version](https://badge.fury.io/js/waffle-map-mesh-calculator-basic.svg)](https://www.npmjs.com/package/waffle-map-mesh-calculator-basic)
[![npm](https://img.shields.io/npm/dw/waffle-map-mesh-calculator-basic.svg)](https://www.npmjs.com/package/waffle-map-mesh-calculator-basic)
[![Known Vulnerabilities](https://snyk.io/test/github/dorayakikun/waffle-map-mesh-calculator-basic/badge.svg?style=flat-square)](https://snyk.io/test/github/dorayakikun/waffle-map-mesh-calculator-basic)
[![code style: biome](https://img.shields.io/badge/code_style-biome-60a5fa?style=flat-square&logo=biome)](https://biomejs.dev/)
[![tested with vitest](https://img.shields.io/badge/tested_with-vitest-6E9F18?style=flat-square&logo=vitest)](https://vitest.dev/)
[![Node CI](https://github.com/dorayakikun/waffle-map-mesh-calculator-basic/workflows/Node%20CI/badge.svg)](https://github.com/dorayakikun/waffle-map-mesh-calculator-basic/actions)

A TypeScript/JavaScript library for calculating Japanese standard regional mesh codes (JIS X 0410 / 地域メッシュ).

For details of specifications, please see [地域メッシュ (Wikipedia)](https://ja.wikipedia.org/wiki/%E5%9C%B0%E5%9F%9F%E3%83%A1%E3%83%83%E3%82%B7%E3%83%A5).

## Requirements

- Node.js 22 or 24 (`>=22.12.0`)

## Installation

```bash
npm install waffle-map-mesh-calculator-basic
```

## Usage

```ts
import {
  offset,
  scaleFrom,
  toBounds,
  toCenterLatLng,
  toMeshCode,
} from "waffle-map-mesh-calculator-basic";

toMeshCode(35.6638, 139.71805, 1); // "5339"
toMeshCode(35.6638, 139.71805, 2); // "5339-35"
toMeshCode(35.6638, 139.71805, 3); // "5339-35-97"

toCenterLatLng("5339-35-97");
toBounds("5339-35-97");

offset("5339", -5, 10); // "6334"

scaleFrom(15); // 3
```

## API

- `toMeshCode(lat: number, lng: number, scale: number): string` — Convert latitude/longitude to a 1st (`1`), 2nd (`2`), or 3rd (`3`) mesh code.
- `toCenterLatLng(meshCode: string): LatLng` — Return `{ lat, lng }` for the center of a 4-, 6-, or 8-digit mesh code (hyphens ignored).
- `toBounds(meshCode: string): Bounds` — Return `{ leftTop, rightBottom }` for a 4-, 6-, or 8-digit mesh code (hyphens ignored).
- `offset(mesh: string, offsetX: number, offsetY: number): string` — Shift a mesh code by `(offsetX, offsetY)` grid cells.
- `scaleFrom(zoom: number): number` — Convert a map zoom level to a mesh scale (`1`, `2`, or `3`).
- `SCALES: number[]` — Supported mesh scales (`[1, 2, 3]`).

## Development

```bash
npm run typecheck
npm run check
npm run check:docs
npm run check:comments
npm run build
npm run test:coverage
npm run test:mutation
npm run test:mutation:diff
```

## License

MIT

## Author

- dorayakikun
