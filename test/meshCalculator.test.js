// @flow
import test from 'ava'
import { meshToLatLng, latLngToMesh, meshToBounds, panMeshByOffset } from '../src/meshCalculator'

// ---
// meshToLatLng
// ---
test('Should throw error when mesh is 533', t => {
  const mesh = '533'
  const error = t.throws(() => {
    meshToLatLng(mesh)
  })

  t.is(
    error.message,
    `Invalid mesh code found.
The length of the mesh code is 4, 6, or 8.
The actual length is 3, the mesh code is 533.`
  )
})

test('Should convert mesh 5339 to LatLng', t => {
  const mesh = '5339'
  const expected = {
    lat: 53 / 1.5 + 1 / 3,
    lng: 39 + 100 + 1 / 2
  }
  t.deepEqual(meshToLatLng(mesh), expected)
})

test('Should throw an error when mesh is 533a', t => {
  const mesh = '533a'
  const error = t.throws(() => {
    meshToLatLng(mesh)
  })

  t.is(
    error.message,
    `Invalid mesh code found.
Only numbers are acceptable.
Actual mesh code is ${mesh.replace(/-/g, '')}.`
  )
})

test('Should convert mesh 5339-35 to LatLng', t => {
  const mesh = '5339-35'
  const expected = {
    lat: (53 + 3 / 8) / 1.5 + 1 / 24,
    lng: 39 + 5 / 8 + 100 + 1 / 16
  }
  t.deepEqual(meshToLatLng(mesh), expected)
})

test('Should throw an error when mesh is 5339-3a', t => {
  const mesh = '5339-3a'
  const error = t.throws(() => {
    meshToLatLng(mesh)
  })

  t.is(
    error.message,
    `Invalid mesh code found.
Only numbers are acceptable.
Actual mesh code is ${mesh.replace(/-/g, '')}.`
  )
})

test('Should throw an error when mesh is 5339-85', t => {
  const mesh = '5339-85'
  const error = t.throws(() => {
    meshToLatLng(mesh)
  })
  t.is(
    error.message,
    `Invalid mesh code found.
Only [0-7] are acceptable in second division.
Actual mesh code is ${mesh.replace(/-/g, '')}.`
  )
})

test('Should convert mesh 5339-35-97 to LatLng', t => {
  const mesh = '5339-35-97'
  const expected = {
    lat: (53 + (3 + 9 / 10) / 8) / 1.5 + 1 / 240,
    lng: 39 + (5 + 7 / 10) / 8 + 100 + 1 / 160
  }
  t.deepEqual(meshToLatLng(mesh), expected)
})

test('Should throw an error when mesh is 5339-38-97', t => {
  const mesh = '5339-38-97'
  const error = t.throws(() => {
    meshToLatLng(mesh)
  })
  t.is(
    error.message,
    `Invalid mesh code found.
Only [0-7] are acceptable in second division.
Actual mesh code is ${mesh.replace(/-/g, '')}.`
  )
})

test('Should throw an error when mesh is 5339-35-9a', t => {
  const mesh = '5339-35-9a'
  const error = t.throws(() => {
    meshToLatLng(mesh)
  })
  t.is(
    error.message,
    `Invalid mesh code found.
Only numbers are acceptable.
Actual mesh code is ${mesh.replace(/-/g, '')}.`
  )
})

test('Should throw an error when mesh is 5339-35-97-12', t => {
  const mesh = '5339-35-97-12'
  const error = t.throws(() => {
    meshToLatLng(mesh)
  })
  t.is(
    error.message,
    `Invalid mesh code found.
The length of the mesh code is 4, 6, or 8.
The actual length is 10, the mesh code is 5339359712.`
  )
})

// ---
// meshToBounds
// ---
test('Should throw error when mesh is 533', t => {
  const mesh = '533'
  const error = t.throws(() => {
    meshToBounds(mesh)
  })
  t.is(
    error.message,
    `Invalid mesh code found.
The length of the mesh code is 4, 6, or 8.
The actual length is 3, the mesh code is 533.`
  )
})

test('Should convert mesh 5339 to bounds', t => {
  const mesh = '5339'
  const expected = {
    leftTop: {
      lat: 53 / 1.5 + 2 / 3,
      lng: 39 + 100
    },
    rightBottom: {
      lat: 53 / 1.5,
      lng: 39 + 100 + 1
    }
  }
  t.deepEqual(meshToBounds('5339'), expected)
})

test('Should throw error when mesh is 533a', t => {
  const mesh = '533a'
  const error = t.throws(() => {
    meshToBounds(mesh)
  })
  t.is(
    error.message,
    `Invalid mesh code found.
Only numbers are acceptable.
Actual mesh code is ${mesh.replace(/-/g, '')}.`
  )
})

test('Should convert mesh 5339-35 to bounds', t => {
  const mesh = '5339-35'
  const lat = (53 + 3 / 8) / 1.5
  const lng = 39 + 5 / 8 + 100
  const expected = {
    leftTop: {
      lat: lat + 1 / 12,
      lng: lng
    },
    rightBottom: {
      lat: lat,
      lng: lng + 1 / 8
    }
  }
  t.deepEqual(meshToBounds(mesh), expected)
})

test('Should throw error when mesh is 5339-3a', t => {
  const mesh = '5339-3a'
  const error = t.throws(() => {
    meshToBounds(mesh)
  })
  t.is(
    error.message,
    `Invalid mesh code found.
Only numbers are acceptable.
Actual mesh code is ${mesh.replace(/-/g, '')}.`
  )
})

test('Should throw error when mesh is 5339-95', t => {
  const mesh = '5339-95'
  const error = t.throws(() => {
    meshToBounds(mesh)
  })
  t.is(
    error.message,
    `Invalid mesh code found.
Only [0-7] are acceptable in second division.
Actual mesh code is ${mesh.replace(/-/g, '')}.`
  )
})

test('Should convert mesh 5339-35-97 to bounds', t => {
  const mesh = '5339-35-97'
  const lat = (53 + (3 + 9 / 10) / 8) / 1.5
  const lng = 39 + (5 + 7 / 10) / 8 + 100
  const expected = {
    leftTop: {
      lat: lat + 1 / 120,
      lng: lng
    },
    rightBottom: {
      lat: lat,
      lng: lng + 1 / 80
    }
  }
  t.deepEqual(meshToBounds(mesh), expected)
})

test('Should throw error when mesh is 5339-38-97', t => {
  const mesh = '5339-38-97'
  const error = t.throws(() => {
    meshToBounds(mesh)
  })
  t.is(
    error.message,
    `Invalid mesh code found.
Only [0-7] are acceptable in second division.
Actual mesh code is ${mesh.replace(/-/g, '')}.`
  )
})

test('Should throw error when mesh is 5339-35-9a', t => {
  const mesh = '5339-35-9a'
  const error = t.throws(() => {
    meshToBounds(mesh)
  })
  t.is(
    error.message,
    `Invalid mesh code found.
Only numbers are acceptable.
Actual mesh code is ${mesh.replace(/-/g, '')}.`
  )
})

test('Should throw error when mesh is 5339-35-97-12', t => {
  const mesh = '5339-35-97-12'
  const error = t.throws(() => {
    meshToBounds(mesh)
  })
  t.is(
    error.message,
    `Invalid mesh code found.
The length of the mesh code is 4, 6, or 8.
The actual length is 10, the mesh code is 5339359712.`
  )
})

// ---
// latLngToMesh
// ---
test('{ lat: 35.6638, lng: 139.71805, scale: 1 } to equal 5339', t => {
  t.is(latLngToMesh(35.6638, 139.71805, 1), '5339')
})

test('{ lat: 35.6638, lng: 139.71805, scale: 2 } to equal 5339-35', t => {
  t.is(latLngToMesh(35.6638, 139.71805, 2), '5339-35')
})

test('{ lat: 35.6638, lng: 139.71805, scale: 3 } to equal 5339-35-97', t => {
  t.is(latLngToMesh(35.6638, 139.71805, 3), '5339-35-97')
})

test('Should throw an error when LatLng is { lat: 35.6638, lng: 139.71805 }, scale is 4', t => {
  const error = t.throws(() => {
    latLngToMesh(35.6638, 139.71805, 4)
  })
  t.is(
    error.message,
    `Illegal scale found.
The scale range is [1-3].
The actual scale is 4.`
  )
})

// ---
// panMeshByOffset
// ---
test('Should pan 5339 to 6334', t => {
  t.is(panMeshByOffset('5339', -5, 10, 1), '6334')
})
