import test from 'ava'
import { Base } from '../../../app/cardsGame'

test.beforeEach('prepares some dummie children', t => {
  t.context.things = new Base({ name: 'root' })
  t.context.human = new Base({ type: 'human', name: 'Darek' })
  t.context.fruityBag = new Base({ type: 'bag', name: 'fruits' })
  t.context.veggieBag = new Base({ type: 'bag', name: 'vegetables' })
  const children = [
    t.context.human,
    t.context.fruityBag,
    t.context.veggieBag,
    new Base({ type: 'vegetable', name: 'radish' }),
    new Base({ type: 'vegetable', name: 'potato' }),
    new Base({ type: 'fruit', name: 'banana' }),
  ]
  t.context.fruityBag.addChild(new Base({
    type: 'fruit', name: 'apple'
  }))
  t.context.fruityBag.addChild(new Base({
    type: 'fruit', name: 'orange'
  }))
  t.context.veggieBag.addChild(new Base({
    type: 'vegetable', name: 'carrot'
  }))
  t.context.veggieBag.addChild(new Base({
    type: 'vegetable', name: 'garlic'
  }))
  t.context.veggieBag.addChild(new Base({
    type: 'vegetable', name: 'potato'
  }))
  children.forEach(el => t.context.things.addChild(el))
})

test.afterEach.always('clears all objects from Base', () => {
  Base._clear()
})

test('testing data', t => {
  t.is(t.context.things.children.length, 6, `confirm it's 6 root elements`)

  t.context.things.children.forEach(el => {
    t.true(typeof el === 'string', `some things are not ID STRINGS!`)
  })
})

test('constructor', t => {
  t.notThrows(() => {
    new Base()
  }, `doesn't throw`)
})

test('parent is updated with new child', t => {
  const parent = new Base({
    name: 'parent',
    onUpdate: self => {
      t.deepEqual(self.id, parent.id, `ids don't match!`)
      t.deepEqual(self, parent, `self context is not correct`)
      t.true(self.children.length === 1, `children array didn't update`)
    }
  })
  t.true(parent.children.length === 0, `children array isn't empty`)
  const child = new Base({
    name: 'child',
    parentId: parent.id,
  })
  t.true(parent.children.length === 1, `children array doesn't have only 1 child`)
  t.deepEqual(parent.children[0], child.id, `first child id doesn't match`)
})

test('removeChild throws error', t => {
  t.throws(() => {
    t.context.things.removeChild(undefined)
  }, ReferenceError)
})

test('removeChild by ID', t => {
  t.is(t.context.things.children.length, 6, 'before test')
  t.context.things.removeChild(t.context.human.id)
  t.is(t.context.things.children.length, 5, 'should be less')
})

test('removeChild dont remove not my child', t => {
  t.is(t.context.fruityBag.children.length, 2, 'has 2 fruits')
  const veggie = t.context.veggieBag.children[0]

  t.context.fruityBag.removeChild(veggie)
  t.is(t.context.fruityBag.children.length, 2, `we didn't touch fruits`)
  t.is(t.context.veggieBag.children.length, 3, `that vegetable wasn't in fruity bag!`)
})

test('getAllByType', t => {
  t.is(t.context.things.getAllByType('bag').length, 2, `only 2 bags here`)
  t.is(t.context.things.getAllByType('fruit').length, 3, `there should be 3 fruits, one not in the bag`)
  t.is(t.context.things.getAllByType('vegetable').length, 5, `there should be 5 vegetables, 2 not in the bag`)

  const fruityBag = t.context.fruityBag
  t.is(fruityBag.getAllByType('fruit').length, 2, `2 fruits in the fruity bag`)
  t.is(fruityBag.getAllByType('vegetable').length, 0, `no vegetables in this bag`)

  const veggieBag = t.context.veggieBag
  t.is(veggieBag.getAllByType('vegetable').length, 3, `3 vegetables in the bag`)
  t.is(veggieBag.getAllByType('fruit').length, 0, `no fruits in this bag`)
})

test('addChild, adds at the top', t => {
  const newThing = new Base({name: 'corn'})
  t.context.veggieBag.addChild(newThing)
  t.is(t.context.veggieBag.children[t.context.veggieBag.children.length-1], newThing.id)
  t.deepEqual(t.context.veggieBag.top(), newThing)
})
