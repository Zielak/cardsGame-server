import { EntityMap } from '../entityMap'
import { Player } from '../player'
import { Base } from '../base'

afterEach(() => {
  Base._clear()
})

describe('length', () => {

  test('starts empty with value 0', () => {
    const map = new EntityMap<Player>()
    expect(map.length).toBe(0)
  })

  test('returns proper value after adding', () => {
    const map = new EntityMap<Player>()

    map.add(new Player({ clientId: '0' }))
    expect(map.length).toBe(1)

    map.add(new Player({ clientId: '1' }))
    map.add(new Player({ clientId: '2' }))
    expect(map.length).toBe(3)
  })

  test('returns proper value after removing', () => {
    const map = new EntityMap<Player>()
    const player0 = new Player({ clientId: '0' })

    map.add(new Player({ clientId: '1' }))
    map.add(player0)
    map.add(new Player({ clientId: '2' }))
    map.add(new Player({ clientId: '3' }))

    map.remove(player0)
    expect(map.length).toBe(3)
  })

})
