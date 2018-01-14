// @flow
import {
  meshToLatLng as firstMeshToLatLng,
  meshToBounds as firstMeshToBounds,
  latLngToMesh as latLngToFirstMesh,
  panMeshByOffset as panFirstMeshByOffset,
} from './firstMeshCalculator'

import {
  meshToLatLng as secondMeshToLatLng,
  meshToBounds as secondMeshToBounds,
  latLngToMesh as latLngToSecondMesh,
  panMeshByOffset as panSecondMeshByOffset,
} from './secondMeshCalculator'

import {
  meshToLatLng as thirdMeshToLatLng,
  meshToBounds as thirdMeshToBounds,
  latLngToMesh as latLngToThirdMesh,
  panMeshByOffset as panThirdMeshByOffset,
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
 * @param zoom zoom
 * @returns {number} scale
 */
export const getScaleWith = (zoom: number): number => {
  if (zoom <= 19 && zoom >= 14) {
    return 3
  } else if (zoom <= 13 && zoom >= 11) {
    return 2
  } else {
    return 1
  }
}

/**
 * Convert mesh to LatLng.
 *
 * @param mesh mesh
 * @returns {LatLng} latitude and longitude
 */
export const meshToLatLng = (mesh: string): LatLng => {
  const newMesh = mesh.replace(/-/g, '')
  const len = newMesh.length
  switch (len) {
    case 4:
      return firstMeshToLatLng(newMesh)
    case 6:
      return secondMeshToLatLng(newMesh)
    case 8:
      return thirdMeshToLatLng(newMesh)
    default:
      throw new Error(
        `Invalid mesh code found.
The length of the mesh code is 4, 6, or 8.
The actual length is ${newMesh.length}, the mesh code is ${newMesh}.`
      )
  }
}

/**
 * Convert mesh to bounds.
 * @param mesh mesh
 * @returns {Bounds} bounds
 */
export const meshToBounds = (mesh: string): Bounds => {
  const newMesh = mesh.replace(/-/g, '')

  const len = newMesh.length
  switch (len) {
    case 4:
      return firstMeshToBounds(newMesh)
    case 6:
      return secondMeshToBounds(newMesh)
    case 8:
      return thirdMeshToBounds(newMesh)
    default:
      throw new Error(
        `Invalid mesh code found.
The length of the mesh code is 4, 6, or 8.
The actual length is ${newMesh.length}, the mesh code is ${newMesh}.`
      )
  }
}

/**
 * Convert LatLng to mesh.
 *
 * @param lat latitude
 * @param lng longitude
 * @param scale scale
 * @returns {string} mesh.
 */
export const latLngToMesh = (
  lat: number,
  lng: number,
  scale: number
): string => {
  switch (scale) {
    case 1:
      return latLngToFirstMesh(lat, lng)
    case 2:
      return latLngToSecondMesh(lat, lng)
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

export const panMeshByOffset = (
  mesh: string,
  offsetX: number,
  offsetY: number
): string => {
  const newMesh = mesh.replace(/-/g, '')
  const len = newMesh.length
  switch (len) {
    case 4:
      return panFirstMeshByOffset(newMesh, offsetX, offsetY)
    case 6:
      return panSecondMeshByOffset(newMesh, offsetX, offsetY)
    case 8:
      return panThirdMeshByOffset(newMesh, offsetX, offsetY)
    default:
      throw new Error(
        `Invalid mesh code found.
The length of the mesh code is 4, 6, or 8.
The actual length is ${newMesh.length}, the mesh code is ${newMesh}.`
      )
  }
}
