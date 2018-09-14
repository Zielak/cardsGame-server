import { Base } from '..'

class BaseClass extends Base { }

const context: { [key: string]: Base } = {}

beforeEach(() => {
  context.things = new BaseClass({ name: 'root' })
  context.human = new BaseClass({ type: 'human', name: 'Darek' })
  context.fruityBag = new BaseClass({ type: 'bag', name: 'fruits' })
  context.veggieBag = new BaseClass({ type: 'bag', name: 'vegetables' })

  const children = [
    context.human,
    context.fruityBag,
    context.veggieBag,
    new BaseClass({ type: 'vegetable', name: 'radish' }),
    new BaseClass({ type: 'vegetable', name: 'potato' }),
    new BaseClass({ type: 'fruit', name: 'banana' }),
  ]
  context.fruityBag.addChild(new BaseClass({
    type: 'fruit', name: 'apple'
  }))
  context.fruityBag.addChild(new BaseClass({
    type: 'fruit', name: 'orange'
  }))
  context.veggieBag.addChild(new BaseClass({
    type: 'vegetable', name: 'carrot'
  }))
  context.veggieBag.addChild(new BaseClass({
    type: 'vegetable', name: 'garlic'
  }))
  context.veggieBag.addChild(new BaseClass({
    type: 'vegetable', name: 'potato'
  }))
  children.forEach(el => context.things.addChild(el))
})

afterEach(() => {
  Base._clear()
})

describe('init', () => {
  test('testing data', () => {
    expect(context.things.children.length).toBe(6)

    context.things.children.list.forEach(el => {
      expect(typeof el).toBe('string')
    })
  })

  test('constructor', () => {
    expect(() => { new BaseClass() }).not.toThrow()
  })
})

test('parent is updated with new child', () => {
  const parent = new BaseClass({
    name: 'parent',
    onUpdate: self => {
      expect(self.id).toEqual(parent.id)
      expect(self).toBe(parent)
      expect(self.children.length).toBe(1)
    }
  })
  expect(parent.children.length).toBe(0)
  const child = new BaseClass({
    name: 'child',
    parentId: parent.id,
  })
  expect(parent.children.length).toBe(1)
  expect(parent.children.list[0]).toBe(child.id)
})

describe('removeChild', () => {
  test(' throws error', () => {
    expect(() => {
      context.things.removeChild(undefined)
    }).toThrowError(ReferenceError)
  })

  test('removeChild by ID', () => {
    expect(context.things.children.length).toBe(6)
    context.things.removeChild(context.human.id)
    expect(context.things.children.length).toBe(5)
  })

  test(`removeChild doesn't remove not my child`, () => {
    expect(context.fruityBag.children.length).toBe(2)
    const veggie = context.veggieBag.children.list[0]

    context.fruityBag.removeChild(veggie)
    expect(context.fruityBag.children.length).toBe(2)
    expect(context.veggieBag.children.length).toBe(3)
  })
})

test('getAllByType', () => {
  expect(context.things.getAllByType('bag').length).toBe(2)
  expect(context.things.getAllByType('fruit').length).toBe(3)
  expect(context.things.getAllByType('vegetable').length).toBe(5)

  const fruityBag = context.fruityBag
  expect(fruityBag.getAllByType('fruit').length).toBe(2)
  expect(fruityBag.getAllByType('vegetable').length).toBe(0)

  const veggieBag = context.veggieBag
  expect(veggieBag.getAllByType('vegetable').length).toBe(3)
  expect(veggieBag.getAllByType('fruit').length).toBe(0)
})

test('addChild, adds at the top', () => {
  const newThing = new BaseClass({ name: 'corn' })
  context.veggieBag.addChild(newThing)
  expect(context.veggieBag.top.id).toBe(newThing.id)
  expect(context.veggieBag.top).toEqual(newThing)
})
