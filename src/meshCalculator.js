// @flow
import {
  meshToLatLng as firstMeshToLatLng,
  meshToBounds as firstMeshToBounds,
  latLngToMesh as latLngToFirstMesh,
  panMeshByOffset as panFirstMeshByOffset
} from './firstMeshCalculator'

import {
  meshToLatLng as secondMeshToLatLng,
  meshToBounds as secondMeshToBounds,
  latLngToMesh as latLngToSecondMesh,
  panMeshByOffset as panSecondMeshByOffset
} from './secondMeshCalculator'

import {
  meshToLatLng as thirdMeshToLatLng,
  meshToBounds as thirdMeshToBounds,
  latLngToMesh as latLngToThirdMesh,
  panMeshByOffset as panThirdMeshByOffset
} from './thirdMeshCalculator'

export type LatLng = {
  lat: number,
  lng: number
}
export type Bounds = {
  leftTop: LatLng,
  rightBottom: LatLng
}
type Point = {
  value: number,
  maxDigit: number
}

export const SCALES = [1, 2, 3]
const FIRST_MAX_DIGIT = 99
const SECOND_MAX_DIGIT = 7
const THIRD_MAX_DIGIT = 9

/**
 * Get the scale corresponding to zoom.
 * @param zoom zoom
 * @returns {number} scale
 */
export function getScaleWith(zoom: number): number {
  switch (zoom) {
    case 19:
      return 3
    case 18:
      return 3
    case 17:
      return 3
    case 16:
      return 3
    case 15:
      return 3
    case 14:
      return 3
    case 13:
      return 2
    case 12:
      return 2
    case 11:
      return 2
    case 10:
      return 1
    case 9:
      return 1
    case 8:
      return 1
    case 7:
      return 1
    case 6:
      return 1
    default:
      return 1
  }
}

/**
 * Convert mesh to LatLng.
 *
 * @param mesh mesh
 * @returns {LatLng} latitude and longitude
 */
export function meshToLatLng(mesh: string): LatLng {
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

// /**
//  * Convert first mesh to LatLng.
//  *
//  * @param mesh first mesh
//  * @returns {LatLng} latitude and longitude
//  */
// function firstMeshToLatLng(mesh: string): LatLng {
//   if (!mesh.match(/\d{4}/)) {
//     throw new Error(
//       `Invalid mesh code found.
// Only numbers are acceptable.
// Actual mesh code is ${mesh}.`
//     )
//   }
//   const meshLat = parseInt(mesh.substr(0, 2))
//   const meshLng = parseInt(mesh.substr(2))
//   return {
//     lat: meshLat / 1.5 + 1 / 3,
//     lng: meshLng + 100 + 1 / 2
//   }
// }

// /**
//  * Convert second mesh to LatLng.
//  *
//  * @param mesh second mesh
//  * @returns {LatLng} latitude and longitude
//  */
// function secondMeshToLatLng(mesh: string): LatLng {
//   if (!mesh.match(/\d{6}/)) {
//     throw new Error(
//       `Invalid mesh code found.
// Only numbers are acceptable.
// Actual mesh code is ${mesh}.`
//     )
//   }
//   const firstMeshLat = parseInt(mesh.substr(0, 2))
//   const firstMeshLng = parseInt(mesh.substr(2, 2))
//   const secondMeshLat = parseInt(mesh.substr(4, 1))
//   const secondMeshLng = parseInt(mesh.substr(5))

//   if (secondMeshLat > 7 || secondMeshLng > 7) {
//     throw new Error(
//       `Invalid mesh code found.
// Only [0-7] are acceptable in second division.
// Actual mesh code is ${mesh}.`
//     )
//   }

//   return {
//     lat: (firstMeshLat + secondMeshLat / 8) / 1.5 + 1 / 24,
//     lng: firstMeshLng + secondMeshLng / 8 + 100 + 1 / 16
//   }
// }

// /**
//  * Convert third mesh to LatLng.
//  *
//  * @param mesh third mesh
//  * @returns {LatLng} latitude and longitude
//  */
// function thirdMeshToLatLng(mesh: string): LatLng {
//   if (!mesh.match(/\d{8}/)) {
//     throw new Error(
//       `Invalid mesh code found.
// Only numbers are acceptable.
// Actual mesh code is ${mesh}.`
//     )
//   }

//   const firstMeshLat = parseInt(mesh.substr(0, 2))
//   const firstMeshLng = parseInt(mesh.substr(2, 2))
//   const secondMeshLat = parseInt(mesh.substr(4, 1))
//   const secondMeshLng = parseInt(mesh.substr(5, 1))
//   const thirdMeshLat = parseInt(mesh.substr(6, 1))
//   const thirdMeshLng = parseInt(mesh.substr(7))

//   if (secondMeshLat > 7 || secondMeshLng > 7) {
//     throw new Error(
//       `Invalid mesh code found.
// Only [0-7] are acceptable in second division.
// Actual mesh code is ${mesh}.`
//     )
//   }

//   return {
//     lat:
//       (firstMeshLat + (secondMeshLat + thirdMeshLat / 10) / 8) / 1.5 + 1 / 240,
//     lng: firstMeshLng + (secondMeshLng + thirdMeshLng / 10) / 8 + 100 + 1 / 160
//   }
// }

/**
 * Convert mesh to bounds.
 * @param mesh mesh
 * @returns {Bounds} bounds
 */
export function meshToBounds(mesh: string): Bounds {
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

// /**
//  * Convert mesh to first mesh bounds.
//  * @param mesh mesh
//  * @returns {Bounds}
//  */
// function meshToFirstMeshBounds(mesh: string): Bounds {
//   if (!mesh.match(/\d{4}/)) {
//     throw new Error(
//       `Invalid mesh code found.
// Only numbers are acceptable.
// Actual mesh code is ${mesh}.`
//     )
//   }

//   const lat = parseInt(mesh.substr(0, 2))
//   const lng = parseInt(mesh.substr(2, 2))
//   const originLat = lat / 1.5
//   const originLng = lng + 100

//   return {
//     leftTop: { lat: originLat + 2 / 3, lng: originLng },
//     rightBottom: { lat: originLat, lng: originLng + 1 }
//   }
// }

// /**
//  * Convert mesh to second mesh bounds.
//  *
//  * @param mesh mesh
//  * @returns {Bounds}
//  */
// function meshToSecondMeshBounds(mesh: string): Bounds {
//   if (!mesh.match(/\d{6}/)) {
//     throw new Error(
//       `Invalid mesh code found.
// Only numbers are acceptable.
// Actual mesh code is ${mesh}.`
//     )
//   }

//   const firstLat = parseInt(mesh.substr(0, 2))
//   const firstLng = parseInt(mesh.substr(2, 2))
//   const secondMeshLat = parseInt(mesh.substr(4, 1))
//   const secondMeshLng = parseInt(mesh.substr(5))

//   if (secondMeshLat > 7 || secondMeshLng > 7) {
//     throw new Error(
//       `Invalid mesh code found.
// Only [0-7] are acceptable in second division.
// Actual mesh code is ${mesh}.`
//     )
//   }

//   const originLat = (firstLat + secondMeshLat / 8) / 1.5
//   const originLng = firstLng + secondMeshLng / 8 + 100

//   return {
//     leftTop: { lat: originLat + 1 / 12, lng: originLng },
//     rightBottom: { lat: originLat, lng: originLng + 1 / 8 }
//   }
// }

// /**
//  * Convert mesh to third mesh bounds.
//  *
//  * @param mesh mesh
//  * @returns {Bounds}
//  */
// function meshToThirdMeshBounds(mesh: string): Bounds {
//   if (!mesh.match(/\d{8}/)) {
//     throw new Error(
//       `Invalid mesh code found.
// Only numbers are acceptable.
// Actual mesh code is ${mesh}.`
//     )
//   }

//   const firstLat = parseInt(mesh.substr(0, 2))
//   const firstLng = parseInt(mesh.substr(2, 2))
//   const secondMeshLat = parseInt(mesh.substr(4, 1))
//   const secondMeshLng = parseInt(mesh.substr(5, 1))
//   const thirdMeshLat = parseInt(mesh.substr(6, 1))
//   const thirdMeshLng = parseInt(mesh.substr(7))

//   if (secondMeshLat > 7 || secondMeshLng > 7) {
//     throw new Error(
//       `Invalid mesh code found.
// Only [0-7] are acceptable in second division.
// Actual mesh code is ${mesh}.`
//     )
//   }

//   const originLat = (firstLat + (secondMeshLat + thirdMeshLat / 10) / 8) / 1.5
//   const originLng = firstLng + (secondMeshLng + thirdMeshLng / 10) / 8 + 100

//   return {
//     leftTop: { lat: originLat + 1 / 120, lng: originLng },
//     rightBottom: { lat: originLat, lng: originLng + 1 / 80 }
//   }
// }

/**
 * Convert LatLng to mesh.
 *
 * @param lat latitude
 * @param lng longitude
 * @param scale scale
 * @returns {string} mesh.
 */
export function latLngToMesh(lat: number, lng: number, scale: number): string {
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

// /**
//  * Convert LatLng to first mesh.
//  *
//  * @param lat latitude
//  * @param lng longitude
//  * @returns {string} first mesh
//  */
// function latLngToFirstMesh(lat: number, lng: number): string {
//   const meshLat = Math.trunc(lat * 1.5).toString()
//   const meshLng = Math.trunc(lng - 100).toString()
//   return meshLat + meshLng
// }

// /**
//  * Convert LatLng to second mesh.
//  *
//  * @param lat latitude
//  * @param lng longitude
//  * @returns {string} second mesh
//  */
// function latLngToSecondMesh(lat: number, lng: number): string {
//   const firstMeshLat = lat * 1.5
//   const firstMeshLng = lng - 100

//   const meshLat = `${Math.trunc((firstMeshLat - Math.trunc(firstMeshLat)) * 8)}`
//   const meshLng = `${Math.trunc((firstMeshLng - Math.trunc(firstMeshLng)) * 8)}`
//   return `${latLngToFirstMesh(lat, lng)}-${meshLat}${meshLng}`
// }

// /**
//  * Convert LatLng to third mesh.
//  *
//  * @param lat latitude
//  * @param lng longitude
//  * @returns {string} third mesh
//  */
// function latLngToThirdMesh(lat: number, lng: number): string {
//   const secondMeshLat = (lat * 1.5 - Math.trunc(lat * 1.5)) * 8
//   const secondMeshLng = (lng - 100 - Math.trunc(lng - 100)) * 8

//   const meshLat = `${Math.trunc((secondMeshLat - Math.trunc(secondMeshLat)) * 10)}`
//   const meshLng = `${Math.trunc((secondMeshLng - Math.trunc(secondMeshLng)) * 10)}`
//   return `${latLngToSecondMesh(lat, lng)}-${meshLat}${meshLng}`
// }

function calcNextPoints(points: Array<Point>): Array<Point> {
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

function calcPrevPoints(points: Array<Point>): Array<Point> {
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

export function panMeshByOffset(
  mesh: string,
  offsetX: number,
  offsetY: number
): string {
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

// function panFirstMeshByOffset(
//   mesh: string,
//   offsetX: number,
//   offsetY: number
// ): string {
//   if (!mesh.match(/\d{4}/)) {
//     throw new Error(
//       `Invalid mesh code found.
// Only numbers are acceptable.
// Actual mesh code is ${mesh}.`
//     )
//   }

//   const meshLat = parseInt(mesh.substr(0, 2))
//   const meshLng = parseInt(mesh.substr(2))

//   return `${meshLat + offsetY}${meshLng + offsetX}`
// }

// function panSecondMeshByOffset(
//   mesh: string,
//   offsetX: number,
//   offsetY: number
// ): string {
//   if (!mesh.match(/\d{6}/)) {
//     throw new Error(
//       `Invalid mesh code found.
// Only numbers are acceptable.
// Actual mesh code is ${mesh}.`
//     )
//   }

//   const y1 = parseInt(mesh.substr(0, 2))
//   const x1 = parseInt(mesh.substr(2, 2))
//   const y2 = parseInt(mesh.substr(4, 1))
//   const x2 = parseInt(mesh.substr(5))

//   const calcOffsetY = offsetY > 0 ? calcNextPoints : calcPrevPoints
//   let ys = [
//     { value: y1, maxDigit: FIRST_MAX_DIGIT },
//     { value: y2, maxDigit: SECOND_MAX_DIGIT }
//   ]
//   Array(Math.abs(offsetY)).fill().forEach(() => {
//     ys = calcOffsetY(ys)
//   })

//   const calcOffsetX = offsetX > 0 ? calcNextPoints : calcPrevPoints
//   let xs = [
//     { value: x1, maxDigit: FIRST_MAX_DIGIT },
//     { value: x2, maxDigit: SECOND_MAX_DIGIT }
//   ]
//   Array(Math.abs(offsetX)).fill().forEach(() => {
//     xs = calcOffsetX(xs)
//   })

//   return `${ys[0].value}${xs[0].value}${ys[1].value}${xs[1].value}`
// }

// function panThirdMeshByOffset(
//   mesh: string,
//   offsetX: number,
//   offsetY: number
// ): string {
//   if (!mesh.match(/\d{8}/)) {
//     throw new Error(
//       `Invalid mesh code found.
// Only numbers are acceptable.
// Actual mesh code is ${mesh}.`
//     )
//   }

//   const y1 = parseInt(mesh.substr(0, 2))
//   const x1 = parseInt(mesh.substr(2, 2))
//   const y2 = parseInt(mesh.substr(4, 1))
//   const x2 = parseInt(mesh.substr(5, 1))
//   const y3 = parseInt(mesh.substr(6, 1))
//   const x3 = parseInt(mesh.substr(7))

//   const calcOffsetY = offsetY > 0 ? calcNextPoints : calcPrevPoints
//   let ys: Array<Point> = [
//     { value: y1, maxDigit: FIRST_MAX_DIGIT },
//     { value: y2, maxDigit: SECOND_MAX_DIGIT },
//     { value: y3, maxDigit: THIRD_MAX_DIGIT }
//   ]
//   Array(Math.abs(offsetY)).fill().forEach(() => {
//     ys = calcOffsetY(ys)
//   })

//   const calcOffsetX = offsetX > 0 ? calcNextPoints : calcPrevPoints
//   let xs: Array<Point> = [
//     { value: x1, maxDigit: FIRST_MAX_DIGIT },
//     { value: x2, maxDigit: SECOND_MAX_DIGIT },
//     { value: x3, maxDigit: THIRD_MAX_DIGIT }
//   ]
//   Array(Math.abs(offsetX)).fill().forEach(() => {
//     xs = calcOffsetX(xs)
//   })

//   return `${ys[0].value}${xs[0].value}${ys[1].value}${xs[1].value}${ys[2]
//     .value}${xs[2].value}`
// }
