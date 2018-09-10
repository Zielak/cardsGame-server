import {
  DefaultCommands, Command, Deck, Presets, GameState, GameRoom, Server
} from '../../'

import GameStartCommand from './actions/gameStart'
import PlayCardCommand from './actions/playCard'
import DrawUpToThree from './actions/drawUpToThree'
import TestDeal from './actions/testDeal'
import { CommandsSet } from '../../src/game'
import { IGameRoom } from '../../src/gameRoom';

export default class WarGame extends GameRoom implements IGameRoom {

  name = 'WarGame'

  getCommands(): CommandsSet {
    return new Set([
      new GameStartCommand(),
      new PlayCardCommand(),
      new DefaultCommands.NextPlayer(),
      new DefaultCommands.PreviousPlayer(),
      new DrawUpToThree(),
      new TestDeal()
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

// This will init the server with one game type
Server([WarGame])
