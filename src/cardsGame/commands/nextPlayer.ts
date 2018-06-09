import { Command } from '../command'

export default class NextPlayer extends Command {

  execute(invoker, state, reducer) {
    reducer.players.next(state)
  }

  undo(state, reducer) {
    reducer.players.prev(state)
  }

}
