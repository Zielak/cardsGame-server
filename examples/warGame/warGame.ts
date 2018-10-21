import {
  DefaultCommands, Deck, Presets, GameState, GameRoom
} from '../../'

import GameStartCommand from './commands/gameStart'
import PlayCardCommand from './commands/playCard'
import DrawUpToThree from './commands/drawUpToThree'
import TestDeal from './commands/testDeal'
import { IGameRoom } from '../../src/gameRoom'

class WarGameState extends GameState {

}

export default class WarGame<T extends WarGameState> extends GameRoom<T> implements IGameRoom {

  name = 'WarGame'
  possibleActions = new Set([
    new GameStartCommand(),
    new PlayCardCommand(),
    new DefaultCommands.NextPlayer(),
    new DefaultCommands.PreviousPlayer(),
    new DrawUpToThree(),
    new TestDeal()
  ])

  getGameState(): typeof GameState {
    return WarGameState
  }

  setupGame() {
    const mainDeck = new Deck({
      x: 0, y: 0, name: WarGame.names.MainDeck
    })
    this.state.containers.add(mainDeck)

    // Setup all cards
    Presets.classicCards().forEach(card => {
      this.state.cards.add(card)
      mainDeck.addChild(card)
    })
  }

  static names = {
    MainDeck: 'mainDeck'
  }

}
