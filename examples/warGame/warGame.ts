import {
  DefaultCommands, Command, Deck, Presets, GameState, GameRoom
} from '../../'

import GameStartCommand from './actions/gameStart'
import PlayCardCommand from './actions/playCard'
import DrawUpToThree from './actions/drawUpToThree'
import TestDeal from './actions/testDeal'
import { CommandsMap } from '../../src/game'
import { IGameRoom } from '../../src/gameRoom'

class WarGameState extends GameState {

}

export default class WarGame<T extends WarGameState> extends GameRoom<T> implements IGameRoom {

  name = 'WarGame'

  getGameState(): typeof GameState {
    return WarGameState
  }
  getCommands(): CommandsMap {
    return new Map([
      ['GameStart', new GameStartCommand()],
      ['PlayCard', new PlayCardCommand()],
      ['NextPlayer', new DefaultCommands.NextPlayer()],
      ['PreviousPlayer', new DefaultCommands.PreviousPlayer()],
      ['DrawUpToThree', new DrawUpToThree()],
      ['TestDeal', new TestDeal()]
    ])
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
