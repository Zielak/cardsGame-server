import test from 'ava'
import {
  findAllParents
} from '../../shared/utils'
import uuid from 'uuid/v4'

test.beforeEach('prepare elements', t => {
  t.context.elements = []
  const elements = t.context.elements
  elements.push({
    name: 'root', id: uuid()
  })
  elements.push({
    name: 'parentA', id: uuid(), parent: elements[0].id
  })
  elements.push({
    name: 'parentB', id: uuid(), parent: elements[0].id
  })
  elements.push({
    name: 'childOfA', id: uuid(), parent: elements[1].id
  })
  elements.push({
    name: 'childOfB', id: uuid(), parent: elements[2].id
  })
  elements.push({
    name: 'nestedChildOfA', id: uuid(), parent: elements[3].id
  })
  elements.push({
    name: 'noRealParent', id: uuid(), parent: 'aaaaaaaaaaaaaaaa'
  })
})

test('returns empty array for root', t => {
  const actual = findAllParents(t.context.elements[0], t.context.elements)
  t.deepEqual(actual.length, 0)
  t.is(typeof actual, 'object')
  t.is(Array.isArray(actual), true)
})

test('returns empty array for inexisting parent', t => {
  const actual = findAllParents(t.context.elements[6], t.context.elements)
  t.is(actual.length, 0)
  t.is(typeof actual, 'object')
  t.is(Array.isArray(actual), true)
})

test('1 element for parentA', t => {
  t.deepEqual(
    findAllParents(t.context.elements[1], t.context.elements).length, 1,
    `didn't had exactly one parent element`
  )

  t.deepEqual(
    findAllParents(t.context.elements[1], t.context.elements),
    [t.context.elements[0]],
    `didn't return root element`
  )
})

test('1 element for parentB', t => {
  t.deepEqual(
    findAllParents(t.context.elements[2], t.context.elements).length, 1,
    `didn't had exactly 1 parent element`
  )

  t.deepEqual(
    findAllParents(t.context.elements[2], t.context.elements)[0],
    t.context.elements[0],
    `didn't return root element`
  )
})

test('2 element for childOfA', t => {
  t.deepEqual(
    findAllParents(t.context.elements[3], t.context.elements).length, 2,
    `didn't had exactly 2 parent elements`
  )
  t.deepEqual(
    findAllParents(t.context.elements[3], t.context.elements)[0],
    t.context.elements[0],
    `first element wasn't root`
  )
  t.deepEqual(
    findAllParents(t.context.elements[3], t.context.elements)[1],
    t.context.elements[1],
    `second element wasn't parentA`
  )
})

test('2 element for childOfB', t => {
  t.deepEqual(
    findAllParents(t.context.elements[4], t.context.elements).length, 2,
    `didn't had exactly 2 parent elements`
  )
  t.deepEqual(
    findAllParents(t.context.elements[4], t.context.elements)[0],
    t.context.elements[0],
    `first element wasn't root`
  )
  t.deepEqual(
    findAllParents(t.context.elements[4], t.context.elements)[1],
    t.context.elements[2],
    `second element wasn't parentB`
  )
})

test('nestedChildOfA', t => {

  t.deepEqual(
    findAllParents(t.context.elements[5], t.context.elements).length, 3,
    `didn't had exactly 3 parent elements`
  )

  t.deepEqual(
    findAllParents(t.context.elements[5], t.context.elements)[0],
    t.context.elements[0],
    `first element wasn't root`
  )

  t.deepEqual(
    findAllParents(t.context.elements[5], t.context.elements)[1],
    t.context.elements[1],
    `second element wasn't parentA`
  )

  t.deepEqual(
    findAllParents(t.context.elements[5], t.context.elements)[2],
    t.context.elements[3],
    `third element wasn't childOfA`
  )
})
