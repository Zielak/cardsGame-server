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

  test(`constructor doesn't throw`, () => {
    expect(() => { new BaseClass() }).not.toThrow()
  })

  test(`new element doesn't have parentID`, () => {
    const child = new BaseClass()
    expect(child.parentId).toBeNull()
  })

  test(`child with nonexistent parent, sets it to null`, () => {
    let child: BaseClass
    expect(() => {
      child = new BaseClass({ parentId: 'watwat' })
    }).not.toThrow()
    expect(child.parentId).toBeNull()
  })

  test(`constructor with parentID successfully adds to parent`, () => {
    const parent = new BaseClass()
    const child = new BaseClass({ parentId: parent.id })
    expect(parent.children.some(el => el.id === child.id)).toBe(true)
  })
})

describe('isMyChild', () => {
  test(`correctly guesses existing child`, () => {
    const parent = new BaseClass()
    const child = new BaseClass({ parentId: parent.id })
    expect(parent.isMyChild(child))
  })
  test(`correctly guesses not my child`, () => {
    const parent = new BaseClass()
    const sibling = new BaseClass()
    expect(parent.isMyChild(sibling))
  })
})

describe('complex tests', () => {

  test('testing data', () => {
    expect(context.things.children.length).toBe(6)

    context.things.children.forEach(el => {
      expect(typeof el).toBe('object')
    })
    context.things.childrenIDs.list.forEach(el => {
      expect(typeof el).toBe('string')
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
    expect(parent.top.id).toBe(child.id)
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

  test('removeChild by ID', () => {
    expect(context.things.children.length).toBe(6)
    context.things.removeChild(context.human.id)
    expect(context.things.children.length).toBe(5)
    expect(context.things.isMyChild(context.human)).toBe(false)
  })

  test(`removeChild doesn't remove not my child`, () => {
    expect(context.fruityBag.children.length).toBe(2)
    const veggie = context.veggieBag.top

    expect(() => {
      context.fruityBag.removeChild(veggie)
    }).toThrowError(ReferenceError)
    expect(context.fruityBag.children.length).toBe(2)
    expect(context.veggieBag.children.length).toBe(3)
  })

})

describe('removeChild', () => {
  test('throws reference error', () => {
    expect(() => {
      context.things.removeChild(undefined)
    }).toThrowError(ReferenceError)
  })
})


describe('addChild', () => {

  test('adds to ChildrenIDs', () => {
    const parent = new BaseClass()
    const child = new BaseClass()
    parent.addChild(child)

    // Available directly
    expect(parent.childrenIDs[child.id]).toBe(child.id)
    // And through list array
    expect(parent.childrenIDs.list.some(id => id === child.id)).toBe(true)
  })
  test('adds at the top', () => {
    const newThing = new BaseClass()
    context.veggieBag.addChild(newThing)

    expect(context.veggieBag.top.id).toEqual(newThing.id)
  })
  test('order, adding somewhere in the middle', () => {
    const child = new BaseClass()
    context.things.addChild(child, 3)

    expect(child.order).toBe(3)
    expect(context.things.children[3].id).toBe(child.id)
  })
  test('order, Infinity will just get to last', () => {
    const child = new BaseClass()
    context.things.addChild(child, Infinity)

    expect(child.order).toBe(context.things.children.length - 1)
    expect(context.things.top.id).toBe(child.id)
  })

})
