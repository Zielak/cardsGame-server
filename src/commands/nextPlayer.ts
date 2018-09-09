import { Command } from '../command'
import { GameState } from '../state';

export default class NextPlayer extends Command {

  execute(invoker: string, state: GameState) {
    return new Promise(resolve => {
      state.players.next()
      resolve()
    })
  }

  undo(state: GameState) {
    return new Promise(resolve => {
      state.players.prev()
      resolve()
    })
  }

}
