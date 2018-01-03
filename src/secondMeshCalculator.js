// @flow
import type { Bounds, LatLng } from './meshCalculator'

export const meshToLatLng = (meshCode: string): LatLng => {
  return {
    lat: 0,
    lng: 0
  }
}

export const meshToBounds = (meshCode: string): Bounds => {
  return {
    leftTop: { lat: 0, lng: 0 },
    rightBottom: { lat: 0, lng: 0 }
  }
}

export const latLngToMesh = (lat: number, lng: number): string => {
  return ''
}

export const panMeshByOffset = (
  mesh: string,
  offsetX: number,
  offsetY: number
): string => {
  return ''
}
