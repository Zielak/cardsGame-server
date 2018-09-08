import {
  Command,
  Container,
  Deck,
  Pile,
  Hand,
  Player,
  GameState
} from '../../cardsGame'
import WarGame from '..'

import canStartGame from '../../cardsGame/conditions/canStartGame'

const randomName = () =>
  [1, 2, 3].map(() => Math.floor(Math.random() * 25 + 65)).map((e) => String.fromCharCode(e)).join('')

export default class GameStartCommand extends Command {

  context: { createdPlayers: Player[], createdContainers: Container[] }

  constructor() {
    super({
      createdPlayers: [],
      createdContainers: []
    }, [canStartGame])
  }

  // TODO: move all that init to the gameroom itself.
  // FIXME: ^ really? why?
  execute(invoker, state: GameState) {
    return new Promise((resolve/*, reject*/) => {
      // Gather players
      // state.clients.forEach(client => {
      [0, 1].forEach(client => {
        const newPlayer = new Player({
          clientId: '' + client,
          name: randomName(),
        })
        this.context.createdPlayers.push(newPlayer)
        state.players.add(newPlayer)
      })

      // Set the table, empty decks and rows
      state.players.list.forEach(player => {
        // TODO: remember all other created stuff, so we could undo() that later
        state.containers.add(new Deck({
          x: 20,
          parentId: player.id,
        }))
        state.containers.add(new Hand({
          parentId: player.id,
        }))
        state.containers.add(new Pile({
          parentId: player.id,
          name: 'stage',
          y: -20,
        }))
        state.containers.add(new Pile({
          parentId: player.id,
          name: 'dead heat',
          // a situation in or result of a race
          // in which two or more competitors are exactly even.
          y: -20,
          x: -20,
        }))
      })

      state.gameStart()

      // Deal all cards to players after delay
      const mainDeck = state.containers.find(container => container.name === WarGame.names.MainDeck) as Deck
      setTimeout(() => {
        // Get players decks
        const decks = state.players.map((player: Player) => {
          return player.getAllByType('deck')[0] as Deck
        })
        mainDeck.deal(decks)
      }, 500)
      mainDeck.on(Deck.events.DEALT, () => {
        setTimeout(() => {
          state.players.map((player: Player) => {
            const myDeck = player.getByType('deck') as Deck
            const myHand = player.getByType('hand') as Hand
            myDeck.deal(myHand as Container, 3)
          })
          resolve()
        }, 500)
      })
    })
  }

  undo() {
    return new Promise(resolve => {

      resolve()
    })
  }

}
