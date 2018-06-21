import {
  DefaultCommands, Command, Deck, Presets, GameState, GameRoom
} from '../cardsGame/index'

import GameStartCommand from './actions/gameStart'
import PlayCardCommand from './actions/playCard'
import DrawUpToThree from './actions/drawUpToThree'
import TestDeal from './actions/testDeal'

export default class WarGame extends GameRoom {

  setActions() {
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
