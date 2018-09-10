import { Command } from '../command'
import { GameState } from '../gameState';

export default class NextPlayer extends Command {

  execute(invoker: string, state: GameState) {
    return new Promise(resolve => {
      state.nextPlayer()
      resolve()
    })
  }

  undo(state: GameState) {
    return new Promise(resolve => {
      state.previousPlayer()
      resolve()
    })
  }

}
