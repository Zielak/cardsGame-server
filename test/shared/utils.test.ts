import test from 'ava'
import {
  exists, float
} from '../../shared/utils'

test('exists', t => {
  t.deepEqual(exists(), false, `literally nothing passed to function`)

  t.deepEqual(exists(undefined), false, `just undefined`)

  t.deepEqual(exists(null), true, `purposefully left empty`)

  const o = {
    stillNothing: undefined,
    emptyString: '',
    something: 1243
  }
  t.deepEqual(exists(o.nothing), false, `not defined property of object`)
  t.deepEqual(exists(o.stillNothing), false, `defined 'undefined' in object`)
  t.deepEqual(exists(o.emptyString), true, `empty string`)
  t.deepEqual(exists(o.something), true, `emptysome number`)
})

test('float, default', t => {
  for (let i = 0; i <= 100; i++) {
    const tested = float()
    t.true(tested >= 0 && tested <= 1)
  }
})

test('float, custom', t => {
  for (let i = 0; i <= 100; i++) {
    const tested = float(-100, 100)
    t.true(tested >= -100 && tested <= 100)
  }
})
