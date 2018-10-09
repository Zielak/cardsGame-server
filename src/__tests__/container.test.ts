import { Container } from '../container'
import { BaseCard } from '../baseCard'
import { Base } from '../base';

const sampleChildren = () => [
  new BaseCard({name: '0'}),
  new BaseCard({name: '1'}),
  new BaseCard({name: '2'}),
  new BaseCard({name: '3'}),
  new BaseCard({name: '4'}),
  new BaseCard({name: '5'})
]

afterEach(() => {
  Base._clear()
})

describe(`shuffle`, () => {
  test(`shuffles`, () => {
    const cont = new Container()
    cont.addChildren(sampleChildren())

    cont.shuffle()

    let matched = cont.children.length
    cont.children.forEach((child, idx) => {
      if (child.name !== '' + idx) {
        matched--
      }
    })
    expect(matched).toBeLessThan(cont.children.length)
  })
  test(`emits 'Container.events.SHUFFLED' event`, () => {
    const cont = new Container()
    cont.addChildren(sampleChildren())

    const emitSpy = jest.spyOn(cont, 'emit')

    cont.shuffle()

    expect(emitSpy).toBeCalledTimes(1)
    expect(emitSpy).toHaveBeenCalledWith(Container.events.SHUFFLED)
  })
})

// test(`length`)
