import { Command } from '../command'
import { GameState } from '../state';

export default class NextPlayer extends Command {

  execute(invoker: string, state: GameState) {
    state.players.next()
  }

  undo(state: GameState) {
    state.players.prev()
  }

}
