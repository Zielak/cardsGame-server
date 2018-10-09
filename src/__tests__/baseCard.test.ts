import { BaseCard } from '../baseCard'

describe(`constructor`, () => {
  test(`default name and type values`, () => {
    const card = new BaseCard()
    expect(card.name).toBe(BaseCard.DEFAULT_TYPE)
    expect(card.type).toBe(BaseCard.DEFAULT_NAME)
  })
  test(`remembers custom name and type values`, () => {
    const card = new BaseCard({
      name: 'some card',
      type: 'classicalCard'
    })
    expect(card.name).toBe('some card')
    expect(card.type).toBe('classicalCard')
  })
})
describe(`show/hide`, () => {
  test(`changes faceUp state`, () => {
    const card = new BaseCard()
    expect(card.faceUp).toBe(false)
    card.show()
    expect(card.faceUp).toBe(true)
    card.hide()
    expect(card.faceUp).toBe(false)
  })
})
describe(`flip`, () => {
  test(`changes faceUp state`, () => {
    const card = new BaseCard()
    expect(card.faceUp).toBe(false)
    card.flip()
    expect(card.faceUp).toBe(true)
    card.flip()
    expect(card.faceUp).toBe(false)
  })
})
