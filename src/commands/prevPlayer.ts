import { Command } from '../command'
import { GameState } from '../gameState'

export default class PreviousPlayer extends Command {

  execute(invoker: string, state: GameState) {
    return new Promise(resolve => {
      state.previousPlayer()
      resolve()
    })
  }

  undo(state: GameState) {
    return new Promise(resolve => {
      state.nextPlayer()
      resolve()
    })
  }

}
