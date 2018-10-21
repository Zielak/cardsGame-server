import { GameRoom, GameState, Deck, Pile, Hand, CreateGameServer, Row, Spread, ClassicCard, Container } from '../../'
import { IGameRoom, ActionsSet } from '../../src/gameRoom'

import { MoveCardsCommand } from './commands/moveCards'

class ContainersTest<T extends GameState> extends GameRoom<T> implements IGameRoom {

  name = 'ContainersTest'

  possibleActions: ActionsSet = new Set([
    {
      command: MoveCardsCommand,
      interactionTarget: { type: 'card' }
    },
  ])

  onSetupGame() {
    const deck = new Deck({
      name: 'deck',
      x: -200,
      y: -200
    })
    this.state.containers.add(deck)

    const hand = new Hand({
      name: 'hand',
      x: 200,
      y: -200
    })
    this.state.containers.add(hand)

    const pile = new Pile({
      name: 'pile',
      x: 0,
      y: 0
    })
    this.state.containers.add(pile)

    const row = new Row({
      name: 'row',
      x: -200,
      y: 200
    })
    this.state.containers.add(row)

    const spread = new Spread({
      name: 'spread',
      x: 200,
      y: 200
    })
    this.state.containers.add(spread)

    const containers = [deck, hand, pile, row, spread]
    const CARDS_COUNT = 8
    const ALL_CARDS_COUNT = CARDS_COUNT * containers.length
    const cards: ClassicCard[] = []
    for (let i = 0; i < ALL_CARDS_COUNT; i++) {
      const card = new ClassicCard({
        suit: 'H',
        rank: i
      })
      cards.push(card)
      this.state.cards.add(card)
    }
    containers.forEach((container: Container) => {
      for (let i = 0; i < CARDS_COUNT; i++) {
        container.addChild(cards.pop())
      }
    })
  }

  onStartGame() {
    // const hands: Hand[] = []
    // for (let clientId in this.state.clients) {
    //   const player = new Player({
    //     clientId,
    //     name: randomName()
    //   })

    //   const hand = new Hand({
    //     parent: player,
    //     name: 'hand'
    //   })
    //   hands.push(hand)

    //   this.state.players.add(player)
    //   this.state.containers.add(hand)
    // }
    // const deck = this.state.containers.getByName('deck') as Deck
    // deck.deal(hands, 10)

    // console.log(`  starting game with ${this.state.players.length} players`)
  }

}


// This will init the server with one game type
CreateGameServer([ContainersTest])
