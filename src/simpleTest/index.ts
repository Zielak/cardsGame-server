import { GameRoom, Command } from '../cardsGame'

import GameStart from './actions/gameStart'

export default class SimpleTest extends GameRoom {

  setActions() {
    return {
      'GameStart': new GameStart()
    }
  }

  setupGame() {

  }

}
