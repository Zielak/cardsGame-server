import { Conditions, GameRoom, GameState, Deck, Presets, Pile } from '../../'
import { IGameRoom } from '../../src/gameRoom'

import PlayCardCommand from './actions/playCard'
import { CommandsMap } from '../../src/game'

export class SimpleTest<T extends GameState> extends GameRoom<T> implements IGameRoom {

  name = 'SimpleTest'

  /**
   * List of all possible commands to execute by players
   */
  getCommands(): CommandsMap {
    return new Map([
      ['PlayCard', new PlayCardCommand([
        Conditions.isPlayersTurn, Conditions.isClientPlaying
      ])]
    ])
  }

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
