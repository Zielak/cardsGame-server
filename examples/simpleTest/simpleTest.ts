import { Conditions, GameRoom, GameState, Deck, Presets, Pile } from '../../'
import { IGameRoom } from '../../src/gameRoom'

import PlayCardCommand from './actions/playCard'

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

  setupGame() {
    const deck = new Deck({
      name: 'deck'
    })
    this.state.containers.add(deck)
    Presets.classicCards().forEach(card => {
      deck.addChild(card)
      this.state.cards.add(card)
    })

    /*const pile = */new Pile({
      name: 'pile'
    })
  }

  startGame() {
    // super()
  }

}
