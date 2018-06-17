import { Command } from '../command'
import { GameState } from '../state'

export default class PreviousPlayer extends Command {

  execute(invoker: string, state: GameState) {
    state.players.prev()
  }

  undo(state: GameState) {
    state.players.next()
  }

}
