// @flow
import { toMeshCode as latLngToFirstMesh } from './firstMeshCalculator'
import {
  FIRST_MAX_DIGIT,
  SECOND_MAX_DIGIT,
  calcNextPoints,
  calcPrevPoints,
} from './meshCalculator'

import type { Bounds, LatLng } from './meshCalculator'

export const toCenterLatLng = (meshCode: string): LatLng => {
  if (!meshCode.match(/\d{6}/)) {
    throw new Error(
      `Invalid mesh code found.
Only numbers are acceptable.
Actual mesh code is ${meshCode}.`
    )
  }
  const y1 = parseInt(meshCode.substr(0, 2), 10)
  const x1 = parseInt(meshCode.substr(2, 2), 10)
  const y2 = parseInt(meshCode.substr(4, 1), 10)
  const x2 = parseInt(meshCode.substr(5), 10)

  if (y2 > 7 || x2 > 7) {
    throw new Error(
      `Invalid mesh code found.
Only [0-7] are acceptable in second division.
Actual mesh code is ${meshCode}.`
    )
  }

  return {
    lat: (y1 + y2 / 8) / 1.5 + 1 / 24,
    lng: x1 + x2 / 8 + 100 + 1 / 16,
  }
}

export const toBounds = (meshCode: string): Bounds => {
  if (!meshCode.match(/\d{6}/)) {
    throw new Error(
      `Invalid mesh code found.
Only numbers are acceptable.
Actual mesh code is ${meshCode}.`
    )
  }

  const y1 = parseInt(meshCode.substr(0, 2), 10)
  const x1 = parseInt(meshCode.substr(2, 2), 10)
  const y2 = parseInt(meshCode.substr(4, 1), 10)
  const x2 = parseInt(meshCode.substr(5), 10)

  if (y2 > 7 || x2 > 7) {
    throw new Error(
      `Invalid mesh code found.
Only [0-7] are acceptable in second division.
Actual mesh code is ${meshCode}.`
    )
  }

  const cy = (y1 + y2 / 8) / 1.5
  const cx = x1 + x2 / 8 + 100

  return {
    leftTop: { lat: cy + 1 / 12, lng: cx },
    rightBottom: { lat: cy, lng: cx + 1 / 8 },
  }
}

export const toMeshCode = (lat: number, lng: number): string => {
  const y1 = lat * 1.5
  const x1 = lng - 100

  const y2 = `${Math.trunc((y1 - Math.trunc(y1)) * 8)}`
  const x2 = `${Math.trunc((x1 - Math.trunc(x1)) * 8)}`
  return `${latLngToFirstMesh(lat, lng)}-${y2}${x2}`
}

export const offset = (
  mesh: string,
  offsetX: number,
  offsetY: number
): string => {
  if (!mesh.match(/\d{6}/)) {
    throw new Error(
      `Invalid mesh code found.
Only numbers are acceptable.
Actual mesh code is ${mesh}.`
    )
  }

  const y1 = parseInt(mesh.substr(0, 2), 10)
  const x1 = parseInt(mesh.substr(2, 2), 10)
  const y2 = parseInt(mesh.substr(4, 1), 10)
  const x2 = parseInt(mesh.substr(5), 10)

  const calcOffsetY = offsetY > 0 ? calcNextPoints : calcPrevPoints
  let ys = [
    { value: y1, maxDigit: FIRST_MAX_DIGIT },
    { value: y2, maxDigit: SECOND_MAX_DIGIT },
  ]
  Array(Math.abs(offsetY))
    .fill()
    .forEach(() => {
      ys = calcOffsetY(ys)
    })

  const calcOffsetX = offsetX > 0 ? calcNextPoints : calcPrevPoints
  let xs = [
    { value: x1, maxDigit: FIRST_MAX_DIGIT },
    { value: x2, maxDigit: SECOND_MAX_DIGIT },
  ]
  Array(Math.abs(offsetX))
    .fill()
    .forEach(() => {
      xs = calcOffsetX(xs)
    })

  return `${ys[0].value}${xs[0].value}${ys[1].value}${xs[1].value}`
}
