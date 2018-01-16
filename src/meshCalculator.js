// @flow
import {
  toCenterLatLng as firstMeshCodeToCenterLatLng,
  toBounds as firstMeshCodeToBounds,
  toMeshCode as toFirstMeshCode,
  offset as offsetFirstMeshCode,
} from './firstMeshCalculator'

import {
  toCenterLatLng as secondMeshCodeToLatLng,
  toBounds as secondMeshCodeToBounds,
  toMeshCode as toSecondMeshCode,
  offset as offsetSecondMeshCode,
} from './secondMeshCalculator'

import {
  toCenterLatLng as thirdMeshCodeToLatLng,
  toBounds as thirdMeshCodeToBounds,
  toMeshCode as latLngToThirdMesh,
  offset as offsetThirdMeshCode,
} from './thirdMeshCalculator'

export type LatLng = {
  lat: number,
  lng: number,
}
export type Bounds = {
  leftTop: LatLng,
  rightBottom: LatLng,
}
export type Point = {
  value: number,
  maxDigit: number,
}

export const SCALES = [1, 2, 3]
export const FIRST_MAX_DIGIT = 99
export const SECOND_MAX_DIGIT = 7
export const THIRD_MAX_DIGIT = 9

/**
 * Get the scale corresponding to zoom.
 * @param {number} zoom zoom level
 * @returns {number} scale
 */
export const scaleFrom = (zoom: number): number => {
  if (zoom <= 19 && zoom >= 14) {
    return 3
  } else if (zoom <= 13 && zoom >= 11) {
    return 2
  }
  return 1
}

/**
 * Convert mesh to LatLng.
 *
 * @param {string} meshCode mesh code
 * @returns {LatLng} latitude and longitude
 */
export const toCenterLatLng = (meshCode: string): LatLng => {
  const newMeshCode = meshCode.replace(/-/g, '')
  const len = newMeshCode.length
  switch (len) {
    case 4:
      return firstMeshCodeToCenterLatLng(newMeshCode)
    case 6:
      return secondMeshCodeToLatLng(newMeshCode)
    case 8:
      return thirdMeshCodeToLatLng(newMeshCode)
    default:
      throw new Error(
        `Invalid mesh code found.
The length of the mesh code is 4, 6, or 8.
The actual length is ${newMeshCode.length}, the mesh code is ${newMeshCode}.`
      )
  }
}

/**
 * Convert mesh to bounds.
 * @param {string} meshCode mesh code
 * @returns {Bounds} bounds
 */
export const toBounds = (meshCode: string): Bounds => {
  const newMeshCode = meshCode.replace(/-/g, '')

  const len = newMeshCode.length
  switch (len) {
    case 4:
      return firstMeshCodeToBounds(newMeshCode)
    case 6:
      return secondMeshCodeToBounds(newMeshCode)
    case 8:
      return thirdMeshCodeToBounds(newMeshCode)
    default:
      throw new Error(
        `Invalid mesh code found.
The length of the mesh code is 4, 6, or 8.
The actual length is ${newMeshCode.length}, the mesh code is ${newMeshCode}.`
      )
  }
}

/**
 * Convert LatLng to mesh.
 *
 * @param {number} lat latitude
 * @param {number} lng longitude
 * @param {number} scale scale
 * @returns {string} mesh.
 */
export const toMeshCode = (lat: number, lng: number, scale: number): string => {
  switch (scale) {
    case 1:
      return toFirstMeshCode(lat, lng)
    case 2:
      return toSecondMeshCode(lat, lng)
    case 3:
      return latLngToThirdMesh(lat, lng)
    default:
      throw new Error(
        `Illegal scale found.
The scale range is [1-3].
The actual scale is ${scale}.`
      )
  }
}

export const calcNextPoints = (points: Array<Point>): Array<Point> => {
  const nextPoints = [...points]
  const last = nextPoints.length - 1
  nextPoints[last].value++
  for (let i = last; i > 0; i--) {
    if (nextPoints[i].value > nextPoints[i].maxDigit) {
      nextPoints[i].value = 0
      nextPoints[i - 1].value++
    } else {
      break
    }
  }
  return nextPoints
}

export const calcPrevPoints = (points: Array<Point>): Array<Point> => {
  const prevPoints = [...points]
  const last = prevPoints.length - 1
  prevPoints[last].value--
  for (let i = last; i > 0; i--) {
    if (prevPoints[i].value < 0) {
      prevPoints[i].value = prevPoints[i].maxDigit
      prevPoints[i - 1].value--
    } else {
      break
    }
  }
  return prevPoints
}

export const offset = (
  mesh: string,
  offsetX: number,
  offsetY: number
): string => {
  const newMesh = mesh.replace(/-/g, '')
  const len = newMesh.length
  switch (len) {
    case 4:
      return offsetFirstMeshCode(newMesh, offsetX, offsetY)
    case 6:
      return offsetSecondMeshCode(newMesh, offsetX, offsetY)
    case 8:
      return offsetThirdMeshCode(newMesh, offsetX, offsetY)
    default:
      throw new Error(
        `Invalid mesh code found.
The length of the mesh code is 4, 6, or 8.
The actual length is ${newMesh.length}, the mesh code is ${newMesh}.`
      )
  }
}
