import { Bounds, LatLng } from './meshCalculator'

export const toCenterLatLng = (meshCode: string): LatLng => {
  if (!meshCode.match(/\d{4}/)) {
    throw new Error(
      `Invalid mesh code found.
Only numbers are acceptable.
Actual mesh code is "${meshCode}".`
    )
  }
  const y1 = parseInt(meshCode.substr(0, 2), 10)
  const x1 = parseInt(meshCode.substr(2), 10)
  return {
    lat: y1 / 1.5 + 1 / 3,
    lng: x1 + 100 + 1 / 2,
  }
}

export const toBounds = (meshCode: string): Bounds => {
  if (!meshCode.match(/\d{4}/)) {
    throw new Error(
      `Invalid mesh code found.
Only numbers are acceptable.
Actual mesh code is "${meshCode}".`
    )
  }

  const y1 = parseInt(meshCode.substr(0, 2), 10)
  const x1 = parseInt(meshCode.substr(2, 2), 10)
  const cy = y1 / 1.5
  const cx = x1 + 100

  return {
    leftTop: { lat: cy + 2 / 3, lng: cx },
    rightBottom: { lat: cy, lng: cx + 1 },
  }
}

export const toMeshCode = (lat: number, lng: number): string => {
  const y1 = Math.trunc(lat * 1.5).toString()
  const x1 = Math.trunc(lng - 100).toString()
  return y1 + x1
}

export const offset = (
  meshCode: string,
  offsetX: number,
  offsetY: number
): string => {
  if (!meshCode.match(/\d{4}/)) {
    throw new Error(
      `Invalid mesh code found.
Only numbers are acceptable.
Actual mesh code is "${meshCode}".`
    )
  }

  const y1 = parseInt(meshCode.substr(0, 2), 10)
  const x1 = parseInt(meshCode.substr(2), 10)

  return `${y1 + offsetY}${x1 + offsetX}`
}
