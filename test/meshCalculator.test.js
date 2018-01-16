// @flow
import test from 'ava'
import {
  scaleFrom,
  toCenterLatLng,
  toMeshCode,
  toBounds,
  offset,
} from '../src/meshCalculator'

// ---
// scale
// ---
test('Should get the scale corresponding to the zoom.', t => {
  t.is(scaleFrom(19), 3)
  t.is(scaleFrom(18), 3)
  t.is(scaleFrom(17), 3)
  t.is(scaleFrom(16), 3)
  t.is(scaleFrom(15), 3)
  t.is(scaleFrom(14), 3)

  t.is(scaleFrom(13), 2)
  t.is(scaleFrom(12), 2)
  t.is(scaleFrom(11), 2)

  t.is(scaleFrom(10), 1)
  t.is(scaleFrom(9), 1)
  t.is(scaleFrom(8), 1)
  t.is(scaleFrom(7), 1)
  t.is(scaleFrom(6), 1)
  t.is(scaleFrom(5), 1)
})

// ---
// toCenterLatLng
// ---
test('Should throw error when mesh is 533', t => {
  const mesh = '533'
  const error = t.throws(() => {
    toCenterLatLng(mesh)
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
    lng: 39 + 100 + 1 / 2,
  }
  t.deepEqual(toCenterLatLng(mesh), expected)
})

test('Should throw an error when mesh is 533a', t => {
  const mesh = '533a'
  const error = t.throws(() => {
    toCenterLatLng(mesh)
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
    lng: 39 + 5 / 8 + 100 + 1 / 16,
  }
  t.deepEqual(toCenterLatLng(mesh), expected)
})

test('Should throw an error when mesh is 5339-3a', t => {
  const mesh = '5339-3a'
  const error = t.throws(() => {
    toCenterLatLng(mesh)
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
    toCenterLatLng(mesh)
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
    lng: 39 + (5 + 7 / 10) / 8 + 100 + 1 / 160,
  }
  t.deepEqual(toCenterLatLng(mesh), expected)
})

test('Should throw an error when mesh is 5339-38-97', t => {
  const mesh = '5339-38-97'
  const error = t.throws(() => {
    toCenterLatLng(mesh)
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
    toCenterLatLng(mesh)
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
    toCenterLatLng(mesh)
  })
  t.is(
    error.message,
    `Invalid mesh code found.
The length of the mesh code is 4, 6, or 8.
The actual length is 10, the mesh code is 5339359712.`
  )
})

// ---
// toBounds
// ---
test('Should throw error when mesh is 533', t => {
  const mesh = '533'
  const error = t.throws(() => {
    toBounds(mesh)
  })
  t.is(
    error.message,
    `Invalid mesh code found.
The length of the mesh code is 4, 6, or 8.
The actual length is 3, the mesh code is 533.`
  )
})

test('Should convert mesh 5339 to bounds', t => {
  const meshCode = '5339'
  const expected = {
    leftTop: {
      lat: 53 / 1.5 + 2 / 3,
      lng: 39 + 100,
    },
    rightBottom: {
      lat: 53 / 1.5,
      lng: 39 + 100 + 1,
    },
  }
  t.deepEqual(toBounds(meshCode), expected)
})

test('Should throw error when mesh is 533a', t => {
  const mesh = '533a'
  const error = t.throws(() => {
    toBounds(mesh)
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
      lng: lng,
    },
    rightBottom: {
      lat: lat,
      lng: lng + 1 / 8,
    },
  }
  t.deepEqual(toBounds(mesh), expected)
})

test('Should throw error when mesh is 5339-3a', t => {
  const mesh = '5339-3a'
  const error = t.throws(() => {
    toBounds(mesh)
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
    toBounds(mesh)
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
      lng: lng,
    },
    rightBottom: {
      lat: lat,
      lng: lng + 1 / 80,
    },
  }
  t.deepEqual(toBounds(mesh), expected)
})

test('Should throw error when mesh is 5339-38-97', t => {
  const mesh = '5339-38-97'
  const error = t.throws(() => {
    toBounds(mesh)
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
    toBounds(mesh)
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
    toBounds(mesh)
  })
  t.is(
    error.message,
    `Invalid mesh code found.
The length of the mesh code is 4, 6, or 8.
The actual length is 10, the mesh code is 5339359712.`
  )
})

// ---
// toMeshCode
// ---
test('{ lat: 35.6638, lng: 139.71805, scale: 1 } to equal 5339', t => {
  t.is(toMeshCode(35.6638, 139.71805, 1), '5339')
})

test('{ lat: 35.6638, lng: 139.71805, scale: 2 } to equal 5339-35', t => {
  t.is(toMeshCode(35.6638, 139.71805, 2), '5339-35')
})

test('{ lat: 35.6638, lng: 139.71805, scale: 3 } to equal 5339-35-97', t => {
  t.is(toMeshCode(35.6638, 139.71805, 3), '5339-35-97')
})

test('{ lat: 35.000000000000014 lng: 1139.00000000000003, scale: 3 } to equal 5239-40-00', t => {
  t.is(toMeshCode(35.000000000000014, 139.00000000000003, 3), '5239-40-00')
})

test('Should throw an error when LatLng is { lat: 35.6638, lng: 139.71805 }, scale is 4', t => {
  const error = t.throws(() => {
    toMeshCode(35.6638, 139.71805, 4)
  })
  t.is(
    error.message,
    `Illegal scale found.
The scale range is [1-3].
The actual scale is 4.`
  )
})

// ---
// offset
// ---
test('Should pan 5339 to 6334', t => {
  t.is(offset('5339', -5, 10), '6334')
})

test('Should throw error when mesh is 533', t => {
  const mesh = '533'
  const error = t.throws(() => {
    offset(mesh, -5, 0)
  })
  t.is(
    error.message,
    `Invalid mesh code found.
The length of the mesh code is 4, 6, or 8.
The actual length is ${mesh.length}, the mesh code is ${mesh}.`
  )
})

test('Should throw error when mesh is 533a', t => {
  const mesh = '533a'
  const error = t.throws(() => {
    offset(mesh, -5, 0)
  })
  t.is(
    error.message,
    `Invalid mesh code found.
Only numbers are acceptable.
Actual mesh code is ${mesh}.`
  )
})

test('Should pan 533900 to 533912', t => {
  t.is(offset('533900', 2, 1), '533912')
})

test('Should pan 533900 to 533900', t => {
  t.is(offset('533900', 0, 0), '533900')
})

test('Should pan 533900 to 533912', t => {
  t.is(offset('533900', 2, -10), '513962')
})

test('Should throw error when mesh is 53390a', t => {
  const mesh = '53390a'
  const error = t.throws(() => {
    offset(mesh, -5, 0)
  })
  t.is(
    error.message,
    `Invalid mesh code found.
Only numbers are acceptable.
Actual mesh code is ${mesh}.`
  )
})

test('Should pan 53397080 to 54390100', t => {
  t.is(offset('53397080', 10, 2), '54390100')
})

test('Should pan 53397080 to 53397080', t => {
  t.is(offset('53397080', 0, 0), '53397080')
})

test('Should pan 53397080 to 54360000', t => {
  t.is(offset('53397080', -20, 2), '54380600')
})

test('Should throw error when mesh is 5339000a', t => {
  const mesh = '5339000a'
  const error = t.throws(() => {
    offset(mesh, -5, 0)
  })
  t.is(
    error.message,
    `Invalid mesh code found.
Only numbers are acceptable.
Actual mesh code is ${mesh}.`
  )
})
