import { GameState } from '../gameState'
import { Player } from '../player'
import { Base } from '../base'

const newPlayer = (id: string) => new Player({
  clientId: id
})

afterEach(() => {
  Base._clear()
})

describe(`nextPlayer`, () => {
  test(`increments +1 & returns player`, () => {
    const state = new GameState()
    const players = [
      state.players.add(newPlayer('1')),
      state.players.add(newPlayer('2')),
      state.players.add(newPlayer('3'))
    ]

    expect(state.nextPlayer()).toBe(players[1])

    expect(state.currentPlayerIdx).toBe(1)
    expect(state.currentPlayer).toBe(players[1])
  })


  test(`wraps back to first player`, () => {
    const state = new GameState()
    const players = [
      state.players.add(newPlayer('1')),
      state.players.add(newPlayer('2')),
      state.players.add(newPlayer('3'))
    ]
    state.nextPlayer()
    state.nextPlayer()

    expect(state.nextPlayer()).toBe(players[0])

    expect(state.currentPlayerIdx).toBe(0)
    expect(state.currentPlayer).toBe(players[0])
  })
})

describe(`previousPlayer`, () => {
  test(`decrements -1 & returns player`, () => {
    const state = new GameState()
    const players = [
      state.players.add(newPlayer('1')),
      state.players.add(newPlayer('2')),
      state.players.add(newPlayer('3'))
    ]

    state.nextPlayer()
    expect(state.previousPlayer()).toBe(players[0])

    expect(state.currentPlayerIdx).toBe(0)
    expect(state.currentPlayer).toBe(players[0])
  })


  test(`wraps back to last player`, () => {
    const state = new GameState()
    const players = [
      state.players.add(newPlayer('1')),
      state.players.add(newPlayer('2')),
      state.players.add(newPlayer('3'))
    ]

    expect(state.previousPlayer()).toBe(players[2])

    expect(state.currentPlayerIdx).toBe(2)
    expect(state.currentPlayer).toBe(players[2])
  })
})
