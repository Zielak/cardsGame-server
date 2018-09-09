import {
  DefaultCommands, Command, Deck, Presets, GameState, GameRoom
} from '../../src/cardsGame/index'

import GameStartCommand from './actions/gameStart'
import PlayCardCommand from './actions/playCard'
import DrawUpToThree from './actions/drawUpToThree'
import TestDeal from './actions/testDeal'
import { ObjectWithCommands } from '../../src/game'

export default class WarGame extends GameRoom {

  name = 'WarGame'

  setActions(): ObjectWithCommands {
    return {
      GameStart: new GameStartCommand(),
      PlayCard: new PlayCardCommand(),
      NextPlayer: new DefaultCommands.NextPlayer(),
      PrevPlayer: new DefaultCommands.PreviousPlayer(),
      DrawUpToThree: new DrawUpToThree(),
      TestDeal: new TestDeal()
    }
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
