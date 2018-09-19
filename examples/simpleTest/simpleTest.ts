import { Conditions, GameRoom, GameState, Deck, Presets, Pile, Player, Hand } from '../../'
import { IGameRoom } from '../../src/gameRoom'

import PlayCardCommand from './actions/playCard'
import { randomName } from '../../src/utils';

export class SimpleTest<T extends GameState> extends GameRoom<T> implements IGameRoom {

  name = 'SimpleTest'

  possibleActions = new Set([
    new PlayCardCommand({
      conditions: [
        Conditions.isPlayersTurn, Conditions.isOwner
      ],
      interactionTarget: { type: 'card' }
    }),
  ])

  onSetupGame() {
    const deck = new Deck({
      name: 'deck',
      x: -150
    })
    this.state.containers.add(deck)
    Presets.classicCards().forEach(card => {
      deck.addChild(card)
      this.state.cards.add(card)
    })

    new Pile({
      name: 'pile'
    })
  }

  onStartGame() {
    const hands: Hand[] = []
    for (let clientId in this.state.clients) {
      const player = new Player({
        clientId,
        name: randomName()
      })

      const hand = new Hand({
        parent: player,
        name: 'hand'
      })
      hands.push(hand)

      this.state.players.add(player)
      this.state.containers.add(hand)
    }
    const deck = this.state.containers.getByName('deck') as Deck
    deck.deal(hands, 1)

    console.log(`  starting game with ${this.state.players.length} players`)
  }

}
